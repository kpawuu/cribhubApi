"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalApplicationQueryResolver = exports.rentalApplicationQueryValidator = exports.rentalApplicationQuerySchema = exports.rentalApplicationQueryProperties = exports.rentalApplicationPatchResolver = exports.rentalApplicationPatchValidator = exports.rentalApplicationPatchSchema = exports.rentalApplicationDataResolver = exports.rentalApplicationDataValidator = exports.rentalApplicationDataSchema = exports.rentalApplicationExternalResolver = exports.rentalApplicationResolver = exports.rentalApplicationValidator = exports.rentalApplicationSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.rentalApplicationSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    unitId: typebox_1.Type.String(),
    applicantId: typebox_1.Type.String(),
    status: typebox_1.Type.Union([typebox_1.Type.Literal('pending'), typebox_1.Type.Literal('approved'), typebox_1.Type.Literal('rejected')]),
    applicationData: typebox_1.Type.Any(),
    documents: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    reviewedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    reviewNotes: typebox_1.Type.Optional(typebox_1.Type.String()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'RentalApplication', additionalProperties: false });
exports.rentalApplicationValidator = (0, typebox_1.getValidator)(exports.rentalApplicationSchema, validators_1.dataValidator);
exports.rentalApplicationResolver = (0, schema_1.resolve)({});
exports.rentalApplicationExternalResolver = (0, schema_1.resolve)({});
exports.rentalApplicationDataSchema = typebox_1.Type.Object({
    unitId: typebox_1.Type.String(),
    applicationData: typebox_1.Type.Any(),
    documents: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String()))
}, { $id: 'RentalApplicationData', additionalProperties: false });
exports.rentalApplicationDataValidator = (0, typebox_1.getValidator)(exports.rentalApplicationDataSchema, validators_1.dataValidator);
exports.rentalApplicationDataResolver = (0, schema_1.resolve)({
    status: async () => 'pending',
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.rentalApplicationPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Object({
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('approved'), typebox_1.Type.Literal('rejected'), typebox_1.Type.Literal('pending')])),
    reviewNotes: typebox_1.Type.Optional(typebox_1.Type.String())
}), { $id: 'RentalApplicationPatch', additionalProperties: false });
exports.rentalApplicationPatchValidator = (0, typebox_1.getValidator)(exports.rentalApplicationPatchSchema, validators_1.dataValidator);
exports.rentalApplicationPatchResolver = (0, schema_1.resolve)({
    reviewedAt: async (_v, _o, ctx) => (ctx.data?.status ? new Date().toISOString() : undefined),
    updatedAt: async () => new Date().toISOString()
});
exports.rentalApplicationQueryProperties = typebox_1.Type.Pick(exports.rentalApplicationSchema, [
    '_id',
    'unitId',
    'applicantId',
    'status',
    'createdAt',
    'updatedAt'
]);
exports.rentalApplicationQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.rentalApplicationQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.rentalApplicationQueryValidator = (0, typebox_1.getValidator)(exports.rentalApplicationQuerySchema, validators_1.queryValidator);
exports.rentalApplicationQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=rental-applications.schema.js.map