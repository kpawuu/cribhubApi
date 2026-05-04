"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictQueryToOwner = void 0;
const errors_1 = require("@feathersjs/errors");
/**
 * Restrict external queries to records owned by the current user unless they have one of the privileged roles.
 * Intended for services that store an explicit owner field (e.g. landlordId).
 */
const restrictQueryToOwner = (ownerField, privilegedRoles = ['admin']) => {
    return async (context) => {
        if (!context.params.provider)
            return context;
        const user = context.params.user;
        if (!user?._id)
            throw new errors_1.errors.NotAuthenticated();
        // If user has privileged roles, skip restriction.
        if (Array.isArray(user.roles) && user.roles.some((r) => privilegedRoles.includes(r))) {
            return context;
        }
        // Mutate in place so the non-enumerable VALIDATED flag from validateQuery is preserved.
        const query = context.params.query || (context.params.query = {});
        query[ownerField] = user._id.toString();
        return context;
    };
};
exports.restrictQueryToOwner = restrictQueryToOwner;
//# sourceMappingURL=restrict-query-to-owner.js.map