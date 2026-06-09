import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { resolveEntityFiles } from '../../utils/resolveEntityFiles'

/**
 * Structured default fee preferences ("rate card") shown on the public PM
 * profile and used as the starting point for fee proposals on listing requests.
 *
 * `type` semantics:
 *  - 'percent'      → percent of monthly rent (recurring) OR sale price (one-time)
 *  - 'fixed'        → flat monetary amount in `currency`
 *  - 'months_rent'  → multiple of one month's rent (rent only)
 *  - 'percent_rent_collected' → percent of rent each cycle, PM-flavour
 */
export const feeUnitSchema = Type.Object(
  {
    type: Type.Union([
      Type.Literal('percent'),
      Type.Literal('fixed'),
      Type.Literal('months_rent'),
      Type.Literal('percent_rent_collected')
    ]),
    value: Type.Number({ minimum: 0 }),
    currency: Type.Optional(Type.String({ maxLength: 6 })),
    notes: Type.Optional(Type.String({ maxLength: 400 }))
  },
  // No `$id` — this is a nested type referenced from multiple schemas
  // (PM profile + agent profile). Giving it a $id causes AJV to register
  // it twice and fail validator compilation on app boot.
  { additionalProperties: false }
)

export const defaultFeeSchema = Type.Object(
  {
    rent: Type.Optional(feeUnitSchema),
    sale: Type.Optional(feeUnitSchema),
    notes: Type.Optional(Type.String({ maxLength: 1000 }))
  },
  // No `$id` for the same reason as feeUnitSchema above.
  { additionalProperties: false }
)

export const propertyManagerProfileSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: Type.String(),
    displayName: Type.String(),
    companyName: Type.Optional(Type.String()),
    registrationId: Type.Optional(Type.String()),
    taxId: Type.Optional(Type.String()),
    phone: Type.Optional(Type.String()),
    whatsapp: Type.Optional(Type.String()),
    emailPublic: Type.Optional(Type.String({ format: 'email' })),
    websiteUrl: Type.Optional(Type.String()),
    bio: Type.Optional(Type.String()),
    services: Type.Optional(Type.Array(Type.String())),
    regions: Type.Optional(Type.Array(Type.String())),
    languages: Type.Optional(Type.Array(Type.String())),
    portfolioSize: Type.Optional(Type.Number()),
    yearsManaging: Type.Optional(Type.Number()),
    avatarUrl: Type.Optional(Type.String()),
    coverUrl: Type.Optional(Type.String()),
    verified: Type.Optional(Type.Boolean()),
    /** Default fee preferences shown on profile + pre-filled on listing requests. */
    defaultFee: Type.Optional(defaultFeeSchema),
    /** Denormalised rating summary (updated by pm-ratings after-hooks). */
    ratingAvg: Type.Optional(Type.Number()),
    ratingCount: Type.Optional(Type.Number()),
    /** File attachments (business cert, license, ID, portfolio, etc.) */
    files: Type.Optional(Type.Array(Type.Any())),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'PropertyManagerProfile', additionalProperties: false }
)

export type PropertyManagerProfile = Static<typeof propertyManagerProfileSchema>
export const propertyManagerProfileValidator = getValidator(propertyManagerProfileSchema, dataValidator)
export const propertyManagerProfileResolver = resolve<PropertyManagerProfile, HookContext>({})
export const propertyManagerProfileExternalResolver = resolve<PropertyManagerProfile, HookContext>({
  files: async (_value, profile, context) => {
    const id = (profile as any)?._id?.toString?.() ?? ''
    if (!id) return []
    return await resolveEntityFiles(context.app, 'property-manager-profiles', id)
  }
})

export const propertyManagerProfileDataSchema = Type.Object(
  {
    displayName: Type.String(),
    companyName: Type.Optional(Type.String()),
    registrationId: Type.Optional(Type.String()),
    taxId: Type.Optional(Type.String()),
    phone: Type.Optional(Type.String()),
    whatsapp: Type.Optional(Type.String()),
    emailPublic: Type.Optional(Type.String({ format: 'email' })),
    websiteUrl: Type.Optional(Type.String()),
    bio: Type.Optional(Type.String()),
    services: Type.Optional(Type.Array(Type.String())),
    regions: Type.Optional(Type.Array(Type.String())),
    languages: Type.Optional(Type.Array(Type.String())),
    portfolioSize: Type.Optional(Type.Number()),
    yearsManaging: Type.Optional(Type.Number()),
    avatarUrl: Type.Optional(Type.String()),
    coverUrl: Type.Optional(Type.String()),
    defaultFee: Type.Optional(defaultFeeSchema)
  },
  { $id: 'PropertyManagerProfileData', additionalProperties: false }
)

export type PropertyManagerProfileData = Static<typeof propertyManagerProfileDataSchema>
export const propertyManagerProfileDataValidator = getValidator(propertyManagerProfileDataSchema, dataValidator)
export const propertyManagerProfileDataResolver = resolve<PropertyManagerProfile, HookContext>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString(),
  verified: async () => false
})

export const propertyManagerProfilePatchSchema = Type.Partial(
  Type.Omit(propertyManagerProfileSchema, ['_id', 'userId', 'createdAt']),
  { $id: 'PropertyManagerProfilePatch' }
)
export type PropertyManagerProfilePatch = Static<typeof propertyManagerProfilePatchSchema>
export const propertyManagerProfilePatchValidator = getValidator(propertyManagerProfilePatchSchema, dataValidator)
export const propertyManagerProfilePatchResolver = resolve<PropertyManagerProfile, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const propertyManagerProfileQueryProperties = Type.Pick(propertyManagerProfileSchema, [
  '_id',
  'userId',
  'companyName',
  'verified',
  'createdAt',
  'updatedAt'
])
export const propertyManagerProfileQuerySchema = Type.Intersect(
  [querySyntax(propertyManagerProfileQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type PropertyManagerProfileQuery = Static<typeof propertyManagerProfileQuerySchema>
export const propertyManagerProfileQueryValidator = getValidator(propertyManagerProfileQuerySchema, queryValidator)
export const propertyManagerProfileQueryResolver = resolve<PropertyManagerProfileQuery, HookContext>({})
