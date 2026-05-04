"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRequestQueryResolver = exports.roleRequestQueryValidator = exports.roleRequestQuerySchema = exports.roleRequestPatchResolver = exports.roleRequestPatchValidator = exports.roleRequestPatchSchema = exports.roleRequestDataResolver = exports.roleRequestDataValidator = exports.roleRequestDataSchema = exports.roleRequestExternalResolver = exports.roleRequestResolver = exports.roleRequestValidator = exports.roleRequestSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.roleRequestSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    userId: typebox_1.Type.String(),
    role: typebox_1.Type.Union([typebox_1.Type.Literal('landlord'), typebox_1.Type.Literal('property_manager'), typebox_1.Type.Literal('agent')]),
    status: typebox_1.Type.Union([typebox_1.Type.Literal('pending'), typebox_1.Type.Literal('approved'), typebox_1.Type.Literal('rejected')]),
    notes: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createdAt: typebox_1.Type.String({ format: 'date-time' })
}, { $id: 'RoleRequest', additionalProperties: false });
exports.roleRequestValidator = (0, typebox_1.getValidator)(exports.roleRequestSchema, validators_1.dataValidator);
exports.roleRequestResolver = (0, schema_1.resolve)({});
exports.roleRequestExternalResolver = (0, schema_1.resolve)({});
exports.roleRequestDataSchema = typebox_1.Type.Object({
    userId: typebox_1.Type.String(),
    role: typebox_1.Type.Union([typebox_1.Type.Literal('landlord'), typebox_1.Type.Literal('property_manager'), typebox_1.Type.Literal('agent')]),
    status: typebox_1.Type.Optional(typebox_1.Type.Literal('pending'))
}, { $id: 'RoleRequestData', additionalProperties: false });
exports.roleRequestDataValidator = (0, typebox_1.getValidator)(exports.roleRequestDataSchema, validators_1.dataValidator);
exports.roleRequestDataResolver = (0, schema_1.resolve)({
    status: async () => 'pending',
    createdAt: async () => new Date().toISOString()
});
exports.roleRequestPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.roleRequestSchema, ['_id', 'userId', 'role', 'createdAt']), {
    $id: 'RoleRequestPatch'
});
exports.roleRequestPatchValidator = (0, typebox_1.getValidator)(exports.roleRequestPatchSchema, validators_1.dataValidator);
exports.roleRequestPatchResolver = (0, schema_1.resolve)({
    reviewedAt: async (_v, _r, context) => context.data?.status ? new Date().toISOString() : undefined
});
exports.roleRequestQuerySchema = typebox_1.Type.Object({}, { $id: 'RoleRequestQuery', additionalProperties: true });
exports.roleRequestQueryValidator = (0, typebox_1.getValidator)(exports.roleRequestQuerySchema, validators_1.queryValidator);
exports.roleRequestQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=role-requests.schema.js.map