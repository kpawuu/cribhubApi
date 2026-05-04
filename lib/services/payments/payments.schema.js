"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentQueryResolver = exports.paymentQueryValidator = exports.paymentQuerySchema = exports.paymentQueryProperties = exports.paymentPatchResolver = exports.paymentPatchValidator = exports.paymentPatchSchema = exports.paymentDataResolver = exports.paymentDataValidator = exports.paymentDataSchema = exports.paymentExternalResolver = exports.paymentResolver = exports.paymentValidator = exports.paymentSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.paymentSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    tenantId: typebox_1.Type.String(),
    landlordId: typebox_1.Type.String(),
    unitId: typebox_1.Type.String(),
    amount: typebox_1.Type.Number(),
    currency: typebox_1.Type.Optional(typebox_1.Type.String({ default: 'GHS' })),
    reference: typebox_1.Type.String(),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('pending'), typebox_1.Type.Literal('success'), typebox_1.Type.Literal('failed')])),
    channel: typebox_1.Type.Optional(typebox_1.Type.String()),
    paidAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    isManualEntry: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    payerName: typebox_1.Type.Optional(typebox_1.Type.String()),
    payerPhone: typebox_1.Type.Optional(typebox_1.Type.String()),
    metadata: typebox_1.Type.Optional(typebox_1.Type.Any()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'Payment', additionalProperties: false });
exports.paymentValidator = (0, typebox_1.getValidator)(exports.paymentSchema, validators_1.dataValidator);
exports.paymentResolver = (0, schema_1.resolve)({});
exports.paymentExternalResolver = (0, schema_1.resolve)({});
// For manual entries (landlord)
exports.paymentDataSchema = typebox_1.Type.Object({
    tenantId: typebox_1.Type.String(),
    unitId: typebox_1.Type.String(),
    /** Required for `property_manager` manual entries; optional for admins (defaults to self). */
    landlordId: typebox_1.Type.Optional(typebox_1.Type.String()),
    amount: typebox_1.Type.Number(),
    currency: typebox_1.Type.Optional(typebox_1.Type.String()),
    reference: typebox_1.Type.Optional(typebox_1.Type.String()),
    paidAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    payerName: typebox_1.Type.Optional(typebox_1.Type.String()),
    payerPhone: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'PaymentData', additionalProperties: false });
exports.paymentDataValidator = (0, typebox_1.getValidator)(exports.paymentDataSchema, validators_1.dataValidator);
exports.paymentDataResolver = (0, schema_1.resolve)({
    status: async () => 'success',
    isManualEntry: async () => true,
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.paymentPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Object({
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('pending'), typebox_1.Type.Literal('success'), typebox_1.Type.Literal('failed')])),
    channel: typebox_1.Type.Optional(typebox_1.Type.String()),
    paidAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    metadata: typebox_1.Type.Optional(typebox_1.Type.Any())
}), { $id: 'PaymentPatch', additionalProperties: false });
exports.paymentPatchValidator = (0, typebox_1.getValidator)(exports.paymentPatchSchema, validators_1.dataValidator);
exports.paymentPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.paymentQueryProperties = typebox_1.Type.Pick(exports.paymentSchema, [
    '_id',
    'tenantId',
    'landlordId',
    'unitId',
    'status',
    'reference',
    'createdAt',
    'updatedAt'
]);
exports.paymentQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.paymentQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.paymentQueryValidator = (0, typebox_1.getValidator)(exports.paymentQuerySchema, validators_1.queryValidator);
exports.paymentQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=payments.schema.js.map