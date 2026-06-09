import { resolve } from '@feathersjs/schema'
import { Type, getValidator, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { resolveEntityFiles } from '../../utils/resolveEntityFiles'

/**
 * Important: `feathers-authentication-management` writes these fields onto the user record.
 * They must exist in the schema when `additionalProperties: false`.
 */
/** Related `user-roles` rows (virtual — not stored on the user document). */
export const userRoleRelationSchema = Type.Object(
  {
    _id: Type.Optional(Type.String()),
    userId: Type.String(),
    role: Type.Union([
      Type.Literal('tenant'),
      Type.Literal('landlord'),
      Type.Literal('property_manager'),
      Type.Literal('agent'),
      Type.Literal('admin')
    ]),
    createdAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'UserRoleRelation', additionalProperties: false }
)

const authManagementFields = {
  isVerified: Type.Optional(Type.Boolean({ default: false })),
  verifyToken: Type.Optional(Type.Any()),
  verifyShortToken: Type.Optional(Type.Any()),
  verifyExpires: Type.Optional(Type.Any()),
  verifyChanges: Type.Optional(Type.Any()),
  resetToken: Type.Optional(Type.Any()),
  resetShortToken: Type.Optional(Type.Any()),
  resetExpires: Type.Optional(Type.Any()),
  resetAttempts: Type.Optional(Type.Any())
}

// Core user model (MongoDB)
export const userSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    email: Type.String({ format: 'email' }),
    password: Type.Optional(Type.String()),
    fullName: Type.String(),
    avatarUrl: Type.Optional(Type.String()),
    phone: Type.Optional(Type.String()),
    nationalId: Type.Optional(Type.String()),
    defaultCurrency: Type.Optional(Type.String({ default: 'GHS' })),
    /** Set to true once the user completes the onboarding role-selection step. */
    isOnboarded: Type.Optional(Type.Boolean()),
    /** Arbitrary onboarding preferences stored per role (tenant prefs, landlord details, etc.) */
    onboarding: Type.Optional(Type.Object({}, { additionalProperties: true })),
    /** When false, in-app notifications are still created but notification emails are skipped. */
    emailNotifications: Type.Optional(Type.Boolean()),
    /** When false, transactional SMS notifications are skipped. */
    smsNotifications: Type.Optional(Type.Boolean()),
    files: Type.Optional(Type.Array(Type.Any())),
    /** Role names (virtual — from `user-roles`). */
    roles: Type.Optional(Type.Array(Type.String())),
    /** Related role rows (virtual — from `user-roles`). */
    userRoles: Type.Optional(Type.Array(userRoleRelationSchema)),
    ...authManagementFields,
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'User', additionalProperties: false }
)

export type User = Static<typeof userSchema>
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve<User, HookContext>({})

export const userExternalResolver = resolve<User, HookContext>({
  password: async () => undefined,
  files: async (_value, user, context) => {
    const id = (user as any)?._id?.toString?.() ?? ''
    if (!id) return []
    return await resolveEntityFiles(context.app, 'users', id)
  }
})

// Create
export const userDataSchema = Type.Object(
  {
    email: Type.String({ format: 'email' }),
    password: Type.String(),
    fullName: Type.String(),
    phone: Type.Optional(Type.String()),
    nationalId: Type.Optional(Type.String()),
    defaultCurrency: Type.Optional(Type.String()),
    /**
     * Optional. If set to landlord | agent | property_manager, `users` after-create hook
     * creates a pending `role-requests` row (role is not granted until approval).
     * Omitted or `tenant`: only the default tenant role is applied. See README "Roles".
     */
    requestedRole: Type.Optional(
      Type.Union([Type.Literal('tenant'), Type.Literal('landlord'), Type.Literal('property_manager'), Type.Literal('agent')])
    )
  },
  { $id: 'UserData', additionalProperties: false }
)

export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext>({
  password: passwordHash({ strategy: 'local' }),
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString(),
  // New accounts start as not-onboarded and unverified
  isOnboarded: async () => false,
  isVerified: async () => process.env.AUTO_VERIFY_USERS === 'true'
})

// Patch — omit virtual relation fields (roles live in `user-roles` only)
export const userPatchSchema = Type.Partial(
  Type.Omit(userSchema, ['_id', 'createdAt', 'roles', 'userRoles']),
  { $id: 'UserPatch' }
)

export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve<User, HookContext>({
  password: async (value, _user, context) => {
    if (!value || typeof value !== 'string') return value
    if (value.startsWith('$2')) return value
    const hashResolver = passwordHash({ strategy: 'local' })
    return await hashResolver(value, _user as any, context as any)
  },
  updatedAt: async () => new Date().toISOString()
})

// Query
export const userQuerySchema = Type.Object({}, { $id: 'UserQuery', additionalProperties: true })
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext>({})

