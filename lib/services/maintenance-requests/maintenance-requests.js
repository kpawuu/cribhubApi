"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceRequests = exports.maintenanceRequestsMethods = exports.maintenanceRequestsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const portfolio_unit_ids_1 = require("../../hooks/portfolio-unit-ids");
const maintenance_requests_class_1 = require("./maintenance-requests.class");
const maintenance_requests_schema_1 = require("./maintenance-requests.schema");
exports.maintenanceRequestsPath = 'maintenance-requests';
exports.maintenanceRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const attachTenant = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    context.data.tenantId = user._id.toString();
    return context;
};
const tryId = (id) => {
    const s = String(id);
    if (mongodb_1.ObjectId.isValid(s) && s.length === 24)
        return new mongodb_1.ObjectId(s);
    return s;
};
const loadMaintenanceRow = async (context) => {
    const db = await context.app.get('mongodbClient');
    const col = db.collection('maintenance_requests');
    const raw = String(context.id || '');
    let row = await col.findOne({ _id: raw });
    if (!row && mongodb_1.ObjectId.isValid(raw) && raw.length === 24) {
        row = await col.findOne({ _id: new mongodb_1.ObjectId(raw) });
    }
    return row;
};
const restrictFind = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    if (roles.includes('landlord')) {
        const unitIds = await (0, portfolio_unit_ids_1.unitIdsForLandlord)(context.app, user);
        const unitId = unitIds.length === 0 ? { $in: [] } : unitIds.length === 1 ? unitIds[0] : { $in: unitIds };
        (0, merge_query_1.mergeQuery)(context, { unitId });
        return context;
    }
    if (roles.includes('agent')) {
        const unitIds = await (0, portfolio_unit_ids_1.unitIdsForAgent)(context.app, user._id.toString());
        const unitId = unitIds.length === 0 ? { $in: [] } : unitIds.length === 1 ? unitIds[0] : { $in: unitIds };
        (0, merge_query_1.mergeQuery)(context, { unitId });
        return context;
    }
    if (roles.includes('property_manager')) {
        const unitIds = await (0, portfolio_unit_ids_1.unitIdsForPropertyManager)(context.app, user._id.toString());
        const unitId = unitIds.length === 0 ? { $in: [] } : unitIds.length === 1 ? unitIds[0] : { $in: unitIds };
        (0, merge_query_1.mergeQuery)(context, { unitId });
        return context;
    }
    if (roles.includes('tenant')) {
        (0, merge_query_1.mergeQuery)(context, { tenantId: user._id.toString() });
        return context;
    }
    throw new errors_1.errors.Forbidden('You are not allowed to list maintenance requests.');
};
const restrictGet = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    const row = await loadMaintenanceRow(context);
    if (!row)
        throw new errors_1.errors.NotFound();
    if (roles.includes('tenant') && String(row.tenantId) === String(user._id))
        return context;
    const db = await context.app.get('mongodbClient');
    const unit = await db.collection('units').findOne({ _id: tryId(row.unitId) });
    if (!unit)
        throw new errors_1.errors.Forbidden();
    const prop = await db.collection('properties').findOne({ _id: tryId(unit.propertyId) });
    if (!prop)
        throw new errors_1.errors.Forbidden();
    if (roles.includes('landlord') && String(prop.landlordId) === String(user._id))
        return context;
    if (roles.includes('agent')) {
        const n = await db.collection('agent-assignments').countDocuments({
            agentUserId: user._id.toString(),
            propertyId: String(unit.propertyId)
        });
        if (n > 0)
            return context;
    }
    if (roles.includes('property_manager')) {
        const n = await db.collection('property_manager_assignments').countDocuments({
            managerUserId: user._id.toString(),
            propertyId: String(unit.propertyId)
        });
        if (n > 0)
            return context;
    }
    throw new errors_1.errors.Forbidden();
};
const ensurePatchAccess = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    const row = await loadMaintenanceRow(context);
    if (!row)
        throw new errors_1.errors.NotFound();
    const db = await context.app.get('mongodbClient');
    const unit = await db.collection('units').findOne({ _id: tryId(row.unitId) });
    if (!unit)
        throw new errors_1.errors.Forbidden();
    const prop = await db.collection('properties').findOne({ _id: tryId(unit.propertyId) });
    if (!prop)
        throw new errors_1.errors.Forbidden();
    if (roles.includes('landlord') && String(prop.landlordId) === String(user._id))
        return context;
    if (roles.includes('agent')) {
        const n = await db.collection('agent-assignments').countDocuments({
            agentUserId: user._id.toString(),
            propertyId: String(unit.propertyId)
        });
        if (n > 0)
            return context;
    }
    if (roles.includes('property_manager')) {
        const n = await db.collection('property_manager_assignments').countDocuments({
            managerUserId: user._id.toString(),
            propertyId: String(unit.propertyId)
        });
        if (n > 0)
            return context;
    }
    throw new errors_1.errors.Forbidden('You cannot update this maintenance request.');
};
const maintenanceRequests = (app) => {
    app.use(exports.maintenanceRequestsPath, new maintenance_requests_class_1.MaintenanceRequestsService((0, maintenance_requests_class_1.getOptions)(app)), {
        methods: exports.maintenanceRequestsMethods,
        events: []
    });
    app.service(exports.maintenanceRequestsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(maintenance_requests_schema_1.maintenanceRequestExternalResolver), schema_1.hooks.resolveResult(maintenance_requests_schema_1.maintenanceRequestResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(maintenance_requests_schema_1.maintenanceRequestQueryValidator), schema_1.hooks.resolveQuery(maintenance_requests_schema_1.maintenanceRequestQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictFind],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictGet],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                (0, require_role_1.requireRole)('tenant', 'admin'),
                schema_1.hooks.validateData(maintenance_requests_schema_1.maintenanceRequestDataValidator),
                schema_1.hooks.resolveData(maintenance_requests_schema_1.maintenanceRequestDataResolver),
                attachTenant
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                (0, require_role_1.requireRole)('landlord', 'property_manager', 'admin', 'agent'),
                ensurePatchAccess,
                schema_1.hooks.validateData(maintenance_requests_schema_1.maintenanceRequestPatchValidator),
                schema_1.hooks.resolveData(maintenance_requests_schema_1.maintenanceRequestPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        }
    });
};
exports.maintenanceRequests = maintenanceRequests;
//# sourceMappingURL=maintenance-requests.js.map