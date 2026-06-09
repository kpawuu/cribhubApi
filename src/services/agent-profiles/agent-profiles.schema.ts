import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { resolveEntityFiles } from '../../utils/resolveEntityFiles'
import { defaultFeeSchema } from '../property-manager-profiles/property-manager-profiles.schema'

export const agentProfileSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: Type.String(),
    displayName: Type.String(),
    agency: Type.Optional(Type.String()),
    phone: Type.Optional(Type.String()),
    whatsapp: Type.Optional(Type.String()),
    emailPublic: Type.Optional(Type.String({ format: 'email' })),
    bio: Type.Optional(Type.String()),
    regions: Type.Optional(Type.Array(Type.String())),
    languages: Type.Optional(Type.Array(Type.String())),
    avatarUrl: Type.Optional(Type.String()),
    listingsCount: Type.Optional(Type.Number()),
    responseTimeMinutes: Type.Optional(Type.Number()),
    verified: Type.Optional(Type.Boolean()),
    /** Default fee preferences ("rate card") shown publicly and pre-filled on listing requests. */
    defaultFee: Type.Optional(defaultFeeSchema),
    // Denormalised rating summary — updated by the agent-ratings service after-hooks.
    ratingAvg: Type.Optional(Type.Number()),
    ratingCount: Type.Optional(Type.Number()),
    // attachments (license, IDs, certificates, etc.)
    files: Type.Optional(Type.Array(Type.Any())),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'AgentProfile', additionalProperties: false }
)

export type AgentProfile = Static<typeof agentProfileSchema>
export const agentProfileValidator = getValidator(agentProfileSchema, dataValidator)
export const agentProfileResolver = resolve<AgentProfile, HookContext>({})
export const agentProfileExternalResolver = resolve<AgentProfile, HookContext>({
  files: async (_value, profile, context) => {
    const id = (profile as any)?._id?.toString?.() ?? ''
    if (!id) return []
    return await resolveEntityFiles(context.app, 'agent-profiles', id)
  }
})

export const agentProfileDataSchema = Type.Object(
  {
    displayName: Type.String(),
    agency: Type.Optional(Type.String()),
    phone: Type.Optional(Type.String()),
    whatsapp: Type.Optional(Type.String()),
    emailPublic: Type.Optional(Type.String({ format: 'email' })),
    bio: Type.Optional(Type.String()),
    regions: Type.Optional(Type.Array(Type.String())),
    languages: Type.Optional(Type.Array(Type.String())),
    avatarUrl: Type.Optional(Type.String()),
    listingsCount: Type.Optional(Type.Number()),
    responseTimeMinutes: Type.Optional(Type.Number()),
    defaultFee: Type.Optional(defaultFeeSchema)
  },
  { $id: 'AgentProfileData', additionalProperties: false }
)

export type AgentProfileData = Static<typeof agentProfileDataSchema>
export const agentProfileDataValidator = getValidator(agentProfileDataSchema, dataValidator)
export const agentProfileDataResolver = resolve<AgentProfile, HookContext>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString(),
  verified: async () => false
})

export const agentProfilePatchSchema = Type.Partial(Type.Omit(agentProfileSchema, ['_id', 'userId', 'createdAt']), {
  $id: 'AgentProfilePatch'
})
export type AgentProfilePatch = Static<typeof agentProfilePatchSchema>
export const agentProfilePatchValidator = getValidator(agentProfilePatchSchema, dataValidator)
export const agentProfilePatchResolver = resolve<AgentProfile, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const agentProfileQueryProperties = Type.Pick(agentProfileSchema, [
  '_id',
  'userId',
  'agency',
  'verified',
  'createdAt',
  'updatedAt'
])
export const agentProfileQuerySchema = Type.Intersect(
  [querySyntax(agentProfileQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type AgentProfileQuery = Static<typeof agentProfileQuerySchema>
export const agentProfileQueryValidator = getValidator(agentProfileQuerySchema, queryValidator)
export const agentProfileQueryResolver = resolve<AgentProfileQuery, HookContext>({})

