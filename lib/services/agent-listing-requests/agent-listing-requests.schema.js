"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentListingRequestQueryResolver = exports.agentListingRequestQueryValidator = exports.agentListingRequestQuerySchema = exports.agentListingRequestQueryProperties = exports.agentListingRequestPatchResolver = exports.agentListingRequestPatchValidator = exports.agentListingRequestPatchSchema = exports.agentListingRequestDataResolver = exports.agentListingRequestDataValidator = exports.agentListingRequestDataSchema = exports.agentListingRequestExternalResolver = exports.agentListingRequestResolver = exports.agentListingRequestValidator = exports.agentListingRequestSchema = exports.agentListingRequestStatusSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const errors_1 = require("@feathersjs/errors");
const validators_1 = require("../../validators");
exports.agentListingRequestStatusSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('pending'),
    typebox_1.Type.Literal('accepted'),
    typebox_1.Type.Literal('rejected'),
    typebox_1.Type.Literal('withdrawn')
]);
exports.agentListingRequestSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    propertyId: typebox_1.Type.String(),
    agentUserId: typebox_1.Type.String(),
    landlordId: typebox_1.Type.String(),
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
    status: exports.agentListingRequestStatusSchema,
    reviewedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'AgentListingRequest', additionalProperties: false });
exports.agentListingRequestValidator = (0, typebox_1.getValidator)(exports.agentListingRequestSchema, validators_1.dataValidator);
exports.agentListingRequestResolver = (0, schema_1.resolve)({});
exports.agentListingRequestExternalResolver = (0, schema_1.resolve)({});
/** External create: agent proposes representation on a listing. */
exports.agentListingRequestDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String(),
    commissionPercent: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
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
    }
});
exports.agentListingRequestPatchSchema = typebox_1.Type.Object({
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('accepted'), typebox_1.Type.Literal('rejected'), typebox_1.Type.Literal('withdrawn')])),
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