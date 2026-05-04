"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeRateQueryResolver = exports.exchangeRateQueryValidator = exports.exchangeRateQuerySchema = exports.exchangeRateQueryProperties = exports.exchangeRatePatchResolver = exports.exchangeRatePatchValidator = exports.exchangeRatePatchSchema = exports.exchangeRateDataResolver = exports.exchangeRateDataValidator = exports.exchangeRateDataSchema = exports.exchangeRateExternalResolver = exports.exchangeRateResolver = exports.exchangeRateValidator = exports.exchangeRateSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.exchangeRateSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    landlordId: typebox_1.Type.String(),
    baseCurrency: typebox_1.Type.Optional(typebox_1.Type.String({ default: 'GHS' })),
    targetCurrency: typebox_1.Type.String(),
    rate: typebox_1.Type.Number(),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'ExchangeRate', additionalProperties: false });
exports.exchangeRateValidator = (0, typebox_1.getValidator)(exports.exchangeRateSchema, validators_1.dataValidator);
exports.exchangeRateResolver = (0, schema_1.resolve)({});
exports.exchangeRateExternalResolver = (0, schema_1.resolve)({});
exports.exchangeRateDataSchema = typebox_1.Type.Object({
    /** Required for `property_manager` when setting rates for a landlord portfolio. */
    landlordId: typebox_1.Type.Optional(typebox_1.Type.String()),
    baseCurrency: typebox_1.Type.Optional(typebox_1.Type.String()),
    targetCurrency: typebox_1.Type.String(),
    rate: typebox_1.Type.Number()
}, { $id: 'ExchangeRateData', additionalProperties: false });
exports.exchangeRateDataValidator = (0, typebox_1.getValidator)(exports.exchangeRateDataSchema, validators_1.dataValidator);
exports.exchangeRateDataResolver = (0, schema_1.resolve)({
    baseCurrency: async (v) => v ?? 'GHS',
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.exchangeRatePatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.exchangeRateSchema, ['_id', 'landlordId', 'createdAt']), {
    $id: 'ExchangeRatePatch'
});
exports.exchangeRatePatchValidator = (0, typebox_1.getValidator)(exports.exchangeRatePatchSchema, validators_1.dataValidator);
exports.exchangeRatePatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.exchangeRateQueryProperties = typebox_1.Type.Pick(exports.exchangeRateSchema, ['_id', 'landlordId', 'baseCurrency', 'targetCurrency']);
exports.exchangeRateQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.exchangeRateQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.exchangeRateQueryValidator = (0, typebox_1.getValidator)(exports.exchangeRateQuerySchema, validators_1.queryValidator);
exports.exchangeRateQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=exchange-rates.schema.js.map