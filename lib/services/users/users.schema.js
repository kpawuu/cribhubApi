"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueryResolver = exports.userQueryValidator = exports.userQuerySchema = exports.userPatchResolver = exports.userPatchValidator = exports.userPatchSchema = exports.userDataResolver = exports.userDataValidator = exports.userDataSchema = exports.userExternalResolver = exports.userResolver = exports.userValidator = exports.userSchema = exports.userRoleRelationSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const authentication_local_1 = require("@feathersjs/authentication-local");
const validators_1 = require("../../validators");
const resolveEntityFiles_1 = require("../../utils/resolveEntityFiles");
/**
 * Important: `feathers-authentication-management` writes these fields onto the user record.
 * They must exist in the schema when `additionalProperties: false`.
 */
/** Related `user-roles` rows (virtual — not stored on the user document). */
exports.userRoleRelationSchema = typebox_1.Type.Object({
    _id: typebox_1.Type.Optional(typebox_1.Type.String()),
    userId: typebox_1.Type.String(),
    role: typebox_1.Type.Union([
        typebox_1.Type.Literal('tenant'),
        typebox_1.Type.Literal('landlord'),
        typebox_1.Type.Literal('property_manager'),
        typebox_1.Type.Literal('agent'),
        typebox_1.Type.Literal('admin')
    ]),
    createdAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'UserRoleRelation', additionalProperties: false });
const authManagementFields = {
    isVerified: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: false })),
    verifyToken: typebox_1.Type.Optional(typebox_1.Type.Any()),
    verifyShortToken: typebox_1.Type.Optional(typebox_1.Type.Any()),
    verifyExpires: typebox_1.Type.Optional(typebox_1.Type.Any()),
    verifyChanges: typebox_1.Type.Optional(typebox_1.Type.Any()),
    resetToken: typebox_1.Type.Optional(typebox_1.Type.Any()),
    resetShortToken: typebox_1.Type.Optional(typebox_1.Type.Any()),
    resetExpires: typebox_1.Type.Optional(typebox_1.Type.Any()),
    resetAttempts: typebox_1.Type.Optional(typebox_1.Type.Any())
};
// Core user model (MongoDB)
exports.userSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    email: typebox_1.Type.String({ format: 'email' }),
    password: typebox_1.Type.Optional(typebox_1.Type.String()),
    fullName: typebox_1.Type.String(),
    avatarUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    phone: typebox_1.Type.Optional(typebox_1.Type.String()),
    nationalId: typebox_1.Type.Optional(typebox_1.Type.String()),
    defaultCurrency: typebox_1.Type.Optional(typebox_1.Type.String({ default: 'GHS' })),
    /** Set to true once the user completes the onboarding role-selection step. */
    isOnboarded: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    /** Arbitrary onboarding preferences stored per role (tenant prefs, landlord details, etc.) */
    onboarding: typebox_1.Type.Optional(typebox_1.Type.Object({}, { additionalProperties: true })),
    /** When false, in-app notifications are still created but notification emails are skipped. */
    emailNotifications: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    files: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Any())),
    /** Role names (virtual — from `user-roles`). */
    roles: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    /** Related role rows (virtual — from `user-roles`). */
    userRoles: typebox_1.Type.Optional(typebox_1.Type.Array(exports.userRoleRelationSchema)),
    ...authManagementFields,
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'User', additionalProperties: false });
exports.userValidator = (0, typebox_1.getValidator)(exports.userSchema, validators_1.dataValidator);
exports.userResolver = (0, schema_1.resolve)({});
exports.userExternalResolver = (0, schema_1.resolve)({
    password: async () => undefined,
    files: async (_value, user, context) => {
        const id = user?._id?.toString?.() ?? '';
        if (!id)
            return [];
        return await (0, resolveEntityFiles_1.resolveEntityFiles)(context.app, 'users', id);
    }
});
// Create
exports.userDataSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String({ format: 'email' }),
    password: typebox_1.Type.String(),
    fullName: typebox_1.Type.String(),
    phone: typebox_1.Type.Optional(typebox_1.Type.String()),
    nationalId: typebox_1.Type.Optional(typebox_1.Type.String()),
    defaultCurrency: typebox_1.Type.Optional(typebox_1.Type.String()),
    // optional requested role on signup
    requestedRole: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('tenant'), typebox_1.Type.Literal('landlord'), typebox_1.Type.Literal('property_manager'), typebox_1.Type.Literal('agent')]))
}, { $id: 'UserData', additionalProperties: false });
exports.userDataValidator = (0, typebox_1.getValidator)(exports.userDataSchema, validators_1.dataValidator);
exports.userDataResolver = (0, schema_1.resolve)({
    password: (0, authentication_local_1.passwordHash)({ strategy: 'local' }),
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString(),
    // New accounts start as not-onboarded and unverified
    isOnboarded: async () => false,
    isVerified: async () => process.env.AUTO_VERIFY_USERS === 'true'
});
// Patch — omit virtual relation fields (roles live in `user-roles` only)
exports.userPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.userSchema, ['_id', 'createdAt', 'roles', 'userRoles']), { $id: 'UserPatch' });
exports.userPatchValidator = (0, typebox_1.getValidator)(exports.userPatchSchema, validators_1.dataValidator);
exports.userPatchResolver = (0, schema_1.resolve)({
    password: async (value, _user, context) => {
        if (!value || typeof value !== 'string')
            return value;
        if (value.startsWith('$2'))
            return value;
        const hashResolver = (0, authentication_local_1.passwordHash)({ strategy: 'local' });
        return await hashResolver(value, _user, context);
    },
    updatedAt: async () => new Date().toISOString()
});
// Query
exports.userQuerySchema = typebox_1.Type.Object({}, { $id: 'UserQuery', additionalProperties: true });
exports.userQueryValidator = (0, typebox_1.getValidator)(exports.userQuerySchema, validators_1.queryValidator);
exports.userQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=users.schema.js.map