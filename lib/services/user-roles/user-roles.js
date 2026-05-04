"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoles = exports.userRolesMethods = exports.userRolesPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const user_roles_class_1 = require("./user-roles.class");
const user_roles_schema_1 = require("./user-roles.schema");
exports.userRolesPath = 'user-roles';
exports.userRolesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const restrictExternalCreate = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const { userId, role } = context.data;
    if (userId !== user._id.toString()) {
        throw new errors_1.errors.Forbidden('Cannot assign roles for another user.');
    }
    if (role !== 'tenant') {
        throw new errors_1.errors.Forbidden('Only tenant role can be self-assigned.');
    }
    return context;
};
const userRoles = (app) => {
    app.use(exports.userRolesPath, new user_roles_class_1.UserRolesService((0, user_roles_class_1.getOptions)(app)), {
        methods: exports.userRolesMethods,
        events: []
    });
    app.service(exports.userRolesPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(user_roles_schema_1.userRoleExternalResolver), schema_1.hooks.resolveResult(user_roles_schema_1.userRoleResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(user_roles_schema_1.userRoleQueryValidator), schema_1.hooks.resolveQuery(user_roles_schema_1.userRoleQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            create: [
                // internal calls allowed; external require auth + restrictions
                schema_1.hooks.validateData(user_roles_schema_1.userRoleDataValidator),
                schema_1.hooks.resolveData(user_roles_schema_1.userRoleDataResolver),
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                restrictExternalCreate
            ],
            patch: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), schema_1.hooks.validateData(user_roles_schema_1.userRolePatchValidator), schema_1.hooks.resolveData(user_roles_schema_1.userRolePatchResolver)],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')]
        }
    });
};
exports.userRoles = userRoles;
//# sourceMappingURL=user-roles.js.map