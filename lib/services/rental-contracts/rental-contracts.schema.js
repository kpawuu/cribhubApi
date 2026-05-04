"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalContractQueryResolver = exports.rentalContractQueryValidator = exports.rentalContractQuerySchema = exports.rentalContractQueryProperties = exports.rentalContractPatchResolver = exports.rentalContractPatchValidator = exports.rentalContractPatchSchema = exports.rentalContractDataResolver = exports.rentalContractDataValidator = exports.rentalContractDataSchema = exports.rentalContractExternalResolver = exports.rentalContractResolver = exports.rentalContractValidator = exports.rentalContractSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.rentalContractSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    unitId: typebox_1.Type.String(),
    landlordId: typebox_1.Type.String(),
    tenantId: typebox_1.Type.String(),
    contractType: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('ai_generated'), typebox_1.Type.Literal('manual_upload')])),
    content: typebox_1.Type.Optional(typebox_1.Type.String()),
    documentUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('draft'), typebox_1.Type.Literal('sent'), typebox_1.Type.Literal('signed'), typebox_1.Type.Literal('active'), typebox_1.Type.Literal('expired')])),
    landlordSignedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    tenantSignedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    startDate: typebox_1.Type.String(),
    endDate: typebox_1.Type.String(),
    monthlyRent: typebox_1.Type.Number(),
    rentCurrency: typebox_1.Type.Optional(typebox_1.Type.String({ default: 'GHS' })),
    lastPaidAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'RentalContract', additionalProperties: false });
exports.rentalContractValidator = (0, typebox_1.getValidator)(exports.rentalContractSchema, validators_1.dataValidator);
exports.rentalContractResolver = (0, schema_1.resolve)({});
exports.rentalContractExternalResolver = (0, schema_1.resolve)({});
exports.rentalContractDataSchema = typebox_1.Type.Object({
    unitId: typebox_1.Type.String(),
    landlordId: typebox_1.Type.String(),
    tenantId: typebox_1.Type.String(),
    contractType: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('ai_generated'), typebox_1.Type.Literal('manual_upload')])),
    content: typebox_1.Type.Optional(typebox_1.Type.String()),
    documentUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('draft'), typebox_1.Type.Literal('sent'), typebox_1.Type.Literal('signed'), typebox_1.Type.Literal('active'), typebox_1.Type.Literal('expired')])),
    startDate: typebox_1.Type.String(),
    endDate: typebox_1.Type.String(),
    monthlyRent: typebox_1.Type.Number(),
    rentCurrency: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'RentalContractData', additionalProperties: false });
exports.rentalContractDataValidator = (0, typebox_1.getValidator)(exports.rentalContractDataSchema, validators_1.dataValidator);
exports.rentalContractDataResolver = (0, schema_1.resolve)({
    status: async (v) => v ?? 'draft',
    contractType: async (v) => v ?? 'ai_generated',
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.rentalContractPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.rentalContractSchema, ['_id', 'unitId', 'landlordId', 'tenantId', 'createdAt']), { $id: 'RentalContractPatch' });
exports.rentalContractPatchValidator = (0, typebox_1.getValidator)(exports.rentalContractPatchSchema, validators_1.dataValidator);
exports.rentalContractPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.rentalContractQueryProperties = typebox_1.Type.Pick(exports.rentalContractSchema, [
    '_id',
    'unitId',
    'landlordId',
    'tenantId',
    'status',
    'createdAt',
    'updatedAt'
]);
exports.rentalContractQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.rentalContractQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.rentalContractQueryValidator = (0, typebox_1.getValidator)(exports.rentalContractQuerySchema, validators_1.queryValidator);
exports.rentalContractQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=rental-contracts.schema.js.map