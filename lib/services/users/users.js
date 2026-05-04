"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.usersMethods = exports.usersPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const merge_query_1 = require("../../hooks/merge-query");
const users_class_1 = require("./users.class");
const feathers_authentication_management_1 = require("feathers-authentication-management");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const users_schema_1 = require("./users.schema");
const attach_user_roles_for_external_1 = require("./attach-user-roles-for-external");
exports.usersPath = 'users';
exports.usersMethods = ['find', 'get', 'create', 'patch', 'remove'];
const authManagementFieldNames = [
    'isVerified',
    'verifyToken',
    'verifyShortToken',
    'verifyExpires',
    'verifyChanges',
    'resetToken',
    'resetShortToken',
    'resetExpires',
    'resetAttempts'
];
const getRolesForRequest = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        return [];
    const embeddedRoles = Array.isArray(user.roles) ? user.roles : undefined;
    if (embeddedRoles)
        return embeddedRoles;
    const userId = user._id.toString();
    const res = (await context.app.service('user-roles').find({ paginate: false, query: { userId } }, { provider: undefined }));
    return (res || []).map((r) => r.role).filter(Boolean);
};
const restrictUsersExternalAccess = async (context) => {
    // Only restrict external calls.
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    const userId = user?._id?.toString?.();
    if (!userId)
        throw new errors_1.errors.NotAuthenticated();
    const roles = await getRolesForRequest(context);
    const isAdmin = roles.includes('admin');
    if (isAdmin)
        return context;
    // For `find`, we restrict query by _id.
    if (context.method === 'find') {
        (0, merge_query_1.mergeQuery)(context, { _id: userId });
        return context;
    }
    // For `get`/`patch`/`remove`, we restrict to the caller's user document.
    const targetId = context.id?.toString?.() || context.id;
    if (String(targetId) !== String(userId)) {
        throw new errors_1.errors.Forbidden('You are not allowed to access this resource.');
    }
    return context;
};
const stripAuthManagementFieldsFromExternalPatch = async (context) => {
    if (!context.params.provider)
        return context;
    const data = context.data;
    if (!data || typeof data !== 'object')
        return context;
    // Prevent external users from patching auth-management-related verification/reset fields.
    for (const field of authManagementFieldNames)
        delete data[field];
    // Virtual relation fields (stored only on `user-roles`)
    delete data.roles;
    delete data.userRoles;
    return context;
};
const autoVerifyIfEnabled = () => {
    return async (context) => {
        if (process.env.AUTO_VERIFY_USERS !== 'true')
            return context;
        const created = context.result;
        const id = created?._id?.toString?.();
        if (!id)
            return context;
        // Mark verified for local/dev convenience (still keeps auth-management flow available)
        const patched = await context.app.service('users').patch(id, { isVerified: true }, { provider: undefined });
        context.result = patched;
        return context;
    };
};
const sendVerify = () => {
    return async (context) => {
        if (process.env.AUTO_VERIFY_USERS === 'true')
            return context;
        // Trigger verification notifier via auth-management
        const users = Array.isArray(context.result) ? context.result : [context.result];
        await Promise.all(users.map(async (user) => context.app.service('auth-management').create({ action: 'resendVerifySignup', value: { email: user.email } })));
        return context;
    };
};
const ensureDefaultTenantRole = async (context) => {
    const created = context.result;
    const userId = created?._id?.toString();
    if (!userId)
        return context;
    // Always grant tenant role by default
    await context.app.service('user-roles').create({ userId, role: 'tenant' });
    // Optional role request (do not grant immediately)
    const requestedRole = context.data?.requestedRole;
    if (requestedRole && requestedRole !== 'tenant') {
        await context.app.service('role-requests').create({
            userId,
            role: requestedRole,
            status: 'pending'
        });
    }
    return context;
};
const users = (app) => {
    app.use(exports.usersPath, new users_class_1.UsersService((0, users_class_1.getOptions)(app)), {
        methods: exports.usersMethods,
        events: []
    });
    app.service(exports.usersPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(users_schema_1.userExternalResolver), schema_1.hooks.resolveResult(users_schema_1.userResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(users_schema_1.userQueryValidator), schema_1.hooks.resolveQuery(users_schema_1.userQueryResolver)],
            create: [
                schema_1.hooks.validateData(users_schema_1.userDataValidator),
                schema_1.hooks.resolveData(users_schema_1.userDataResolver),
                (0, feathers_authentication_management_1.addVerification)('auth-management')
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                stripAuthManagementFieldsFromExternalPatch,
                restrictUsersExternalAccess,
                schema_1.hooks.validateData(users_schema_1.userPatchValidator),
                schema_1.hooks.resolveData(users_schema_1.userPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), restrictUsersExternalAccess],
            // Restrict list/get to self unless admin.
            // Note: put after auth hook so `context.params.user` is set.
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), restrictUsersExternalAccess],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), restrictUsersExternalAccess]
        },
        after: {
            find: [attach_user_roles_for_external_1.attachUserRolesForExternal],
            get: [attach_user_roles_for_external_1.attachUserRolesForExternal],
            create: [sendVerify(), (0, feathers_authentication_management_1.removeVerification)(), autoVerifyIfEnabled(), ensureDefaultTenantRole, attach_user_roles_for_external_1.attachUserRolesForExternal],
            patch: [attach_user_roles_for_external_1.attachUserRolesForExternal]
        }
    });
};
exports.users = users;
//# sourceMappingURL=users.js.map