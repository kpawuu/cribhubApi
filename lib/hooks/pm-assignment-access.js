"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictUnitsToAssignedPropertiesForPm = exports.requirePmAssignedToProperty = exports.restrictPropertyManagerPropertiesFind = exports.getPmAssignedPropertyIds = void 0;
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const getPmAssignedPropertyIds = async (context, managerUserId) => {
    const res = (await context.app.service('property-manager-assignments').find({ paginate: false, query: { managerUserId } }, { provider: undefined }));
    const list = Array.isArray(res) ? res : res?.data || [];
    return list.map((a) => String(a.propertyId)).filter(Boolean);
};
exports.getPmAssignedPropertyIds = getPmAssignedPropertyIds;
const propertyObjectIds = (ids) => {
    const oids = [];
    for (const id of ids) {
        try {
            oids.push(mongodb_1.ObjectId.isValid(id) && String(id).length === 24 ? new mongodb_1.ObjectId(id) : id);
        }
        catch {
            oids.push(id);
        }
    }
    return oids;
};
/**
 * PM-only users (no landlord/admin): portfolio `find` is limited to assigned properties.
 * Public catalog browse (e.g. `/listings`) must not send `pmPortfolio`; same visibility as guests/tenants.
 * Landlord hub passes `pmPortfolio: true` so managers only see properties they manage.
 */
const restrictPropertyManagerPropertiesFind = async (context) => {
    if (context.method !== 'find' || !context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        return context;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (!roles.includes('property_manager') || roles.includes('admin') || roles.includes('landlord'))
        return context;
    const q = { ...(context.params.query || {}) };
    const portfolio = q.pmPortfolio === true || q.pmPortfolio === 'true';
    delete q.pmPortfolio;
    context.params.query = q;
    if (!portfolio)
        return context;
    const ids = await (0, exports.getPmAssignedPropertyIds)(context, user._id.toString());
    const q2 = { ...(context.params.query || {}) };
    if (!ids.length) {
        q2._id = { $in: [] };
    }
    else {
        q2._id = { $in: propertyObjectIds(ids) };
    }
    context.params.query = q2;
    return context;
};
exports.restrictPropertyManagerPropertiesFind = restrictPropertyManagerPropertiesFind;
const requirePmAssignedToProperty = (propertyId) => {
    return async (context) => {
        if (!context.params.provider)
            return context;
        const user = context.params.user;
        if (!user?._id)
            throw new errors_1.errors.NotAuthenticated();
        const roles = Array.isArray(user.roles) ? user.roles : [];
        if (roles.includes('admin') || roles.includes('landlord'))
            return context;
        if (!roles.includes('property_manager'))
            throw new errors_1.errors.Forbidden('You are not allowed to access this resource.');
        const res = (await context.app.service('property-manager-assignments').find({ paginate: false, query: { propertyId, managerUserId: user._id.toString() } }, { provider: undefined }));
        const list = Array.isArray(res) ? res : res?.data || [];
        if (!list.length)
            throw new errors_1.errors.Forbidden('You are not assigned to manage this property.');
        return context;
    };
};
exports.requirePmAssignedToProperty = requirePmAssignedToProperty;
const restrictUnitsToAssignedPropertiesForPm = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        return context;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (!roles.includes('property_manager') || roles.includes('admin') || roles.includes('landlord'))
        return context;
    const ids = await (0, exports.getPmAssignedPropertyIds)(context, user._id.toString());
    const q = { ...(context.params.query || {}) };
    if (!ids.length) {
        q.propertyId = { $in: [] };
    }
    else {
        q.propertyId = { $in: ids };
    }
    context.params.query = q;
    return context;
};
exports.restrictUnitsToAssignedPropertiesForPm = restrictUnitsToAssignedPropertiesForPm;
//# sourceMappingURL=pm-assignment-access.js.map