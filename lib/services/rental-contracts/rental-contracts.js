"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalContracts = exports.rentalContractsMethods = exports.rentalContractsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const rental_contracts_class_1 = require("./rental-contracts.class");
const rental_contracts_schema_1 = require("./rental-contracts.schema");
exports.rentalContractsPath = 'rental-contracts';
exports.rentalContractsMethods = ['find', 'get', 'create', 'patch', 'remove'];
/**
 * Intercepts patch calls where `data.action === 'renew'`.
 * Creates a fresh draft contract extending the existing lease by `data.months` months
 * then clears `context.result` so the original patch is skipped.
 * Only the tenant who owns the contract (or admin/landlord) may request renewal.
 */
const handleRenewalAction = async (context) => {
    const data = context.data;
    if (data?.action !== 'renew')
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const id = String(context.id || '');
    const db = await context.app.get('mongodbClient');
    const col = db.collection('rental_contracts');
    let existing = await col.findOne({ _id: id });
    if (!existing && mongodb_1.ObjectId.isValid(id) && id.length === 24) {
        existing = await col.findOne({ _id: new mongodb_1.ObjectId(id) });
    }
    if (!existing)
        throw new errors_1.errors.NotFound('Contract not found.');
    const isTenant = roles.includes('tenant') && String(existing.tenantId) === String(user._id);
    const isLandlord = roles.includes('landlord') && String(existing.landlordId) === String(user._id);
    const isAdmin = roles.includes('admin');
    if (!isTenant && !isLandlord && !isAdmin)
        throw new errors_1.errors.Forbidden('You cannot renew this contract.');
    const months = Math.max(1, Math.min(60, Number(data.months) || 12));
    const oldEnd = existing.endDate ? new Date(existing.endDate) : new Date();
    const newStart = new Date(oldEnd);
    newStart.setDate(newStart.getDate() + 1);
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + months);
    const renewal = await context.app.service(exports.rentalContractsPath).create({
        unitId: existing.unitId,
        landlordId: existing.landlordId,
        tenantId: existing.tenantId,
        monthlyRent: existing.monthlyRent,
        rentCurrency: existing.rentCurrency || 'GHS',
        startDate: newStart.toISOString().split('T')[0],
        endDate: newEnd.toISOString().split('T')[0],
        status: 'draft',
        contractType: existing.contractType || 'ai_generated',
        content: existing.content || undefined,
        documentUrl: existing.documentUrl || undefined
    }, { provider: undefined });
    // Return the new renewal contract; skip default patch behaviour
    context.result = renewal;
    return context;
};
const restrictFindToOwn = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    if (roles.includes('property_manager')) {
        const db = await context.app.get('mongodbClient');
        const assigns = await db
            .collection('property_manager_assignments')
            .find({ managerUserId: user._id.toString() })
            .project({ propertyId: 1 })
            .toArray();
        const pids = [...new Set(assigns.map((a) => String(a.propertyId)).filter(Boolean))];
        if (!pids.length) {
            (0, merge_query_1.mergeQuery)(context, { landlordId: '__none__' });
            return context;
        }
        const oids = pids.map((i) => (mongodb_1.ObjectId.isValid(String(i)) && String(i).length === 24 ? new mongodb_1.ObjectId(String(i)) : i));
        const props = await db.collection('properties').find({ _id: { $in: oids } }).project({ landlordId: 1 }).toArray();
        const lids = [...new Set(props.map((p) => String(p.landlordId)).filter(Boolean))];
        if (!lids.length)
            (0, merge_query_1.mergeQuery)(context, { landlordId: '__none__' });
        else if (lids.length === 1)
            (0, merge_query_1.mergeQuery)(context, { landlordId: lids[0] });
        else
            (0, merge_query_1.mergeQuery)(context, { landlordId: { $in: lids } });
        return context;
    }
    if (roles.includes('tenant') && !roles.includes('admin')) {
        (0, merge_query_1.mergeQuery)(context, { tenantId: user._id.toString() });
    }
    if (roles.includes('landlord') && !roles.includes('admin')) {
        (0, merge_query_1.mergeQuery)(context, { landlordId: user._id.toString() });
    }
    return context;
};
const rentalContracts = (app) => {
    app.use(exports.rentalContractsPath, new rental_contracts_class_1.RentalContractsService((0, rental_contracts_class_1.getOptions)(app)), {
        methods: exports.rentalContractsMethods,
        events: []
    });
    /**
     * After any patch, if both parties have now signed and the contract is still
     * in 'draft' / 'sent' / 'signed' status, automatically promote it to 'active'.
     * This runs as an internal call so it bypasses the patch validator.
     */
    const autoActivateOnFullySigned = async (context) => {
        const result = context.result;
        if (!result?._id)
            return context;
        const bothSigned = !!(result.landlordSignedAt && result.tenantSignedAt);
        const notYetActive = ['draft', 'sent', 'signed'].includes(result.status || 'draft');
        if (bothSigned && notYetActive) {
            await context.app.service(exports.rentalContractsPath).patch(String(result._id), { status: 'active' }, { provider: undefined });
        }
        return context;
    };
    app.service(exports.rentalContractsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(rental_contracts_schema_1.rentalContractExternalResolver), schema_1.hooks.resolveResult(rental_contracts_schema_1.rentalContractResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(rental_contracts_schema_1.rentalContractQueryValidator), schema_1.hooks.resolveQuery(rental_contracts_schema_1.rentalContractQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), restrictFindToOwn],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager'),
                schema_1.hooks.validateData(rental_contracts_schema_1.rentalContractDataValidator),
                schema_1.hooks.resolveData(rental_contracts_schema_1.rentalContractDataResolver)
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                (0, require_role_1.requireRole)('tenant', 'landlord', 'admin', 'property_manager'),
                handleRenewalAction,
                schema_1.hooks.validateData(rental_contracts_schema_1.rentalContractPatchValidator),
                schema_1.hooks.resolveData(rental_contracts_schema_1.rentalContractPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        },
        after: {
            patch: [autoActivateOnFullySigned]
        }
    });
};
exports.rentalContracts = rentalContracts;
//# sourceMappingURL=rental-contracts.js.map