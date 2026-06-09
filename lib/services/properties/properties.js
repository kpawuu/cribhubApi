"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.properties = exports.propertiesMethods = exports.propertiesPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const authentication_1 = require("@feathersjs/authentication");
const authenticate_if_jwt_present_1 = require("../../hooks/authenticate-if-jwt-present");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const agent_assignment_access_1 = require("../../hooks/agent-assignment-access");
const pm_assignment_access_1 = require("../../hooks/pm-assignment-access");
const properties_class_1 = require("./properties.class");
const expand_listing_query_1 = require("./expand-listing-query");
const properties_schema_1 = require("./properties.schema");
exports.propertiesPath = 'properties';
exports.propertiesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const populateRolesIfAuthed = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        return context;
    return await (0, populate_roles_1.populateRoles)(context);
};
const attachLandlordId = async (context) => {
    const user = context.params.user;
    if (user?._id) {
        ;
        context.data.landlordId = user._id.toString();
    }
    return context;
};
const extractInclude = async (context) => {
    // Feathers MongoDB adapter applies `params.query` as additional constraints on `get`.
    // We want `include=...` to affect only the response resolver, not the DB query.
    const q = context.params?.query || {};
    const include = q.include || q.$include;
    const includes = String(include || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    if (includes.includes('units')) {
        ;
        context.params.$includeUnits = true;
    }
    if (includes.includes('agent')) {
        ;
        context.params.$includeAgent = true;
    }
    if (q.include !== undefined)
        delete q.include;
    if (q.$include !== undefined)
        delete q.$include;
    context.params.query = q;
    return context;
};
/** Portfolio list: `mine=true` → only this user's properties. Blocks querying another landlord's id. */
const restrictLandlordPropertyQueries = async (context) => {
    if (context.method !== 'find' && context.method !== 'get')
        return context;
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        return context;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('property_manager') && !roles.includes('landlord')) {
        if (context.method === 'find') {
            const q = { ...(context.params.query || {}) };
            if (q.mine === true || q.mine === 'true')
                delete q.mine;
            context.params.query = q;
        }
        return context;
    }
    if (!roles.includes('landlord') || roles.includes('admin'))
        return context;
    if (context.method === 'find') {
        const q = { ...(context.params.query || {}) };
        if (q.mine === true || q.mine === 'true') {
            delete q.mine;
            q.landlordId = user._id.toString();
            context.params.query = q;
            return context;
        }
        if (q.landlordId != null && String(q.landlordId) !== String(user._id)) {
            throw new errors_1.errors.Forbidden('You cannot list another landlord\'s properties.');
        }
        return context;
    }
    // get — ownership enforced in restrictPropertyGet
    return context;
};
/**
 * Public listing detail: tenants, agents, and PMs may GET like guests.
 * Landlord/admin unchanged. Assignment is enforced on patch and on units/property writes elsewhere.
 */
const restrictPropertyGet = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        return context;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin') || roles.includes('landlord'))
        return context;
    return context;
};
const ensureLandlordOwnsPropertyBeforePatch = async (ctx) => {
    if (!ctx.params.provider)
        return ctx;
    const roles = Array.isArray(ctx.params.user?.roles) ? ctx.params.user.roles : [];
    if (roles.includes('admin'))
        return ctx;
    if (roles.includes('property_manager') && !roles.includes('landlord')) {
        return await (0, pm_assignment_access_1.requirePmAssignedToProperty)(String(ctx.id))(ctx);
    }
    if (roles.includes('agent'))
        return ctx;
    if (!roles.includes('landlord'))
        return ctx;
    const raw = String(ctx.id || '');
    const db = await ctx.app.get('mongodbClient');
    let prop = await db.collection('properties').findOne({ _id: raw });
    if (!prop && mongodb_1.ObjectId.isValid(raw) && raw.length === 24) {
        prop = await db.collection('properties').findOne({ _id: new mongodb_1.ObjectId(raw) });
    }
    if (!prop)
        throw new errors_1.errors.NotFound();
    if (String(prop.landlordId) !== String(ctx.params.user._id)) {
        throw new errors_1.errors.Forbidden('You cannot edit this property.');
    }
    return ctx;
};
const properties = (app) => {
    app.use(exports.propertiesPath, new properties_class_1.PropertiesService((0, properties_class_1.getOptions)(app)), {
        methods: exports.propertiesMethods,
        events: []
    });
    app.service(exports.propertiesPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(properties_schema_1.propertyExternalResolver), schema_1.hooks.resolveResult(properties_schema_1.propertyResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(properties_schema_1.propertyQueryValidator), schema_1.hooks.resolveQuery(properties_schema_1.propertyQueryResolver)],
            // Catalog browse: same visibility for anonymous and authenticated clients; write access stays role-gated below.
            find: [
                (0, authenticate_if_jwt_present_1.authenticateIfJwtPresent)(),
                expand_listing_query_1.expandListingQuery,
                populateRolesIfAuthed,
                restrictLandlordPropertyQueries,
                pm_assignment_access_1.restrictPropertyManagerPropertiesFind,
                pm_assignment_access_1.restrictAgentPropertiesFind,
                extractInclude
            ],
            get: [(0, authenticate_if_jwt_present_1.authenticateIfJwtPresent)(), populateRolesIfAuthed, restrictPropertyGet, extractInclude],
            create: [
                (0, authentication_1.authenticate)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin'),
                schema_1.hooks.validateData(properties_schema_1.propertyDataValidator),
                schema_1.hooks.resolveData(properties_schema_1.propertyDataResolver),
                attachLandlordId
            ],
            patch: [
                (0, authentication_1.authenticate)('jwt'),
                populate_roles_1.populateRoles,
                async (ctx) => {
                    const roles = Array.isArray(ctx.params.user?.roles) ? ctx.params.user.roles : [];
                    if (roles.includes('admin'))
                        return ctx;
                    if (roles.includes('property_manager') && !roles.includes('landlord')) {
                        return await (0, pm_assignment_access_1.requirePmAssignedToProperty)(String(ctx.id))(ctx);
                    }
                    if (roles.includes('agent')) {
                        const propertyId = String(ctx.id);
                        return await (0, agent_assignment_access_1.requireAgentAssignedToProperty)(propertyId)(ctx);
                    }
                    return await (0, require_role_1.requireRole)('landlord', 'admin')(ctx);
                },
                ensureLandlordOwnsPropertyBeforePatch,
                schema_1.hooks.validateData(properties_schema_1.propertyPatchValidator),
                schema_1.hooks.resolveData(properties_schema_1.propertyPatchResolver)
            ],
            remove: [(0, authentication_1.authenticate)('jwt'), populate_roles_1.populateRoles, ensureLandlordOwnsPropertyBeforePatch, (0, require_role_1.requireRole)('landlord', 'admin')]
        }
    });
};
exports.properties = properties;
//# sourceMappingURL=properties.js.map