"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateRoles = void 0;
/**
 * Ensures `context.params.user.roles` is populated from `user-roles` service.
 * Use this in services that make role decisions without calling `requireRole(...)`.
 */
const populateRoles = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        return context;
    if (Array.isArray(user.roles))
        return context;
    const res = (await context.app.service('user-roles').find({ paginate: false, query: { userId: user._id.toString() } }, { provider: undefined }));
    const list = Array.isArray(res) ? res : res?.data || [];
    user.roles = list.map((r) => r.role);
    return context;
};
exports.populateRoles = populateRoles;
//# sourceMappingURL=populate-roles.js.map