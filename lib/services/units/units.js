"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.units = exports.unitsMethods = exports.unitsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const authenticate_if_jwt_present_1 = require("../../hooks/authenticate-if-jwt-present");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const agent_assignment_access_1 = require("../../hooks/agent-assignment-access");
const pm_assignment_access_1 = require("../../hooks/pm-assignment-access");
const mongodb_1 = require("mongodb");
const units_class_1 = require("./units.class");
const units_schema_1 = require("./units.schema");
exports.unitsPath = 'units';
exports.unitsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const restrictFindToAllowed = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    if (!user?._id) {
        (0, merge_query_1.mergeQuery)(context, { status: 'vacant' });
        return context;
    }
    const isPriv = roles.includes('admin') || roles.includes('landlord') || roles.includes('property_manager') || roles.includes('agent');
    const isTenant = roles.includes('tenant');
    if (isTenant && !isPriv) {
        if ((context.params.query || {}).status !== 'vacant') {
            (0, merge_query_1.mergeQuery)(context, { tenantId: user._id.toString() });
        }
    }
    return context;
};
/** Allow unauthenticated GET only for vacant units (public listing detail / apply flow). */
const allowPublicVacantUnitGet = async (context) => {
    if (!context.params.provider)
        return context;
    if (context.params.user?._id)
        return context;
    const raw = String(context.id || '');
    const db = await context.app.get('mongodbClient');
    const col = db.collection('units');
    let doc = await col.findOne({ _id: raw, status: 'vacant' });
    if (!doc && mongodb_1.ObjectId.isValid(raw) && raw.length === 24) {
        doc = await col.findOne({ _id: new mongodb_1.ObjectId(raw), status: 'vacant' });
    }
    if (!doc) {
        throw new errors_1.errors.NotAuthenticated('Sign in to view this unit.');
    }
    return context;
};
const ensureLandlordOwnsPropertyForUnitCreate = async (ctx) => {
    if (!ctx.params.provider)
        return ctx;
    const roles = Array.isArray(ctx.params.user?.roles) ? ctx.params.user.roles : [];
    if (roles.includes('admin'))
        return ctx;
    if (roles.includes('property_manager') && !roles.includes('landlord'))
        return ctx;
    if (roles.includes('agent'))
        return ctx;
    if (!roles.includes('landlord'))
        return ctx;
    const pid = String(ctx.data?.propertyId || '');
    if (!pid)
        throw new errors_1.errors.BadRequest('propertyId is required');
    const property = await ctx.app.service('properties').get(pid, { provider: undefined });
    if (String(property.landlordId) !== String(ctx.params.user._id)) {
        throw new errors_1.errors.Forbidden('You cannot add units to this property.');
    }
    return ctx;
};
const ensureLandlordOwnsUnitBeforeWrite = async (ctx) => {
    if (!ctx.params.provider)
        return ctx;
    const roles = Array.isArray(ctx.params.user?.roles) ? ctx.params.user.roles : [];
    if (roles.includes('admin'))
        return ctx;
    if (roles.includes('property_manager') && !roles.includes('landlord'))
        return ctx;
    if (roles.includes('agent'))
        return ctx;
    if (!roles.includes('landlord'))
        return ctx;
    const unit = await ctx.app.service('units').get(ctx.id, { provider: undefined });
    const property = await ctx.app.service('properties').get(unit.propertyId, { provider: undefined });
    if (String(property.landlordId) !== String(ctx.params.user._id)) {
        throw new errors_1.errors.Forbidden('You cannot modify this unit.');
    }
    return ctx;
};
const restrictGetUnitAccess = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        return context;
    const raw = String(context.id || '');
    const db = await context.app.get('mongodbClient');
    const col = db.collection('units');
    let unit = await col.findOne({ _id: raw });
    if (!unit && mongodb_1.ObjectId.isValid(raw) && raw.length === 24) {
        unit = await col.findOne({ _id: new mongodb_1.ObjectId(raw) });
    }
    if (!unit)
        throw new errors_1.errors.NotFound('Unit not found');
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin') || roles.includes('landlord'))
        return context;
    if (roles.includes('property_manager') && !roles.includes('landlord')) {
        return await (0, agent_assignment_access_1.requireAgentAssignedToProperty)(String(unit.propertyId))(context);
    }
    if (roles.includes('agent')) {
        return await (0, agent_assignment_access_1.requireAgentAssignedToProperty)(String(unit.propertyId))(context);
    }
    if (roles.includes('tenant')) {
        if (unit.status === 'vacant')
            return context;
        if (String(unit.tenantId || '') === String(user._id))
            return context;
        throw new errors_1.errors.Forbidden('You cannot view this unit.');
    }
    throw new errors_1.errors.Forbidden('You cannot view this unit.');
};
const units = (app) => {
    app.use(exports.unitsPath, new units_class_1.UnitsService((0, units_class_1.getOptions)(app)), {
        methods: exports.unitsMethods,
        events: []
    });
    app.service(exports.unitsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(units_schema_1.unitExternalResolver), schema_1.hooks.resolveResult(units_schema_1.unitResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(units_schema_1.unitQueryValidator), schema_1.hooks.resolveQuery(units_schema_1.unitQueryResolver)],
            find: [
                (0, authenticate_if_jwt_present_1.authenticateIfJwtPresent)(),
                populate_roles_1.populateRoles,
                restrictFindToAllowed,
                (0, agent_assignment_access_1.restrictUnitsToAssignedPropertiesForAgents)(),
                pm_assignment_access_1.restrictUnitsToAssignedPropertiesForPm
            ],
            get: [(0, authenticate_if_jwt_present_1.authenticateIfJwtPresent)(), populate_roles_1.populateRoles, allowPublicVacantUnitGet, restrictGetUnitAccess],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                async (ctx) => {
                    const roles = Array.isArray(ctx.params.user?.roles) ? ctx.params.user.roles : [];
                    if (roles.includes('admin'))
                        return ctx;
                    if (roles.includes('property_manager') && !roles.includes('landlord')) {
                        const propertyId = ctx.data?.propertyId;
                        if (!propertyId)
                            throw new errors_1.errors.BadRequest('propertyId is required');
                        return await (0, agent_assignment_access_1.requireAgentAssignedToProperty)(String(propertyId))(ctx);
                    }
                    if (roles.includes('agent')) {
                        const propertyId = ctx.data?.propertyId;
                        if (!propertyId)
                            throw new errors_1.errors.BadRequest('propertyId is required');
                        return await (0, agent_assignment_access_1.requireAgentAssignedToProperty)(String(propertyId))(ctx);
                    }
                    return await (0, require_role_1.requireRole)('landlord', 'admin')(ctx);
                },
                ensureLandlordOwnsPropertyForUnitCreate,
                schema_1.hooks.validateData(units_schema_1.unitDataValidator),
                schema_1.hooks.resolveData(units_schema_1.unitDataResolver)
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                async (ctx) => {
                    const roles = Array.isArray(ctx.params.user?.roles) ? ctx.params.user.roles : [];
                    if (roles.includes('admin'))
                        return ctx;
                    if (roles.includes('property_manager') && !roles.includes('landlord')) {
                        const unit = await ctx.app.service('units').get(ctx.id, { provider: undefined });
                        return await (0, agent_assignment_access_1.requireAgentAssignedToProperty)(String(unit.propertyId))(ctx);
                    }
                    if (roles.includes('agent')) {
                        const unit = await ctx.app.service('units').get(ctx.id, { provider: undefined });
                        const propertyId = unit.propertyId;
                        return await (0, agent_assignment_access_1.requireAgentAssignedToProperty)(String(propertyId))(ctx);
                    }
                    return await (0, require_role_1.requireRole)('landlord', 'admin')(ctx);
                },
                ensureLandlordOwnsUnitBeforeWrite,
                schema_1.hooks.validateData(units_schema_1.unitPatchValidator),
                schema_1.hooks.resolveData(units_schema_1.unitPatchResolver)
            ],
            remove: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                async (ctx) => {
                    const roles = Array.isArray(ctx.params.user?.roles) ? ctx.params.user.roles : [];
                    if (roles.includes('admin'))
                        return ctx;
                    if (roles.includes('property_manager') && !roles.includes('landlord')) {
                        const unit = await ctx.app.service('units').get(ctx.id, { provider: undefined });
                        return await (0, agent_assignment_access_1.requireAgentAssignedToProperty)(String(unit.propertyId))(ctx);
                    }
                    return await (0, require_role_1.requireRole)('landlord', 'admin')(ctx);
                },
                ensureLandlordOwnsUnitBeforeWrite
            ]
        }
    });
};
exports.units = units;
//# sourceMappingURL=units.js.map