"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentAssignments = exports.agentAssignmentsMethods = exports.agentAssignmentsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const agent_assignments_class_1 = require("./agent-assignments.class");
const agent_assignments_schema_1 = require("./agent-assignments.schema");
exports.agentAssignmentsPath = 'agent-assignments';
exports.agentAssignmentsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const attachAssignedBy = async (context) => {
    const user = context.params.user;
    if (user?._id)
        context.data.assignedBy = user._id.toString();
    return context;
};
/** After create: store agentUserId on the property document for fast lookup. */
const syncPropertyAgentOnCreate = async (context) => {
    const result = context.result;
    const { propertyId, agentUserId } = result || {};
    if (!propertyId || !agentUserId)
        return context;
    try {
        await context.app
            .service('properties')
            .patch(propertyId, { agentUserId }, { provider: undefined });
    }
    catch (err) {
        ;
        context.app.logger?.warn?.('syncPropertyAgentOnCreate failed', err?.message);
    }
    return context;
};
/** After remove: clear agentUserId from the property document. */
const clearPropertyAgentOnRemove = async (context) => {
    const result = context.result;
    const propertyId = result?.propertyId;
    if (!propertyId)
        return context;
    try {
        await context.app
            .service('properties')
            .patch(propertyId, { agentUserId: null }, { provider: undefined });
    }
    catch (err) {
        ;
        context.app.logger?.warn?.('clearPropertyAgentOnRemove failed', err?.message);
    }
    return context;
};
const ensurePropertyOwnedByLandlordUnlessAdmin = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    const propertyId = context.data?.propertyId;
    if (!propertyId)
        return context;
    const property = await context.app.service('properties').get(propertyId, { provider: undefined });
    if (property.landlordId !== user._id.toString()) {
        throw new errors_1.errors.Forbidden('You can only assign agents to your own properties.');
    }
    return context;
};
async function loadAssignmentRow(context) {
    const db = await context.app.get('mongodbClient');
    const col = db.collection('agent_assignments');
    const raw = String(context.id || '');
    let row = await col.findOne({ _id: raw });
    if (!row && mongodb_1.ObjectId.isValid(raw) && raw.length === 24) {
        row = await col.findOne({ _id: new mongodb_1.ObjectId(raw) });
    }
    return row;
}
const restrictFind = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const uid = user._id.toString();
    if (roles.includes('admin'))
        return context;
    if (roles.includes('landlord') && !roles.includes('admin')) {
        const db = await context.app.get('mongodbClient');
        const propIds = (await db.collection('properties').distinct('_id', { landlordId: uid })).map((x) => String(x));
        if (!propIds.length) {
            (0, merge_query_1.mergeQuery)(context, { propertyId: '__none__' });
        }
        else if (propIds.length === 1) {
            (0, merge_query_1.mergeQuery)(context, { propertyId: propIds[0] });
        }
        else {
            (0, merge_query_1.mergeQuery)(context, { propertyId: { $in: propIds } });
        }
        return context;
    }
    if (roles.includes('property_manager') && !roles.includes('admin')) {
        const db = await context.app.get('mongodbClient');
        const assigns = await db.collection('property_manager_assignments').find({ managerUserId: uid }).project({ propertyId: 1 }).toArray();
        const pids = [...new Set(assigns.map((a) => String(a.propertyId)).filter(Boolean))];
        if (!pids.length) {
            (0, merge_query_1.mergeQuery)(context, { propertyId: '__none__' });
        }
        else if (pids.length === 1) {
            (0, merge_query_1.mergeQuery)(context, { propertyId: pids[0] });
        }
        else {
            (0, merge_query_1.mergeQuery)(context, { propertyId: { $in: pids } });
        }
        return context;
    }
    if (roles.includes('agent') && !roles.includes('admin')) {
        (0, merge_query_1.mergeQuery)(context, { agentUserId: uid });
        return context;
    }
    throw new errors_1.errors.Forbidden('You are not allowed to list agent assignments.');
};
const restrictAssignmentGet = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const uid = user._id.toString();
    const row = await loadAssignmentRow(context);
    if (!row)
        throw new errors_1.errors.NotFound();
    if (roles.includes('admin'))
        return context;
    if (roles.includes('agent') && String(row.agentUserId) === uid)
        return context;
    const db = await context.app.get('mongodbClient');
    const pid = String(row.propertyId || '');
    const propIdQuery = mongodb_1.ObjectId.isValid(pid) && pid.length === 24 ? new mongodb_1.ObjectId(pid) : pid;
    const prop = await db.collection('properties').findOne({ _id: propIdQuery });
    if (!prop)
        throw new errors_1.errors.Forbidden();
    if (roles.includes('landlord') && String(prop.landlordId) === uid)
        return context;
    if (roles.includes('property_manager')) {
        const n = await db.collection('property_manager_assignments').countDocuments({
            managerUserId: uid,
            propertyId: String(row.propertyId)
        });
        if (n > 0)
            return context;
    }
    throw new errors_1.errors.Forbidden('You cannot access this assignment.');
};
const agentAssignments = (app) => {
    app.use(exports.agentAssignmentsPath, new agent_assignments_class_1.AgentAssignmentsService((0, agent_assignments_class_1.getOptions)(app)), {
        methods: exports.agentAssignmentsMethods,
        events: []
    });
    app.service(exports.agentAssignmentsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(agent_assignments_schema_1.agentAssignmentExternalResolver), schema_1.hooks.resolveResult(agent_assignments_schema_1.agentAssignmentResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(agent_assignments_schema_1.agentAssignmentQueryValidator), schema_1.hooks.resolveQuery(agent_assignments_schema_1.agentAssignmentQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictFind],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictAssignmentGet],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin'),
                schema_1.hooks.validateData(agent_assignments_schema_1.agentAssignmentDataValidator),
                schema_1.hooks.resolveData(agent_assignments_schema_1.agentAssignmentDataResolver),
                ensurePropertyOwnedByLandlordUnlessAdmin,
                attachAssignedBy
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin'),
                schema_1.hooks.validateData(agent_assignments_schema_1.agentAssignmentPatchValidator),
                schema_1.hooks.resolveData(agent_assignments_schema_1.agentAssignmentPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('landlord', 'admin')]
        },
        after: {
            create: [syncPropertyAgentOnCreate],
            remove: [clearPropertyAgentOnRemove]
        }
    });
};
exports.agentAssignments = agentAssignments;
//# sourceMappingURL=agent-assignments.js.map