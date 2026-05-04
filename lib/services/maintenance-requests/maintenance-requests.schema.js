"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceRequestQueryResolver = exports.maintenanceRequestQueryValidator = exports.maintenanceRequestQuerySchema = exports.maintenanceRequestQueryProperties = exports.maintenanceRequestPatchResolver = exports.maintenanceRequestPatchValidator = exports.maintenanceRequestPatchSchema = exports.maintenanceRequestDataResolver = exports.maintenanceRequestDataValidator = exports.maintenanceRequestDataSchema = exports.maintenanceRequestExternalResolver = exports.maintenanceRequestResolver = exports.maintenanceRequestValidator = exports.maintenanceRequestSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.maintenanceRequestSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    unitId: typebox_1.Type.String(),
    tenantId: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    description: typebox_1.Type.String(),
    category: typebox_1.Type.String(),
    priority: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('low'), typebox_1.Type.Literal('medium'), typebox_1.Type.Literal('high'), typebox_1.Type.Literal('urgent')])),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('pending'), typebox_1.Type.Literal('in_progress'), typebox_1.Type.Literal('completed')])),
    images: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    assignedTo: typebox_1.Type.Optional(typebox_1.Type.String()),
    estimatedCompletion: typebox_1.Type.Optional(typebox_1.Type.String()),
    completedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'MaintenanceRequest', additionalProperties: false });
exports.maintenanceRequestValidator = (0, typebox_1.getValidator)(exports.maintenanceRequestSchema, validators_1.dataValidator);
exports.maintenanceRequestResolver = (0, schema_1.resolve)({});
exports.maintenanceRequestExternalResolver = (0, schema_1.resolve)({});
exports.maintenanceRequestDataSchema = typebox_1.Type.Object({
    unitId: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    description: typebox_1.Type.String(),
    category: typebox_1.Type.String(),
    priority: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('low'), typebox_1.Type.Literal('medium'), typebox_1.Type.Literal('high'), typebox_1.Type.Literal('urgent')])),
    images: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String()))
}, { $id: 'MaintenanceRequestData', additionalProperties: false });
exports.maintenanceRequestDataValidator = (0, typebox_1.getValidator)(exports.maintenanceRequestDataSchema, validators_1.dataValidator);
exports.maintenanceRequestDataResolver = (0, schema_1.resolve)({
    status: async () => 'pending',
    priority: async (v) => v ?? 'medium',
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.maintenanceRequestPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Object({
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('pending'), typebox_1.Type.Literal('in_progress'), typebox_1.Type.Literal('completed')])),
    assignedTo: typebox_1.Type.Optional(typebox_1.Type.String()),
    estimatedCompletion: typebox_1.Type.Optional(typebox_1.Type.String()),
    completedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}), { $id: 'MaintenanceRequestPatch', additionalProperties: false });
exports.maintenanceRequestPatchValidator = (0, typebox_1.getValidator)(exports.maintenanceRequestPatchSchema, validators_1.dataValidator);
exports.maintenanceRequestPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.maintenanceRequestQueryProperties = typebox_1.Type.Pick(exports.maintenanceRequestSchema, [
    '_id',
    'unitId',
    'tenantId',
    'status',
    'priority',
    'createdAt',
    'updatedAt'
]);
exports.maintenanceRequestQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.maintenanceRequestQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.maintenanceRequestQueryValidator = (0, typebox_1.getValidator)(exports.maintenanceRequestQuerySchema, validators_1.queryValidator);
exports.maintenanceRequestQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=maintenance-requests.schema.js.map