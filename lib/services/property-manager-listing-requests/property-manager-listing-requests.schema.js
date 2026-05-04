"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyManagerListingRequestQueryResolver = exports.propertyManagerListingRequestQueryValidator = exports.propertyManagerListingRequestQuerySchema = exports.propertyManagerListingRequestQueryProperties = exports.propertyManagerListingRequestPatchResolver = exports.propertyManagerListingRequestPatchValidator = exports.propertyManagerListingRequestPatchSchema = exports.propertyManagerListingRequestDataResolver = exports.propertyManagerListingRequestDataValidator = exports.propertyManagerListingRequestDataSchema = exports.propertyManagerListingRequestExternalResolver = exports.propertyManagerListingRequestResolver = exports.propertyManagerListingRequestValidator = exports.propertyManagerListingRequestSchema = exports.pmListingRequestStatusSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const errors_1 = require("@feathersjs/errors");
const validators_1 = require("../../validators");
exports.pmListingRequestStatusSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('pending'),
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
    reviewedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'PropertyManagerListingRequest', additionalProperties: false });
exports.propertyManagerListingRequestValidator = (0, typebox_1.getValidator)(exports.propertyManagerListingRequestSchema, validators_1.dataValidator);
exports.propertyManagerListingRequestResolver = (0, schema_1.resolve)({});
exports.propertyManagerListingRequestExternalResolver = (0, schema_1.resolve)({});
exports.propertyManagerListingRequestDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String(),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 4000 })),
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
    }
});
exports.propertyManagerListingRequestPatchSchema = typebox_1.Type.Object({
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('accepted'), typebox_1.Type.Literal('rejected'), typebox_1.Type.Literal('withdrawn')])),
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