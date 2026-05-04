"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictUnitsToAssignedPropertiesForAgents = exports.requireAgentAssignedToProperty = exports.restrictPropertiesToAssignedForAgents = void 0;
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const pm_assignment_access_1 = require("./pm-assignment-access");
const getAssignedPropertyIds = async (context, agentUserId) => {
    const res = (await context.app.service('agent-assignments').find({ paginate: false, query: { agentUserId } }, { provider: undefined }));
    const list = Array.isArray(res) ? res : res?.data || [];
    return list.map((a) => a.propertyId).filter(Boolean);
};
const restrictPropertiesToAssignedForAgents = () => {
    return async (context) => {
        if (!context.params.provider)
            return context;
        const user = context.params.user;
        if (!user?._id)
            return context;
        const roles = Array.isArray(user.roles) ? user.roles : [];
        if (roles.includes('admin'))
            return context;
        if (roles.includes('property_manager') && !roles.includes('landlord')) {
            const ids = await (0, pm_assignment_access_1.getPmAssignedPropertyIds)(context, user._id.toString());
            context.params.query = {
                ...(context.params.query || {}),
                _id: { $in: ids.map((id) => new mongodb_1.ObjectId(id)) }
            };
            return context;
        }
        if (roles.includes('agent')) {
            const ids = await getAssignedPropertyIds(context, user._id.toString());
            context.params.query = {
                ...(context.params.query || {}),
                _id: { $in: ids.map((id) => new mongodb_1.ObjectId(id)) }
            };
            return context;
        }
        // landlord default restriction is handled elsewhere
        return context;
    };
};
exports.restrictPropertiesToAssignedForAgents = restrictPropertiesToAssignedForAgents;
const requireAgentAssignedToProperty = (propertyId) => {
    return async (context) => {
        if (!context.params.provider)
            return context;
        const user = context.params.user;
        if (!user?._id)
            throw new errors_1.errors.NotAuthenticated();
        const roles = Array.isArray(user.roles) ? user.roles : [];
        if (roles.includes('admin') || roles.includes('landlord'))
            return context;
        if (roles.includes('property_manager')) {
            const res = (await context.app.service('property-manager-assignments').find({ paginate: false, query: { propertyId, managerUserId: user._id.toString() } }, { provider: undefined }));
            const list = Array.isArray(res) ? res : res?.data || [];
            if (!list.length)
                throw new errors_1.errors.Forbidden('You are not assigned to manage this property.');
            return context;
        }
        if (!roles.includes('agent'))
            throw new errors_1.errors.Forbidden('You are not allowed to access this resource.');
        const res = (await context.app.service('agent-assignments').find({ paginate: false, query: { propertyId, agentUserId: user._id.toString() } }, { provider: undefined }));
        const list = Array.isArray(res) ? res : res?.data || [];
        if (!list.length)
            throw new errors_1.errors.Forbidden('You are not assigned to this property.');
        return context;
    };
};
exports.requireAgentAssignedToProperty = requireAgentAssignedToProperty;
const restrictUnitsToAssignedPropertiesForAgents = () => {
    return async (context) => {
        if (!context.params.provider)
            return context;
        const user = context.params.user;
        if (!user?._id)
            return context;
        const roles = Array.isArray(user.roles) ? user.roles : [];
        if (roles.includes('admin') || roles.includes('landlord'))
            return context;
        if (roles.includes('property_manager') && !roles.includes('landlord')) {
            const ids = await (0, pm_assignment_access_1.getPmAssignedPropertyIds)(context, user._id.toString());
            context.params.query = { ...(context.params.query || {}), propertyId: { $in: ids } };
            return context;
        }
        if (roles.includes('agent')) {
            const ids = await getAssignedPropertyIds(context, user._id.toString());
            context.params.query = { ...(context.params.query || {}), propertyId: { $in: ids } };
        }
        return context;
    };
};
exports.restrictUnitsToAssignedPropertiesForAgents = restrictUnitsToAssignedPropertiesForAgents;
//# sourceMappingURL=agent-assignment-access.js.map