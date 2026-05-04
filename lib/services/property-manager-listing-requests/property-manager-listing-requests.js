"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyManagerListingRequests = exports.propertyManagerListingRequestsMethods = exports.propertyManagerListingRequestsPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const merge_query_1 = require("../../hooks/merge-query");
const populate_roles_1 = require("../../hooks/populate-roles");
const require_role_1 = require("../../hooks/require-role");
const create_user_notification_1 = require("../../utils/create-user-notification");
const property_manager_listing_requests_class_1 = require("./property-manager-listing-requests.class");
const property_manager_listing_requests_schema_1 = require("./property-manager-listing-requests.schema");
exports.propertyManagerListingRequestsPath = 'property-manager-listing-requests';
exports.propertyManagerListingRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '');
const idQuery = (raw) => {
    if (mongodb_1.ObjectId.isValid(raw) && String(new mongodb_1.ObjectId(raw)) === raw)
        return { _id: new mongodb_1.ObjectId(raw) };
    return { _id: raw };
};
const rowById = async (app, id) => {
    const db = await app.get('mongodbClient');
    return db.collection('property_manager_listing_requests').findOne(idQuery(id));
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
    if (roles.includes('property_manager')) {
        (0, merge_query_1.mergeQuery)(context, { managerUserId: user._id.toString() });
        return context;
    }
    if (roles.includes('landlord')) {
        (0, merge_query_1.mergeQuery)(context, { landlordId: user._id.toString() });
        return context;
    }
    throw new errors_1.errors.Forbidden('You are not allowed to list these requests.');
};
const assertRowAccess = async (context, row) => {
    if (!context.params.provider)
        return;
    const user = context.params.user;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return;
    const uid = user._id?.toString();
    if (row.managerUserId === uid || row.landlordId === uid)
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
    context.params.__pmListingPrev = cur;
    return context;
};
const restrictPatch = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const prev = context.params.__pmListingPrev;
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
    const uid = user._id.toString();
    if (prev.landlordId === uid) {
        if (st !== 'accepted' && st !== 'rejected')
            throw new errors_1.errors.Forbidden('Landlords may only accept or reject requests.');
        if (prev.status !== 'pending')
            throw new errors_1.errors.BadRequest('Only pending requests can be decided.');
        context.data.reviewedBy = uid;
        context.data.reviewedAt = new Date().toISOString();
        return context;
    }
    if (prev.managerUserId === uid) {
        if (st !== 'withdrawn')
            throw new errors_1.errors.Forbidden('You may only withdraw your own pending request.');
        if (prev.status !== 'pending')
            throw new errors_1.errors.BadRequest('Only pending requests can be withdrawn.');
        return context;
    }
    throw new errors_1.errors.Forbidden('You cannot update this request.');
};
const preventRequestOnOwnListing = async (context) => {
    if (context.method !== 'create')
        return context;
    const d = context.data;
    if (String(d.landlordId || '') === String(d.managerUserId || '')) {
        throw new errors_1.errors.BadRequest('You cannot request to manage your own listing.');
    }
    return context;
};
const preventDuplicatePending = async (context) => {
    if (context.method !== 'create')
        return context;
    const d = context.data;
    if (!d?.managerUserId || !d?.propertyId)
        return context;
    const db = await context.app.get('mongodbClient');
    const dup = await db.collection('property_manager_listing_requests').findOne({
        propertyId: d.propertyId,
        managerUserId: d.managerUserId,
        status: 'pending'
    });
    if (dup)
        throw new errors_1.errors.BadRequest('You already have a pending request for this property.');
    return context;
};
const ensureRequesterIsPm = async (context) => {
    if (context.method !== 'create' || !context.params.provider)
        return context;
    const roles = Array.isArray(context.params.user?.roles)
        ? context.params.user.roles
        : [];
    if (roles.includes('admin'))
        return context;
    if (!roles.includes('property_manager'))
        throw new errors_1.errors.Forbidden('Only approved property managers can request to manage a listing.');
    return context;
};
const stripNonAdminManagerUserId = async (context) => {
    if (context.method !== 'create' || !context.params.provider)
        return context;
    const roles = Array.isArray(context.params.user?.roles)
        ? context.params.user.roles
        : [];
    if (!roles.includes('admin') && context.data && typeof context.data === 'object' && 'managerUserId' in context.data) {
        delete context.data.managerUserId;
    }
    return context;
};
const notifyLandlordOnCreate = async (context) => {
    const r = context.result;
    if (!r?.landlordId || !r?.propertyId)
        return context;
    await (0, create_user_notification_1.createUserNotification)(context.app, {
        userId: String(r.landlordId),
        eventKey: 'pm_listing_request.created',
        category: 'assignment',
        title: 'Property manager requested access',
        body: r.message ? String(r.message).slice(0, 280) : 'A property manager asked to help manage one of your listings.',
        linkUrl: `${appUrl()}/landlord/properties/${r.propertyId}`,
        relatedService: 'property-manager-listing-requests',
        relatedId: String(r._id),
        metadata: { propertyId: r.propertyId, managerUserId: r.managerUserId }
    });
    return context;
};
const notifyManagerOnDecision = async (context) => {
    const r = context.result;
    const prev = context.params.__pmListingPrev;
    if (!r?.managerUserId || !prev || prev.status === r.status)
        return context;
    if (r.status === 'accepted') {
        await (0, create_user_notification_1.createUserNotification)(context.app, {
            userId: String(r.managerUserId),
            eventKey: 'pm_listing_request.accepted',
            category: 'assignment',
            title: 'Management request accepted',
            body: 'The landlord accepted your request to help manage their property.',
            linkUrl: `${appUrl()}/landlord/properties`,
            relatedService: 'property-manager-listing-requests',
            relatedId: String(r._id)
        });
    }
    else if (r.status === 'rejected') {
        await (0, create_user_notification_1.createUserNotification)(context.app, {
            userId: String(r.managerUserId),
            eventKey: 'pm_listing_request.rejected',
            category: 'assignment',
            title: 'Management request declined',
            body: 'The landlord did not accept your request for this property.',
            linkUrl: `${appUrl()}/listings`,
            relatedService: 'property-manager-listing-requests',
            relatedId: String(r._id)
        });
    }
    return context;
};
const provisionAssignmentWhenAccepted = async (context) => {
    const r = context.result;
    const prev = context.params.__pmListingPrev;
    if (!r || r.status !== 'accepted' || !prev || prev.status === 'accepted')
        return context;
    const res = await context.app.service('property-manager-assignments').find({
        query: { propertyId: r.propertyId, managerUserId: r.managerUserId, $limit: 1 },
        paginate: false,
        provider: undefined
    });
    const data = Array.isArray(res) ? res : [];
    if (data.length)
        return context;
    await context.app.service('property-manager-assignments').create({
        propertyId: r.propertyId,
        managerUserId: r.managerUserId
    }, { provider: undefined });
    return context;
};
const propertyManagerListingRequests = (app) => {
    app.use(exports.propertyManagerListingRequestsPath, new property_manager_listing_requests_class_1.PropertyManagerListingRequestsService((0, property_manager_listing_requests_class_1.getOptions)(app)), {
        methods: exports.propertyManagerListingRequestsMethods,
        events: []
    });
    app.service(exports.propertyManagerListingRequestsPath).hooks({
        around: {
            all: [
                schema_1.hooks.resolveExternal(property_manager_listing_requests_schema_1.propertyManagerListingRequestExternalResolver),
                schema_1.hooks.resolveResult(property_manager_listing_requests_schema_1.propertyManagerListingRequestResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(property_manager_listing_requests_schema_1.propertyManagerListingRequestQueryValidator),
                schema_1.hooks.resolveQuery(property_manager_listing_requests_schema_1.propertyManagerListingRequestQueryResolver)
            ],
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
                (0, require_role_1.requireRole)('property_manager', 'admin'),
                ensureRequesterIsPm,
                stripNonAdminManagerUserId,
                schema_1.hooks.validateData(property_manager_listing_requests_schema_1.propertyManagerListingRequestDataValidator),
                schema_1.hooks.resolveData(property_manager_listing_requests_schema_1.propertyManagerListingRequestDataResolver),
                preventRequestOnOwnListing,
                preventDuplicatePending
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                loadRowForPatch,
                restrictPatch,
                schema_1.hooks.validateData(property_manager_listing_requests_schema_1.propertyManagerListingRequestPatchValidator),
                schema_1.hooks.resolveData(property_manager_listing_requests_schema_1.propertyManagerListingRequestPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, (0, require_role_1.requireRole)('admin')]
        },
        after: {
            create: [notifyLandlordOnCreate],
            patch: [provisionAssignmentWhenAccepted, notifyManagerOnDecision]
        }
    });
};
exports.propertyManagerListingRequests = propertyManagerListingRequests;
//# sourceMappingURL=property-manager-listing-requests.js.map