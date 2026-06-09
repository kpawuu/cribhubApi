"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveLegacyCommissionPercent = exports.propertyManagerListingRequestQueryResolver = exports.propertyManagerListingRequestQueryValidator = exports.propertyManagerListingRequestQuerySchema = exports.propertyManagerListingRequestQueryProperties = exports.propertyManagerListingRequestPatchResolver = exports.propertyManagerListingRequestPatchValidator = exports.propertyManagerListingRequestPatchSchema = exports.propertyManagerListingRequestDataResolver = exports.propertyManagerListingRequestDataValidator = exports.propertyManagerListingRequestDataSchema = exports.propertyManagerListingRequestExternalResolver = exports.propertyManagerListingRequestResolver = exports.propertyManagerListingRequestValidator = exports.propertyManagerListingRequestSchema = exports.pmListingRequestStatusSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const errors_1 = require("@feathersjs/errors");
const validators_1 = require("../../validators");
const fee_proposal_shared_1 = require("../fee-proposal-shared");
Object.defineProperty(exports, "deriveLegacyCommissionPercent", { enumerable: true, get: function () { return fee_proposal_shared_1.deriveLegacyCommissionPercent; } });
exports.pmListingRequestStatusSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('pending'),
    typebox_1.Type.Literal('countered'),
    typebox_1.Type.Literal('accepted'),
    typebox_1.Type.Literal('rejected'),
    typebox_1.Type.Literal('withdrawn')
]);
exports.propertyManagerListingRequestSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    propertyId: typebox_1.Type.String(),
    managerUserId: typebox_1.Type.String(),
    landlordId: typebox_1.Type.String(),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    status: exports.pmListingRequestStatusSchema,
    /** Initial fee proposal from the PM. */
    proposal: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    /** Landlord counter-offer (present when status = 'countered'). */
    counter: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    /** Final agreed terms (set when status moves to 'accepted'). */
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    reviewedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    /** Virtual: full property manager profile (loaded on demand via ?include=manager). */
    manager: typebox_1.Type.Optional(typebox_1.Type.Any()),
    /** Virtual: property snapshot. */
    property: typebox_1.Type.Optional(typebox_1.Type.Any()),
    /** Virtual: lightweight thread between landlord & manager, when one exists. */
    thread: typebox_1.Type.Optional(typebox_1.Type.Any())
}, { $id: 'PropertyManagerListingRequest', additionalProperties: false });
exports.propertyManagerListingRequestValidator = (0, typebox_1.getValidator)(exports.propertyManagerListingRequestSchema, validators_1.dataValidator);
exports.propertyManagerListingRequestResolver = (0, schema_1.resolve)({});
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
exports.propertyManagerListingRequestExternalResolver = (0, schema_1.resolve)({
    manager: (0, schema_1.virtual)(async (row, context) => {
        if (!(await shouldInclude(context, 'manager')))
            return undefined;
        const uid = String(row.managerUserId || '');
        if (!uid)
            return undefined;
        try {
            const res = (await context.app.service('property-manager-profiles').find({
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
        const pid = String(row.propertyId || '');
        if (!pid)
            return undefined;
        try {
            return await context.app.service('properties').get(pid, { provider: undefined });
        }
        catch {
            return null;
        }
    }),
    thread: (0, schema_1.virtual)(async (row, context) => {
        if (!(await shouldInclude(context, 'thread')))
            return undefined;
        const db = await context.app.get('mongodbClient');
        const t = await db.collection('threads').findOne({
            kind: 'landlord-pm',
            propertyId: String(row.propertyId || ''),
            participantIds: { $all: [String(row.landlordId || ''), String(row.managerUserId || '')] }
        });
        return t || null;
    })
});
exports.propertyManagerListingRequestDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String(),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    /** Initial fee proposal from the PM. */
    proposal: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    /** Admin-only: create on behalf of this manager user. */
    managerUserId: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'PropertyManagerListingRequestData', additionalProperties: false });
exports.propertyManagerListingRequestDataValidator = (0, typebox_1.getValidator)(exports.propertyManagerListingRequestDataSchema, validators_1.dataValidator);
exports.propertyManagerListingRequestDataResolver = (0, schema_1.resolve)({
    status: async () => 'pending',
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString(),
    managerUserId: async (_value, data, context) => {
        const roles = Array.isArray(context.params.user?.roles)
            ? context.params.user.roles
            : [];
        const adminOverride = data?.managerUserId;
        if (roles.includes('admin')) {
            if (typeof adminOverride === 'string' && adminOverride.trim())
                return adminOverride.trim();
            throw new errors_1.errors.BadRequest('Admins must pass managerUserId when creating a listing request.');
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
    proposal: async (value, _d, context) => {
        if (!value)
            return undefined;
        const v = value;
        const uid = context.params.user?._id?.toString?.();
        return { ...v, proposedByUserId: v.proposedByUserId || uid, at: v.at || new Date().toISOString() };
    }
});
exports.propertyManagerListingRequestPatchSchema = typebox_1.Type.Object({
    status: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal('countered'),
        typebox_1.Type.Literal('accepted'),
        typebox_1.Type.Literal('rejected'),
        typebox_1.Type.Literal('withdrawn')
    ])),
    counter: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    proposal: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    reviewedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'PropertyManagerListingRequestPatch', additionalProperties: false });
exports.propertyManagerListingRequestPatchValidator = (0, typebox_1.getValidator)(exports.propertyManagerListingRequestPatchSchema, validators_1.dataValidator);
exports.propertyManagerListingRequestPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.propertyManagerListingRequestQueryProperties = typebox_1.Type.Pick(exports.propertyManagerListingRequestSchema, [
    '_id',
    'propertyId',
    'managerUserId',
    'landlordId',
    'status',
    'createdAt',
    'updatedAt'
]);
exports.propertyManagerListingRequestQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.propertyManagerListingRequestQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.propertyManagerListingRequestQueryValidator = (0, typebox_1.getValidator)(exports.propertyManagerListingRequestQuerySchema, validators_1.queryValidator);
exports.propertyManagerListingRequestQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=property-manager-listing-requests.schema.js.map