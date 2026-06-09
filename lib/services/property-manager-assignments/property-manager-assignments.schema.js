"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyManagerAssignmentQueryResolver = exports.propertyManagerAssignmentQueryValidator = exports.propertyManagerAssignmentQuerySchema = exports.propertyManagerAssignmentQueryProperties = exports.propertyManagerAssignmentPatchResolver = exports.propertyManagerAssignmentPatchValidator = exports.propertyManagerAssignmentPatchSchema = exports.propertyManagerAssignmentDataResolver = exports.propertyManagerAssignmentDataValidator = exports.propertyManagerAssignmentDataSchema = exports.propertyManagerAssignmentExternalResolver = exports.propertyManagerAssignmentResolver = exports.propertyManagerAssignmentValidator = exports.propertyManagerAssignmentSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const errors_1 = require("@feathersjs/errors");
const validators_1 = require("../../validators");
const fee_proposal_shared_1 = require("../fee-proposal-shared");
exports.propertyManagerAssignmentSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    propertyId: typebox_1.Type.String(),
    managerUserId: typebox_1.Type.String(),
    landlordId: typebox_1.Type.String(),
    assignedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    /** Mirrored from the listing-request `acceptedTerms` (or set by admin on direct assignment). */
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    sourceRequestId: typebox_1.Type.Optional(typebox_1.Type.String()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    /** Virtual: full property manager profile (loaded on demand via ?include=manager). */
    manager: typebox_1.Type.Optional(typebox_1.Type.Any())
}, { $id: 'PropertyManagerAssignment', additionalProperties: false });
exports.propertyManagerAssignmentValidator = (0, typebox_1.getValidator)(exports.propertyManagerAssignmentSchema, validators_1.dataValidator);
exports.propertyManagerAssignmentResolver = (0, schema_1.resolve)({});
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
exports.propertyManagerAssignmentExternalResolver = (0, schema_1.resolve)({
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
    })
});
exports.propertyManagerAssignmentDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String(),
    managerUserId: typebox_1.Type.String(),
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema),
    sourceRequestId: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'PropertyManagerAssignmentData', additionalProperties: false });
exports.propertyManagerAssignmentDataValidator = (0, typebox_1.getValidator)(exports.propertyManagerAssignmentDataSchema, validators_1.dataValidator);
exports.propertyManagerAssignmentDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString(),
    landlordId: async (_v, data, context) => {
        const pid = data?.propertyId;
        if (!pid)
            throw new errors_1.errors.BadRequest('propertyId is required');
        const prop = await context.app.service('properties').get(String(pid), { provider: undefined });
        return String(prop.landlordId || '');
    },
    assignedBy: async (_v, _d, context) => context.params.user?._id?.toString?.()
});
exports.propertyManagerAssignmentPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Object({
    acceptedTerms: typebox_1.Type.Optional(fee_proposal_shared_1.feeProposalSchema)
}), { $id: 'PropertyManagerAssignmentPatch', additionalProperties: false });
exports.propertyManagerAssignmentPatchValidator = (0, typebox_1.getValidator)(exports.propertyManagerAssignmentPatchSchema, validators_1.dataValidator);
exports.propertyManagerAssignmentPatchResolver = (0, schema_1.resolve)({});
exports.propertyManagerAssignmentQueryProperties = typebox_1.Type.Pick(exports.propertyManagerAssignmentSchema, [
    '_id',
    'propertyId',
    'managerUserId',
    'landlordId',
    'createdAt'
]);
exports.propertyManagerAssignmentQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.propertyManagerAssignmentQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.propertyManagerAssignmentQueryValidator = (0, typebox_1.getValidator)(exports.propertyManagerAssignmentQuerySchema, validators_1.queryValidator);
exports.propertyManagerAssignmentQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=property-manager-assignments.schema.js.map