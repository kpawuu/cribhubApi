"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communicationQueryResolver = exports.communicationQueryValidator = exports.communicationQuerySchema = exports.communicationQueryProperties = exports.communicationPatchResolver = exports.communicationPatchValidator = exports.communicationPatchSchema = exports.communicationDataResolver = exports.communicationDataValidator = exports.communicationDataSchema = exports.communicationExternalResolver = exports.communicationResolver = exports.communicationValidator = exports.communicationSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.communicationSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    landlordId: typebox_1.Type.String(),
    type: typebox_1.Type.Optional(typebox_1.Type.String()),
    fromName: typebox_1.Type.String(),
    property: typebox_1.Type.String(),
    message: typebox_1.Type.String(),
    isRead: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    isManualEntry: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'Communication', additionalProperties: false });
exports.communicationValidator = (0, typebox_1.getValidator)(exports.communicationSchema, validators_1.dataValidator);
exports.communicationResolver = (0, schema_1.resolve)({});
exports.communicationExternalResolver = (0, schema_1.resolve)({});
exports.communicationDataSchema = typebox_1.Type.Object({
    /** Required for `property_manager` when posting on behalf of a landlord. */
    landlordId: typebox_1.Type.Optional(typebox_1.Type.String()),
    type: typebox_1.Type.Optional(typebox_1.Type.String()),
    fromName: typebox_1.Type.String(),
    property: typebox_1.Type.String(),
    message: typebox_1.Type.String(),
    isManualEntry: typebox_1.Type.Optional(typebox_1.Type.Boolean())
}, { $id: 'CommunicationData', additionalProperties: false });
exports.communicationDataValidator = (0, typebox_1.getValidator)(exports.communicationDataSchema, validators_1.dataValidator);
exports.communicationDataResolver = (0, schema_1.resolve)({
    isRead: async () => false,
    isManualEntry: async (v) => v ?? false,
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.communicationPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.communicationSchema, ['_id', 'landlordId', 'createdAt']), {
    $id: 'CommunicationPatch'
});
exports.communicationPatchValidator = (0, typebox_1.getValidator)(exports.communicationPatchSchema, validators_1.dataValidator);
exports.communicationPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.communicationQueryProperties = typebox_1.Type.Pick(exports.communicationSchema, [
    '_id',
    'landlordId',
    'isRead',
    'type',
    'createdAt',
    'updatedAt'
]);
exports.communicationQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.communicationQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.communicationQueryValidator = (0, typebox_1.getValidator)(exports.communicationQuerySchema, validators_1.queryValidator);
exports.communicationQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=communications.schema.js.map