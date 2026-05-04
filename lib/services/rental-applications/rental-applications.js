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
    const col = db.collection('rental_applications');
    const raw = String(context.id || '');
    if (mongodb_1.ObjectId.isValid(raw) && raw.length === 24) {
        const row = await col.findOne({ _id: new mongodb_1.ObjectId(raw) });
        if (row)
            return row;
    }
    return await col.findOne({ _id: raw });
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
        if (!props.length) {
            (0, merge_query_1.mergeQuery)(context, { unitId: { $in: [] } });
            return context;
        }
        // Include both string and ObjectId forms to handle mixed storage
        const propIdStrings = props.map((p) => p._id.toString());
        const uts = await db.collection('units').find({ propertyId: { $in: propIdStrings } }).project({ _id: 1 }).toArray();
        const unitIds = uts.map((u) => u._id.toString());
        (0, merge_query_1.mergeQuery)(context, { unitId: { $in: unitIds.length ? unitIds : ['__none__'] } });
        return context;
    }
    if (roles.includes('agent')) {
        const db = await context.app.get('mongodbClient');
        const assigns = await db
            .collection('agent_assignments')
            .find({ agentUserId: user._id.toString() })
            .project({ propertyId: 1 })
            .toArray();
        const propIdStrings = [...new Set(assigns.map((a) => String(a.propertyId)).filter(Boolean))];
        if (!propIdStrings.length) {
            (0, merge_query_1.mergeQuery)(context, { unitId: { $in: [] } });
            return context;
        }
        const uts = await db.collection('units').find({ propertyId: { $in: propIdStrings } }).project({ _id: 1 }).toArray();
        const unitIds = uts.map((u) => u._id.toString());
        (0, merge_query_1.mergeQuery)(context, { unitId: { $in: unitIds.length ? unitIds : ['__none__'] } });
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
        const count = await db.collection('agent_assignments').countDocuments({
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
const toLeaseDate = (v, fallback) => {
    if (v == null || v === '')
        return fallback;
    const s = String(v).trim();
    if (!s)
        return fallback;
    return s.length >= 10 ? s.slice(0, 10) : s;
};
const addOneYear = (yyyyMmDd) => {
    const d = new Date(`${yyyyMmDd}T12:00:00.000Z`);
    if (Number.isNaN(d.getTime()))
        return yyyyMmDd;
    d.setUTCFullYear(d.getUTCFullYear() + 1);
    return d.toISOString().slice(0, 10);
};
const safeMonthlyRent = (unit) => {
    const raw = unit?.rentAmount;
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n) || n < 0)
        return 0;
    return n;
};
/**
 * Runs **before** the rental-application document is patched so failures keep the row `pending`
 * and the client receives a proper error instead of a 500 after a partial commit.
 */
const assignUnitAndContractOnApprove = async (context) => {
    if (context.method !== 'patch')
        return context;
    const data = context.data;
    if (data?.status !== 'approved')
        return context;
    const row = await loadApplicationRow(context);
    if (!row || String(row.status) !== 'pending')
        return context;
    const app = context.app;
    const unit = await app.service('units').get(String(row.unitId), { provider: undefined });
    const unitIdStr = String(unit._id ?? row.unitId);
    const applicantId = String(row.applicantId);
    if (String(unit.status) === 'occupied' && String(unit.tenantId || '') === applicantId) {
        return context;
    }
    if (String(unit.status) === 'occupied') {
        throw new errors_1.errors.Conflict('This unit is already occupied by another tenant. Resolve the unit before approving.');
    }
    const today = new Date().toISOString().slice(0, 10);
    let startDate = toLeaseDate(unit.leaseStart, today);
    let endDate = toLeaseDate(unit.leaseEnd, addOneYear(startDate));
    if (endDate <= startDate) {
        endDate = addOneYear(startDate);
    }
    const monthlyRent = safeMonthlyRent(unit);
    const landlordId = await inferLandlordIdForUnit(context, String(unit.propertyId));
    if (!landlordId) {
        throw new errors_1.errors.BadRequest('Property has no landlordId; cannot create rental contract.');
    }
    const db = await app.get('mongodbClient');
    const existingContract = await db.collection('rental_contracts').findOne({
        unitId: unitIdStr,
        tenantId: applicantId,
        status: 'draft'
    });
    if (!existingContract) {
        await app.service('rental-contracts').create({
            unitId: unitIdStr,
            landlordId,
            tenantId: applicantId,
            contractType: 'ai_generated',
            status: 'draft',
            startDate,
            endDate,
            monthlyRent,
            rentCurrency: unit.rentCurrency || 'GHS'
        }, { provider: undefined });
    }
    await app.service('units').patch(unit._id, {
        status: 'occupied',
        tenantId: applicantId
    }, { provider: undefined });
    return context;
};
const inferLandlordIdForUnit = async (context, propertyId) => {
    const property = await context.app.service('properties').get(propertyId, { provider: undefined });
    const lid = property.landlordId;
    return lid != null ? String(lid) : '';
};
const preventDuplicateApplication = async (context) => {
    const user = context.params.user;
    const unitId = context.data?.unitId;
    if (!unitId || !user?._id)
        return context;
    const db = await context.app.get('mongodbClient');
    const existing = await db.collection('rental_applications').findOne({
        applicantId: user._id.toString(),
        unitId: String(unitId),
        status: { $in: ['pending', 'approved'] }
    });
    if (existing) {
        throw new errors_1.errors.Conflict(existing.status === 'approved'
            ? 'Your application for this unit has already been approved.'
            : 'You already have a pending application for this unit.');
    }
    return context;
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
                preventDuplicateApplication,
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
                },
                assignUnitAndContractOnApprove
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        }
    });
};
exports.rentalApplications = rentalApplications;
//# sourceMappingURL=rental-applications.js.map