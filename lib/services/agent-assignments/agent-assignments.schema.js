"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentAssignmentQueryResolver = exports.agentAssignmentQueryValidator = exports.agentAssignmentQuerySchema = exports.agentAssignmentQueryProperties = exports.agentAssignmentPatchResolver = exports.agentAssignmentPatchValidator = exports.agentAssignmentPatchSchema = exports.agentAssignmentDataResolver = exports.agentAssignmentDataValidator = exports.agentAssignmentDataSchema = exports.agentAssignmentExternalResolver = exports.agentAssignmentResolver = exports.agentAssignmentValidator = exports.agentAssignmentSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.agentAssignmentSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    propertyId: typebox_1.Type.String(),
    agentUserId: typebox_1.Type.String(),
    assignedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    createdAt: typebox_1.Type.String({ format: 'date-time' })
}, { $id: 'AgentAssignment', additionalProperties: false });
exports.agentAssignmentValidator = (0, typebox_1.getValidator)(exports.agentAssignmentSchema, validators_1.dataValidator);
exports.agentAssignmentResolver = (0, schema_1.resolve)({});
exports.agentAssignmentExternalResolver = (0, schema_1.resolve)({});
exports.agentAssignmentDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String(),
    agentUserId: typebox_1.Type.String(),
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 }))
}, { $id: 'AgentAssignmentData', additionalProperties: false });
exports.agentAssignmentDataValidator = (0, typebox_1.getValidator)(exports.agentAssignmentDataSchema, validators_1.dataValidator);
exports.agentAssignmentDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString()
});
exports.agentAssignmentPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.agentAssignmentSchema, ['_id', 'createdAt']), {
    $id: 'AgentAssignmentPatch'
});
exports.agentAssignmentPatchValidator = (0, typebox_1.getValidator)(exports.agentAssignmentPatchSchema, validators_1.dataValidator);
exports.agentAssignmentPatchResolver = (0, schema_1.resolve)({});
exports.agentAssignmentQueryProperties = typebox_1.Type.Pick(exports.agentAssignmentSchema, [
    '_id',
    'propertyId',
    'agentUserId',
    'commissionPercent',
    'createdAt'
]);
exports.agentAssignmentQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.agentAssignmentQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.agentAssignmentQueryValidator = (0, typebox_1.getValidator)(exports.agentAssignmentQuerySchema, validators_1.queryValidator);
exports.agentAssignmentQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=agent-assignments.schema.js.map