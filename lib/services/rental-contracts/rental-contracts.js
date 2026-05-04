"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalContracts = exports.rentalContractsMethods = exports.rentalContractsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const rental_contracts_class_1 = require("./rental-contracts.class");
const rental_contracts_schema_1 = require("./rental-contracts.schema");
exports.rentalContractsPath = 'rental-contracts';
exports.rentalContractsMethods = ['find', 'get', 'create', 'patch', 'remove'];
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
                (0, require_role_1.requireRole)('tenant', 'landlord', 'admin', 'property_manager'),
                schema_1.hooks.validateData(rental_contracts_schema_1.rentalContractPatchValidator),
                schema_1.hooks.resolveData(rental_contracts_schema_1.rentalContractPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        }
    });
};
exports.rentalContracts = rentalContracts;
//# sourceMappingURL=rental-contracts.js.map