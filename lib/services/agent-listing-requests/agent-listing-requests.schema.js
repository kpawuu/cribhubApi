"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveLegacyCommissionPercent = exports.agentListingRequestQueryResolver = exports.agentListingRequestQueryValidator = exports.agentListingRequestQuerySchema = exports.agentListingRequestQueryProperties = exports.agentListingRequestPatchResolver = exports.agentListingRequestPatchValidator = exports.agentListingRequestPatchSchema = exports.agentListingRequestDataResolver = exports.agentListingRequestDataValidator = exports.agentListingRequestDataSchema = exports.agentListingRequestExternalResolver = exports.agentListingRequestResolver = exports.agentListingRequestValidator = exports.agentListingRequestSchema = exports.agentListingRequestStatusSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const errors_1 = require("@feathersjs/errors");
const validators_1 = require("../../validators");
const fee_proposal_shared_1 = require("../fee-proposal-shared");
Object.defineProperty(exports, "deriveLegacyCommissionPercent", { enumerable: true, get: function () { return fee_proposal_shared_1.deriveLegacyCommissionPercent; } });
exports.agentListingRequestStatusSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('pending'),
    typebox_1.Type.Literal('countered'),
    typebox_1.Type.Literal('accepted'),
    typebox_1.Type.Literal('rejected'),
    typebox_1.Type.Literal('withdrawn')
]);
exports.agentListingRequestSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    propertyId: typebox_1.Type.String(),
    agentUserId: typebox_1.Type.String(),
    landlordId: typebox_1.Type.String(),
    /** Legacy single-percent field. Mirrored from `proposal.rent.value` when type is percent. */
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    status: exports.agentListingRequestStatusSchema,
    /** Initial fee proposal from the agent. */
    proposal: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    /** Landlord counter-offer (present when status = 'countered'). */
    counter: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    /** Final agreed terms (set when status moves to 'accepted'). */
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    reviewedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    /** Virtual: full agent profile (loaded via ?include=agent). */
    agent: typebox_1.Type.Optional(typebox_1.Type.Any()),
    property: typebox_1.Type.Optional(typebox_1.Type.Any()),
    thread: typebox_1.Type.Optional(typebox_1.Type.Any())
}, { $id: 'AgentListingRequest', additionalProperties: false });
exports.agentListingRequestValidator = (0, typebox_1.getValidator)(exports.agentListingRequestSchema, validators_1.dataValidator);
exports.agentListingRequestResolver = (0, schema_1.resolve)({});
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
exports.agentListingRequestExternalResolver = (0, schema_1.resolve)({
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
    }),
    property: (0, schema_1.virtual)(async (row, context) => {
        if (!(await shouldInclude(context, 'property')))
            return undefined;
        try {
            return await context.app.service('properties').get(String(row.propertyId), { provider: undefined });
        }
        catch {
            return null;
        }
    }),
    thread: (0, schema_1.virtual)(async (row, context) => {
        if (!(await shouldInclude(context, 'thread')))
            return undefined;
        const db = await context.app.get('mongodbClient');
        return await db.collection('threads').findOne({
            kind: 'landlord-agent',
            propertyId: String(row.propertyId || ''),
            participantIds: { $all: [String(row.landlordId || ''), String(row.agentUserId || '')] }
        });
    })
});
/** External create: agent proposes representation on a listing. */
exports.agentListingRequestDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String(),
    /** Optional legacy short-hand; if `proposal.rent` is provided it takes precedence. */
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    proposal: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    /** Admin-only: create a request on behalf of this agent user. */
    agentUserId: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'AgentListingRequestData', additionalProperties: false });
exports.agentListingRequestDataValidator = (0, typebox_1.getValidator)(exports.agentListingRequestDataSchema, validators_1.dataValidator);
exports.agentListingRequestDataResolver = (0, schema_1.resolve)({
    status: async () => 'pending',
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString(),
    agentUserId: async (_value, data, context) => {
        const roles = Array.isArray(context.params.user?.roles)
            ? context.params.user.roles
            : [];
        const adminOverride = data?.agentUserId;
        if (roles.includes('admin')) {
            if (typeof adminOverride === 'string' && adminOverride.trim())
                return adminOverride.trim();
            throw new errors_1.errors.BadRequest('Admins must pass agentUserId when creating a listing request.');
        }
        const uid = context.params.user?._id?.toString?.();
        if (!uid)
            throw new errors_1.errors.BadRequest('Missing user');
        return uid;
    },
    landlordId: async (_value, data, context) => {
        const pid = data?.propertyId;
        if (!pid)
            throw new errors_1.errors.BadRequest('Missing propertyId');
        try {
            const prop = await context.app.service('properties').get(String(pid), { provider: undefined });
            const lid = prop?.landlordId;
            if (!lid)
                throw new errors_1.errors.BadRequest('Property has no landlord');
            return String(lid);
        }
        catch (e) {
            if (e?.className === 'not-found')
                throw new errors_1.errors.BadRequest('Property not found');
            throw e;
        }
    },
    proposal: async (value, data, context) => {
        const uid = context.params.user?._id?.toString?.();
        // Build a default proposal from commissionPercent for backward compat.
        if (!value && typeof data?.commissionPercent === 'number') {
            return {
                rent: { type: 'percent', value: Number(data.commissionPercent) },
                proposedByUserId: uid,
                at: new Date().toISOString()
            };
        }
        if (!value)
            return undefined;
        const v = value;
        return { ...v, proposedByUserId: v.proposedByUserId || uid, at: v.at || new Date().toISOString() };
    },
    commissionPercent: async (value, _d, _ctx) => value
});
exports.agentListingRequestPatchSchema = typebox_1.Type.Object({
    status: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal('countered'),
        typebox_1.Type.Literal('accepted'),
        typebox_1.Type.Literal('rejected'),
        typebox_1.Type.Literal('withdrawn')
    ])),
    counter: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    proposal: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    /** Mirrored from `acceptedTerms.rent.value` when type is `percent`; kept in sync by `restrictPatch`. */
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    reviewedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'AgentListingRequestPatch', additionalProperties: false });
exports.agentListingRequestPatchValidator = (0, typebox_1.getValidator)(exports.agentListingRequestPatchSchema, validators_1.dataValidator);
exports.agentListingRequestPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.agentListingRequestQueryProperties = typebox_1.Type.Pick(exports.agentListingRequestSchema, [
    '_id',
    'propertyId',
    'agentUserId',
    'landlordId',
    'status',
    'createdAt',
    'updatedAt'
]);
exports.agentListingRequestQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.agentListingRequestQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.agentListingRequestQueryValidator = (0, typebox_1.getValidator)(exports.agentListingRequestQuerySchema, validators_1.queryValidator);
exports.agentListingRequestQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=agent-listing-requests.schema.js.map