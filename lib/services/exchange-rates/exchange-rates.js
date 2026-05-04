"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeRates = exports.exchangeRatesMethods = exports.exchangeRatesPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const restrict_query_to_owner_1 = require("../../hooks/restrict-query-to-owner");
const exchange_rates_class_1 = require("./exchange-rates.class");
const exchange_rates_schema_1 = require("./exchange-rates.schema");
exports.exchangeRatesPath = 'exchange-rates';
exports.exchangeRatesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const attachLandlordId = async (context) => {
    const user = context.params.user;
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const data = context.data;
    if (roles.includes('admin')) {
        const lid = data.landlordId != null ? String(data.landlordId).trim() : '';
        data.landlordId = lid || user?._id?.toString();
        return context;
    }
    if (roles.includes('property_manager')) {
        const lid = data.landlordId != null ? String(data.landlordId).trim() : '';
        if (!lid)
            throw new errors_1.errors.BadRequest('landlordId is required');
        data.landlordId = lid;
        return context;
    }
    data.landlordId = user?._id?.toString();
    return context;
};
const exchangeRates = (app) => {
    app.use(exports.exchangeRatesPath, new exchange_rates_class_1.ExchangeRatesService((0, exchange_rates_class_1.getOptions)(app)), {
        methods: exports.exchangeRatesMethods,
        events: []
    });
    app.service(exports.exchangeRatesPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(exchange_rates_schema_1.exchangeRateExternalResolver), schema_1.hooks.resolveResult(exchange_rates_schema_1.exchangeRateResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(exchange_rates_schema_1.exchangeRateQueryValidator), schema_1.hooks.resolveQuery(exchange_rates_schema_1.exchangeRateQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, restrict_query_to_owner_1.restrictQueryToOwner)('landlordId', ['admin', 'property_manager'])],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager'),
                schema_1.hooks.validateData(exchange_rates_schema_1.exchangeRateDataValidator),
                schema_1.hooks.resolveData(exchange_rates_schema_1.exchangeRateDataResolver),
                attachLandlordId
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager'),
                schema_1.hooks.validateData(exchange_rates_schema_1.exchangeRatePatchValidator),
                schema_1.hooks.resolveData(exchange_rates_schema_1.exchangeRatePatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        }
    });
};
exports.exchangeRates = exchangeRates;
//# sourceMappingURL=exchange-rates.js.map