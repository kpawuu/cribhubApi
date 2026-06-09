"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentAssignmentQueryResolver = exports.agentAssignmentQueryValidator = exports.agentAssignmentQuerySchema = exports.agentAssignmentQueryProperties = exports.agentAssignmentPatchResolver = exports.agentAssignmentPatchValidator = exports.agentAssignmentPatchSchema = exports.agentAssignmentDataResolver = exports.agentAssignmentDataValidator = exports.agentAssignmentDataSchema = exports.agentAssignmentExternalResolver = exports.agentAssignmentResolver = exports.agentAssignmentValidator = exports.agentAssignmentSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
const fee_proposal_shared_1 = require("../fee-proposal-shared");
exports.agentAssignmentSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    propertyId: typebox_1.Type.String(),
    agentUserId: typebox_1.Type.String(),
    assignedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    /** Final agreed fee terms (copied from the source listing request's acceptedTerms). */
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    sourceRequestId: typebox_1.Type.Optional(typebox_1.Type.String()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    /** Virtual: full agent profile (loaded on demand via ?include=agent). */
    agent: typebox_1.Type.Optional(typebox_1.Type.Any())
}, { $id: 'AgentAssignment', additionalProperties: false });
exports.agentAssignmentValidator = (0, typebox_1.getValidator)(exports.agentAssignmentSchema, validators_1.dataValidator);
exports.agentAssignmentResolver = (0, schema_1.resolve)({});
async function shouldInclude(context, key) {
    const inc = context.params?.$include ?? context.params?.query?.$include;
    if (!inc)
        return false;
    if (typeof inc === 'string')
        return inc.split(',').map((s) => s.trim()).includes(key);
    if (Array.isArray(inc))
        return inc.includes(key);
    return false;
}
exports.agentAssignmentExternalResolver = (0, schema_1.resolve)({
    agent: (0, schema_1.virtual)(async (row, context) => {
        if (!(await shouldInclude(context, 'agent')))
            return undefined;
        const uid = String(row.agentUserId || '');
        if (!uid)
            return undefined;
        try {
            const res = (await context.app.service('agent-profiles').find({
                query: { userId: uid, $limit: 1 },
                paginate: false,
                provider: undefined
            }));
            const arr = Array.isArray(res) ? res : res?.data || [];
            return arr[0] || null;
        }
        catch {
            return null;
        }
    })
});
exports.agentAssignmentDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String(),
    agentUserId: typebox_1.Type.String(),
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    sourceRequestId: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'AgentAssignmentData', additionalProperties: false });
exports.agentAssignmentDataValidator = (0, typebox_1.getValidator)(exports.agentAssignmentDataSchema, validators_1.dataValidator);
exports.agentAssignmentDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString(),
    // Keep legacy commissionPercent in sync with acceptedTerms.rent (percent type).
    commissionPercent: async (value, data) => {
        if (typeof value === 'number')
            return value;
        const cp = (0, fee_proposal_shared_1.deriveLegacyCommissionPercent)(data?.acceptedTerms);
        return typeof cp === 'number' ? cp : undefined;
    },
    // If old client supplied only commissionPercent, synthesize acceptedTerms so new
    // UI (payouts, fee summary, etc.) renders consistently.
    acceptedTerms: async (value, data) => {
        if (value && typeof value === 'object')
            return value;
        const cp = data?.commissionPercent;
        if (typeof cp !== 'number')
            return undefined;
        return { rent: { type: 'percent', value: cp } };
    }
});
exports.agentAssignmentPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Object({
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema)
}), { $id: 'AgentAssignmentPatch' });
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