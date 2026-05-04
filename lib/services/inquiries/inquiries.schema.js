"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiryQueryResolver = exports.inquiryQueryValidator = exports.inquiryQuerySchema = exports.inquiryQueryProperties = exports.inquiryPatchResolver = exports.inquiryPatchValidator = exports.inquiryPatchSchema = exports.inquiryDataResolver = exports.inquiryDataValidator = exports.inquiryDataSchema = exports.inquiryExternalResolver = exports.inquiryResolver = exports.inquiryValidator = exports.inquirySchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.inquirySchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    propertyId: typebox_1.Type.String(),
    unitId: typebox_1.Type.Optional(typebox_1.Type.String()),
    agentUserId: typebox_1.Type.Optional(typebox_1.Type.String()),
    landlordId: typebox_1.Type.Optional(typebox_1.Type.String()),
    createdByUserId: typebox_1.Type.Optional(typebox_1.Type.String()), // if authenticated
    name: typebox_1.Type.Optional(typebox_1.Type.String()),
    email: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'email' })),
    phone: typebox_1.Type.Optional(typebox_1.Type.String()),
    contactMethod: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('call'), typebox_1.Type.Literal('email'), typebox_1.Type.Literal('whatsapp'), typebox_1.Type.Literal('message')])),
    message: typebox_1.Type.Optional(typebox_1.Type.String()),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('new'), typebox_1.Type.Literal('contacted'), typebox_1.Type.Literal('viewing_scheduled'), typebox_1.Type.Literal('closed'), typebox_1.Type.Literal('lost')])),
    lastMessageAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    lastMessagePreview: typebox_1.Type.Optional(typebox_1.Type.String()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'Inquiry', additionalProperties: false });
exports.inquiryValidator = (0, typebox_1.getValidator)(exports.inquirySchema, validators_1.dataValidator);
exports.inquiryResolver = (0, schema_1.resolve)({});
exports.inquiryExternalResolver = (0, schema_1.resolve)({});
exports.inquiryDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String(),
    unitId: typebox_1.Type.Optional(typebox_1.Type.String()),
    name: typebox_1.Type.Optional(typebox_1.Type.String()),
    email: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'email' })),
    phone: typebox_1.Type.Optional(typebox_1.Type.String()),
    contactMethod: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('call'), typebox_1.Type.Literal('email'), typebox_1.Type.Literal('whatsapp'), typebox_1.Type.Literal('message')])),
    message: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'InquiryData', additionalProperties: false });
exports.inquiryDataValidator = (0, typebox_1.getValidator)(exports.inquiryDataSchema, validators_1.dataValidator);
exports.inquiryDataResolver = (0, schema_1.resolve)({
    status: async () => 'new',
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.inquiryPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Object({
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('new'), typebox_1.Type.Literal('contacted'), typebox_1.Type.Literal('viewing_scheduled'), typebox_1.Type.Literal('closed'), typebox_1.Type.Literal('lost')])),
    message: typebox_1.Type.Optional(typebox_1.Type.String()),
    lastMessageAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    lastMessagePreview: typebox_1.Type.Optional(typebox_1.Type.String())
}), { $id: 'InquiryPatch', additionalProperties: false });
exports.inquiryPatchValidator = (0, typebox_1.getValidator)(exports.inquiryPatchSchema, validators_1.dataValidator);
exports.inquiryPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.inquiryQueryProperties = typebox_1.Type.Pick(exports.inquirySchema, [
    '_id',
    'propertyId',
    'agentUserId',
    'landlordId',
    'status',
    'createdAt',
    'updatedAt'
]);
exports.inquiryQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.inquiryQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], {
    additionalProperties: true
});
exports.inquiryQueryValidator = (0, typebox_1.getValidator)(exports.inquiryQuerySchema, validators_1.queryValidator);
exports.inquiryQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=inquiries.schema.js.map