"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentAssignments = exports.agentAssignmentsMethods = exports.agentAssignmentsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
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
const restrictFind = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    // Agents see assignments for themselves; landlords see theirs by joining via property ownership
    if (roles.includes('agent') && !roles.includes('admin')) {
        (0, merge_query_1.mergeQuery)(context, { agentUserId: user._id.toString() });
    }
    return context;
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
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), restrictFind],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
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