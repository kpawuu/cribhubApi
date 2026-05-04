"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRequests = exports.roleRequestsMethods = exports.roleRequestsPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const role_requests_class_1 = require("./role-requests.class");
const role_requests_schema_1 = require("./role-requests.schema");
exports.roleRequestsPath = 'role-requests';
exports.roleRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const restrictCreateToSelf = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    if (context.data.userId !== user._id.toString()) {
        throw new errors_1.errors.Forbidden('Cannot create role request for another user.');
    }
    return context;
};
const onApproveGrantRole = async (context) => {
    const patched = context.result;
    if (patched?.status === 'approved') {
        await context.app.service('user-roles').create({ userId: patched.userId, role: patched.role });
    }
    return context;
};
const roleRequests = (app) => {
    app.use(exports.roleRequestsPath, new role_requests_class_1.RoleRequestsService((0, role_requests_class_1.getOptions)(app)), {
        methods: exports.roleRequestsMethods,
        events: []
    });
    app.service(exports.roleRequestsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(role_requests_schema_1.roleRequestExternalResolver), schema_1.hooks.resolveResult(role_requests_schema_1.roleRequestResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(role_requests_schema_1.roleRequestQueryValidator), schema_1.hooks.resolveQuery(role_requests_schema_1.roleRequestQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                schema_1.hooks.validateData(role_requests_schema_1.roleRequestDataValidator),
                schema_1.hooks.resolveData(role_requests_schema_1.roleRequestDataResolver),
                restrictCreateToSelf
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('admin'),
                schema_1.hooks.validateData(role_requests_schema_1.roleRequestPatchValidator),
                schema_1.hooks.resolveData(role_requests_schema_1.roleRequestPatchResolver),
                async (ctx) => {
                    const u = ctx.params.user;
                    ctx.data.reviewedBy = u?._id?.toString();
                }
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        },
        after: {
            patch: [onApproveGrantRole]
        }
    });
};
exports.roleRequests = roleRequests;
//# sourceMappingURL=role-requests.js.map