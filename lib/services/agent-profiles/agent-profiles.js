"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentProfiles = exports.agentProfilesMethods = exports.agentProfilesPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const agent_profiles_class_1 = require("./agent-profiles.class");
const agent_profiles_schema_1 = require("./agent-profiles.schema");
exports.agentProfilesPath = 'agent-profiles';
exports.agentProfilesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const attachUserId = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    context.data.userId = user._id.toString();
    return context;
};
const restrictToSelf = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    // allow admin unrestricted
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    // scope queries and get/patch/remove to their own agent profile
    if (context.method === 'find') {
        (0, merge_query_1.mergeQuery)(context, { userId: user._id.toString() });
    }
    if (context.id) {
        const existing = await context.app.service(exports.agentProfilesPath).get(context.id, { provider: undefined });
        if (existing.userId !== user._id.toString())
            throw new errors_1.errors.Forbidden('Not allowed');
    }
    return context;
};
const agentProfiles = (app) => {
    app.use(exports.agentProfilesPath, new agent_profiles_class_1.AgentProfilesService((0, agent_profiles_class_1.getOptions)(app)), {
        methods: exports.agentProfilesMethods,
        events: []
    });
    app.service(exports.agentProfilesPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(agent_profiles_schema_1.agentProfileExternalResolver), schema_1.hooks.resolveResult(agent_profiles_schema_1.agentProfileResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(agent_profiles_schema_1.agentProfileQueryValidator), schema_1.hooks.resolveQuery(agent_profiles_schema_1.agentProfileQueryResolver)],
            // Public directory listing and get are allowed (Find Agent).
            find: [],
            get: [],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('agent', 'admin'),
                schema_1.hooks.validateData(agent_profiles_schema_1.agentProfileDataValidator),
                schema_1.hooks.resolveData(agent_profiles_schema_1.agentProfileDataResolver),
                attachUserId
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('agent', 'admin'),
                restrictToSelf,
                schema_1.hooks.validateData(agent_profiles_schema_1.agentProfilePatchValidator),
                schema_1.hooks.resolveData(agent_profiles_schema_1.agentProfilePatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('agent', 'admin'), restrictToSelf]
        }
    });
};
exports.agentProfiles = agentProfiles;
//# sourceMappingURL=agent-profiles.js.map