"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.virtualViewingRequestQueryResolver = exports.virtualViewingRequestQueryValidator = exports.virtualViewingRequestQuerySchema = exports.virtualViewingRequestQueryProperties = exports.virtualViewingRequestPatchResolver = exports.virtualViewingRequestPatchValidator = exports.virtualViewingRequestPatchSchema = exports.virtualViewingRequestDataResolver = exports.virtualViewingRequestDataValidator = exports.virtualViewingRequestDataSchema = exports.virtualViewingRequestExternalResolver = exports.virtualViewingRequestResolver = exports.virtualViewingRequestValidator = exports.virtualViewingRequestSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.virtualViewingRequestSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    unitId: typebox_1.Type.String(),
    name: typebox_1.Type.String(),
    email: typebox_1.Type.String({ format: 'email' }),
    phone: typebox_1.Type.Optional(typebox_1.Type.String()),
    preferredDate: typebox_1.Type.Optional(typebox_1.Type.String()),
    preferredTime: typebox_1.Type.Optional(typebox_1.Type.String()),
    message: typebox_1.Type.Optional(typebox_1.Type.String()),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('pending'), typebox_1.Type.Literal('confirmed'), typebox_1.Type.Literal('cancelled')])),
    createdAt: typebox_1.Type.String({ format: 'date-time' })
}, { $id: 'VirtualViewingRequest', additionalProperties: false });
exports.virtualViewingRequestValidator = (0, typebox_1.getValidator)(exports.virtualViewingRequestSchema, validators_1.dataValidator);
exports.virtualViewingRequestResolver = (0, schema_1.resolve)({});
exports.virtualViewingRequestExternalResolver = (0, schema_1.resolve)({});
exports.virtualViewingRequestDataSchema = typebox_1.Type.Object({
    unitId: typebox_1.Type.String(),
    name: typebox_1.Type.String(),
    email: typebox_1.Type.String({ format: 'email' }),
    phone: typebox_1.Type.Optional(typebox_1.Type.String()),
    preferredDate: typebox_1.Type.Optional(typebox_1.Type.String()),
    preferredTime: typebox_1.Type.Optional(typebox_1.Type.String()),
    message: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'VirtualViewingRequestData', additionalProperties: false });
exports.virtualViewingRequestDataValidator = (0, typebox_1.getValidator)(exports.virtualViewingRequestDataSchema, validators_1.dataValidator);
exports.virtualViewingRequestDataResolver = (0, schema_1.resolve)({
    status: async () => 'pending',
    createdAt: async () => new Date().toISOString()
});
exports.virtualViewingRequestPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Object({
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('pending'), typebox_1.Type.Literal('confirmed'), typebox_1.Type.Literal('cancelled')]))
}), { $id: 'VirtualViewingRequestPatch', additionalProperties: false });
exports.virtualViewingRequestPatchValidator = (0, typebox_1.getValidator)(exports.virtualViewingRequestPatchSchema, validators_1.dataValidator);
exports.virtualViewingRequestPatchResolver = (0, schema_1.resolve)({});
exports.virtualViewingRequestQueryProperties = typebox_1.Type.Pick(exports.virtualViewingRequestSchema, ['_id', 'unitId', 'status', 'email']);
exports.virtualViewingRequestQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.virtualViewingRequestQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.virtualViewingRequestQueryValidator = (0, typebox_1.getValidator)(exports.virtualViewingRequestQuerySchema, validators_1.queryValidator);
exports.virtualViewingRequestQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=virtual-viewing-requests.schema.js.map