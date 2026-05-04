"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalApplications = exports.rentalApplicationsMethods = exports.rentalApplicationsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const portfolio_unit_ids_1 = require("../../hooks/portfolio-unit-ids");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const rental_applications_class_1 = require("./rental-applications.class");
const rental_applications_schema_1 = require("./rental-applications.schema");
exports.rentalApplicationsPath = 'rental-applications';
exports.rentalApplicationsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const tryId = (id) => {
    const s = String(id);
    if (mongodb_1.ObjectId.isValid(s) && s.length === 24)
        return new mongodb_1.ObjectId(s);
    return s;
};
const loadApplicationRow = async (context) => {
    const db = await context.app.get('mongodbClient');
    const col = db.collection('rental-applications');
    const raw = String(context.id || '');
    let row = await col.findOne({ _id: raw });
    if (!row && mongodb_1.ObjectId.isValid(raw) && raw.length === 24) {
        row = await col.findOne({ _id: new mongodb_1.ObjectId(raw) });
    }
    return row;
};
const attachApplicant = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    context.data.applicantId = user._id.toString();
    return context;
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
        const db = await context.app.get('mongodbClient');
        const uid = user._id.toString();
        const props = await db
            .collection('properties')
            .find({ $or: [{ landlordId: uid }, { landlordId: user._id }] })
            .project({ _id: 1 })
            .toArray();
        const propIds = props.map((p) => p._id);
        if (!propIds.length) {
            (0, merge_query_1.mergeQuery)(context, { unitId: { $in: [] } });
            return context;
        }
        const uts = await db.collection('units').find({ propertyId: { $in: propIds } }).project({ _id: 1 }).toArray();
        const unitIds = uts.map((u) => u._id.toString());
        (0, merge_query_1.mergeQuery)(context, { unitId: { $in: unitIds } });
        return context;
    }
    if (roles.includes('agent')) {
        const db = await context.app.get('mongodbClient');
        const assigns = await db
            .collection('agent-assignments')
            .find({ agentUserId: user._id.toString() })
            .project({ propertyId: 1 })
            .toArray();
        const propIds = [...new Set(assigns.map((a) => String(a.propertyId)).filter(Boolean))];
        if (!propIds.length) {
            (0, merge_query_1.mergeQuery)(context, { unitId: { $in: [] } });
            return context;
        }
        const uts = await db.collection('units').find({ propertyId: { $in: propIds } }).project({ _id: 1 }).toArray();
        const unitIds = uts.map((u) => u._id.toString());
        (0, merge_query_1.mergeQuery)(context, { unitId: { $in: unitIds } });
        return context;
    }
    if (roles.includes('property_manager')) {
        const unitIds = await (0, portfolio_unit_ids_1.unitIdsForPropertyManager)(context.app, user._id.toString());
        const unitId = unitIds.length === 0 ? { $in: [] } : unitIds.length === 1 ? unitIds[0] : { $in: unitIds };
        (0, merge_query_1.mergeQuery)(context, { unitId });
        return context;
    }
    if (roles.includes('tenant')) {
        (0, merge_query_1.mergeQuery)(context, { applicantId: user._id.toString() });
        return context;
    }
    throw new errors_1.errors.Forbidden('You are not allowed to list rental applications.');
};
const restrictGet = async (context) => {
    if (!context.params.provider)
        return context;
    const row = await loadApplicationRow(context);
    if (!row)
        throw new errors_1.errors.NotFound();
    const user = context.params.user;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    if (roles.includes('tenant') && String(row.applicantId) === String(user._id))
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
        const count = await db.collection('agent-assignments').countDocuments({
            agentUserId: user._id.toString(),
            propertyId: String(unit.propertyId)
        });
        if (count > 0)
            return context;
    }
    if (roles.includes('property_manager')) {
        const count = await db.collection('property_manager_assignments').countDocuments({
            managerUserId: user._id.toString(),
            propertyId: String(unit.propertyId)
        });
        if (count > 0)
            return context;
    }
    throw new errors_1.errors.Forbidden();
};
const ensureLandlordOwnsApplicationBeforePatch = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin') || roles.includes('property_manager'))
        return context;
    if (!roles.includes('landlord'))
        return context;
    const row = await loadApplicationRow(context);
    if (!row)
        throw new errors_1.errors.NotFound();
    const db = await context.app.get('mongodbClient');
    const unit = await db.collection('units').findOne({ _id: tryId(row.unitId) });
    if (!unit)
        throw new errors_1.errors.Forbidden();
    const prop = await db.collection('properties').findOne({ _id: tryId(unit.propertyId) });
    if (!prop || String(prop.landlordId) !== String(user._id)) {
        throw new errors_1.errors.Forbidden('You cannot review this application.');
    }
    return context;
};
const onApproveAssignUnitAndContractPlaceholder = async (context) => {
    const patched = context.result;
    if (patched?.status !== 'approved')
        return context;
    const unit = await context.app.service('units').get(patched.unitId, { provider: undefined });
    await context.app.service('units').patch(unit._id, {
        status: 'occupied',
        tenantId: patched.applicantId
    }, { provider: undefined });
    await context.app.service('rental-contracts').create({
        unitId: patched.unitId,
        landlordId: await inferLandlordIdForUnit(context, unit.propertyId),
        tenantId: patched.applicantId,
        contractType: 'ai_generated',
        status: 'draft',
        startDate: unit.leaseStart || new Date().toISOString().slice(0, 10),
        endDate: unit.leaseEnd || new Date().toISOString().slice(0, 10),
        monthlyRent: unit.rentAmount,
        rentCurrency: unit.rentCurrency || 'GHS'
    }, { provider: undefined });
    return context;
};
const inferLandlordIdForUnit = async (context, propertyId) => {
    const property = await context.app.service('properties').get(propertyId, { provider: undefined });
    return property.landlordId;
};
const rentalApplications = (app) => {
    app.use(exports.rentalApplicationsPath, new rental_applications_class_1.RentalApplicationsService((0, rental_applications_class_1.getOptions)(app)), {
        methods: exports.rentalApplicationsMethods,
        events: []
    });
    app.service(exports.rentalApplicationsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(rental_applications_schema_1.rentalApplicationExternalResolver), schema_1.hooks.resolveResult(rental_applications_schema_1.rentalApplicationResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(rental_applications_schema_1.rentalApplicationQueryValidator), schema_1.hooks.resolveQuery(rental_applications_schema_1.rentalApplicationQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictFind],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictGet],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                (0, require_role_1.requireRole)('tenant', 'admin'),
                schema_1.hooks.validateData(rental_applications_schema_1.rentalApplicationDataValidator),
                schema_1.hooks.resolveData(rental_applications_schema_1.rentalApplicationDataResolver),
                attachApplicant
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager'),
                ensureLandlordOwnsApplicationBeforePatch,
                schema_1.hooks.validateData(rental_applications_schema_1.rentalApplicationPatchValidator),
                schema_1.hooks.resolveData(rental_applications_schema_1.rentalApplicationPatchResolver),
                async (ctx) => {
                    const u = ctx.params.user;
                    ctx.data.reviewedBy = u?._id?.toString();
                }
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        },
        after: {
            patch: [onApproveAssignUnitAndContractPlaceholder]
        }
    });
};
exports.rentalApplications = rentalApplications;
//# sourceMappingURL=rental-applications.js.map