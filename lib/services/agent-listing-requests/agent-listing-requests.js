"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentListingRequests = exports.agentListingRequestsMethods = exports.agentListingRequestsPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const merge_query_1 = require("../../hooks/merge-query");
const populate_roles_1 = require("../../hooks/populate-roles");
const require_role_1 = require("../../hooks/require-role");
const create_user_notification_1 = require("../../utils/create-user-notification");
const agent_listing_requests_class_1 = require("./agent-listing-requests.class");
const agent_listing_requests_schema_1 = require("./agent-listing-requests.schema");
exports.agentListingRequestsPath = 'agent-listing-requests';
exports.agentListingRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '');
const idQuery = (raw) => {
    if (mongodb_1.ObjectId.isValid(raw) && String(new mongodb_1.ObjectId(raw)) === raw)
        return { _id: new mongodb_1.ObjectId(raw) };
    return { _id: raw };
};
const rowById = async (app, id) => {
    const db = await app.get('mongodbClient');
    return db.collection('agent_listing_requests').findOne(idQuery(id));
};
const restrictFind = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    if (roles.includes('agent')) {
        (0, merge_query_1.mergeQuery)(context, { agentUserId: user._id.toString() });
        return context;
    }
    if (roles.includes('landlord')) {
        (0, merge_query_1.mergeQuery)(context, { landlordId: user._id.toString() });
        return context;
    }
    throw new errors_1.errors.Forbidden('You are not allowed to list agent listing requests.');
};
const assertRowAccess = async (context, row) => {
    if (!context.params.provider)
        return;
    const user = context.params.user;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return;
    const uid = user._id?.toString();
    if (row.agentUserId === uid || row.landlordId === uid)
        return;
    throw new errors_1.errors.Forbidden('You cannot access this request.');
};
const loadRowForPatch = async (context) => {
    if (context.method !== 'patch')
        return context;
    const id = String(context.id || '');
    if (!id)
        throw new errors_1.errors.BadRequest('Missing id');
    const cur = await rowById(context.app, id);
    if (!cur)
        throw new errors_1.errors.NotFound('Request not found');
    context.params.__agentListingPrev = cur;
    return context;
};
const restrictPatch = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const prev = context.params.__agentListingPrev;
    if (!prev)
        return context;
    await assertRowAccess(context, prev);
    const st = context.data?.status;
    if (!st)
        throw new errors_1.errors.BadRequest('status is required');
    if (roles.includes('admin')) {
        if (!['accepted', 'rejected', 'withdrawn'].includes(st))
            throw new errors_1.errors.BadRequest('Invalid status');
        return context;
    }
    const uid = user._id?.toString();
    if (prev.landlordId === uid) {
        if (st !== 'accepted' && st !== 'rejected')
            throw new errors_1.errors.Forbidden('Landlords may only accept or reject requests.');
        if (prev.status !== 'pending')
            throw new errors_1.errors.BadRequest('Only pending requests can be decided.');
        context.data.reviewedBy = uid;
        context.data.reviewedAt = new Date().toISOString();
        return context;
    }
    if (prev.agentUserId === uid) {
        if (st !== 'withdrawn')
            throw new errors_1.errors.Forbidden('Agents may only withdraw their own pending request.');
        if (prev.status !== 'pending')
            throw new errors_1.errors.BadRequest('Only pending requests can be withdrawn.');
        return context;
    }
    throw new errors_1.errors.Forbidden('You cannot update this request.');
};
const preventDuplicatePending = async (context) => {
    if (context.method !== 'create')
        return context;
    const d = context.data;
    if (!d?.agentUserId || !d?.propertyId)
        return context;
    const db = await context.app.get('mongodbClient');
    const dup = await db.collection('agent_listing_requests').findOne({
        propertyId: d.propertyId,
        agentUserId: d.agentUserId,
        status: 'pending'
    });
    if (dup)
        throw new errors_1.errors.BadRequest('You already have a pending request for this property.');
    return context;
};
const preventSelfRequestAsLandlord = async (context) => {
    if (context.method !== 'create')
        return context;
    const d = context.data;
    if (d.landlordId && d.agentUserId && String(d.landlordId) === String(d.agentUserId)) {
        throw new errors_1.errors.BadRequest('You cannot request your own listing.');
    }
    return context;
};
const notifyLandlordOnCreate = async (context) => {
    const r = context.result;
    if (!r?.landlordId || !r?.propertyId)
        return context;
    await (0, create_user_notification_1.createUserNotification)(context.app, {
        userId: String(r.landlordId),
        eventKey: 'agent_listing_request.created',
        category: 'assignment',
        title: 'Agent requested to represent your listing',
        body: r.message ? String(r.message).slice(0, 280) : 'An agent asked to represent one of your properties.',
        linkUrl: `${appUrl()}/landlord/properties/${r.propertyId}`,
        relatedService: 'agent-listing-requests',
        relatedId: String(r._id),
        metadata: { propertyId: r.propertyId, agentUserId: r.agentUserId }
    });
    return context;
};
const notifyAgentOnDecision = async (context) => {
    const r = context.result;
    const prev = context.params.__agentListingPrev;
    if (!r?.agentUserId || !prev || prev.status === r.status)
        return context;
    if (r.status === 'accepted') {
        await (0, create_user_notification_1.createUserNotification)(context.app, {
            userId: String(r.agentUserId),
            eventKey: 'agent_listing_request.accepted',
            category: 'assignment',
            title: 'Listing request accepted',
            body: 'The landlord accepted your request to represent their property.',
            linkUrl: `${appUrl()}/properties/${r.propertyId}`,
            relatedService: 'agent-listing-requests',
            relatedId: String(r._id)
        });
    }
    else if (r.status === 'rejected') {
        await (0, create_user_notification_1.createUserNotification)(context.app, {
            userId: String(r.agentUserId),
            eventKey: 'agent_listing_request.rejected',
            category: 'assignment',
            title: 'Listing request declined',
            body: 'The landlord did not accept your request for this property.',
            linkUrl: `${appUrl()}/listings`,
            relatedService: 'agent-listing-requests',
            relatedId: String(r._id)
        });
    }
    return context;
};
const provisionAssignmentWhenAccepted = async (context) => {
    const r = context.result;
    const prev = context.params.__agentListingPrev;
    if (!r || r.status !== 'accepted' || !prev || prev.status === 'accepted')
        return context;
    const res = await context.app.service('agent-assignments').find({
        query: { propertyId: r.propertyId, agentUserId: r.agentUserId, $limit: 1 },
        paginate: false,
        provider: undefined
    });
    const data = Array.isArray(res) ? res : [];
    if (data.length)
        return context;
    await context.app.service('agent-assignments').create({
        propertyId: r.propertyId,
        agentUserId: r.agentUserId,
        commissionPercent: r.commissionPercent,
        agreementNote: r.message
    }, { provider: undefined });
    return context;
};
const stripNonAdminAgentUserId = async (context) => {
    if (context.method !== 'create' || !context.params.provider)
        return context;
    const roles = Array.isArray(context.params.user?.roles)
        ? context.params.user.roles
        : [];
    if (!roles.includes('admin') && context.data && typeof context.data === 'object' && 'agentUserId' in context.data) {
        delete context.data.agentUserId;
    }
    return context;
};
const agentListingRequests = (app) => {
    app.use(exports.agentListingRequestsPath, new agent_listing_requests_class_1.AgentListingRequestsService((0, agent_listing_requests_class_1.getOptions)(app)), {
        methods: exports.agentListingRequestsMethods,
        events: []
    });
    app.service(exports.agentListingRequestsPath).hooks({
        around: {
            all: [
                schema_1.hooks.resolveExternal(agent_listing_requests_schema_1.agentListingRequestExternalResolver),
                schema_1.hooks.resolveResult(agent_listing_requests_schema_1.agentListingRequestResolver)
            ]
        },
        before: {
            all: [schema_1.hooks.validateQuery(agent_listing_requests_schema_1.agentListingRequestQueryValidator), schema_1.hooks.resolveQuery(agent_listing_requests_schema_1.agentListingRequestQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictFind],
            get: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                async (ctx) => {
                    const row = await rowById(ctx.app, String(ctx.id || ''));
                    if (!row)
                        throw new errors_1.errors.NotFound('Request not found');
                    await assertRowAccess(ctx, row);
                    return ctx;
                }
            ],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                (0, require_role_1.requireRole)('agent', 'admin'),
                stripNonAdminAgentUserId,
                schema_1.hooks.validateData(agent_listing_requests_schema_1.agentListingRequestDataValidator),
                schema_1.hooks.resolveData(agent_listing_requests_schema_1.agentListingRequestDataResolver),
                preventDuplicatePending,
                preventSelfRequestAsLandlord
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                loadRowForPatch,
                restrictPatch,
                schema_1.hooks.validateData(agent_listing_requests_schema_1.agentListingRequestPatchValidator),
                schema_1.hooks.resolveData(agent_listing_requests_schema_1.agentListingRequestPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, (0, require_role_1.requireRole)('admin')]
        },
        after: {
            create: [notifyLandlordOnCreate],
            patch: [provisionAssignmentWhenAccepted, notifyAgentOnDecision]
        }
    });
};
exports.agentListingRequests = agentListingRequests;
//# sourceMappingURL=agent-listing-requests.js.map