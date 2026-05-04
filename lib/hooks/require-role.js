"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const errors_1 = require("@feathersjs/errors");
const requireRole = (...allowedRoles) => {
    return async (context) => {
        // Internal service calls (provider undefined) are trusted server-side calls.
        // Allow them to proceed without role gating so cross-service hooks can patch/update records.
        if (!context.params.provider)
            return context;
        const user = context.params.user;
        if (!user?._id) {
            throw new errors_1.errors.NotAuthenticated();
        }
        // Prefer roles embedded on user (if present), otherwise query user-roles service
        const embeddedRoles = Array.isArray(user.roles) ? user.roles : undefined;
        // IMPORTANT: use an internal call (no provider) so service hooks don't require auth
        const roles = embeddedRoles ||
            (await context.app.service('user-roles').find({
                paginate: false,
                query: { userId: user._id.toString() }
            }, { provider: undefined }))?.map((r) => r.role);
        user.roles = roles;
        const ok = roles?.some((r) => allowedRoles.includes(r));
        if (!ok) {
            throw new errors_1.errors.Forbidden('You are not allowed to access this resource.');
        }
        return context;
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=require-role.js.map