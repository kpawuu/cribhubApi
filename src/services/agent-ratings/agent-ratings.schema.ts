import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// ──────────────────────────────────────────────
// Entity
// ──────────────────────────────────────────────
export const agentRatingSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    agentProfileId: Type.String(),
    userId: Type.String(),
    rating: Type.Number({ minimum: 1, maximum: 5 }),
    comment: Type.Optional(Type.String({ maxLength: 1000 })),
    reviewerName: Type.Optional(Type.String()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'AgentRating', additionalProperties: false }
)

export type AgentRating = Static<typeof agentRatingSchema>
export const agentRatingValidator = getValidator(agentRatingSchema, dataValidator)
export const agentRatingResolver = resolve<AgentRating, HookContext>({})
export const agentRatingExternalResolver = resolve<AgentRating, HookContext>({})

// ──────────────────────────────────────────────
// Create data
// ──────────────────────────────────────────────
export const agentRatingDataSchema = Type.Object(
  {
    agentProfileId: Type.String(),
    rating: Type.Number({ minimum: 1, maximum: 5 }),
    comment: Type.Optional(Type.String({ maxLength: 1000 })),
    reviewerName: Type.Optional(Type.String())
  },
  { $id: 'AgentRatingData', additionalProperties: false }
)

export type AgentRatingData = Static<typeof agentRatingDataSchema>
export const agentRatingDataValidator = getValidator(agentRatingDataSchema, dataValidator)
export const agentRatingDataResolver = resolve<AgentRating, HookContext>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

// ──────────────────────────────────────────────
// Patch data
// ──────────────────────────────────────────────
export const agentRatingPatchSchema = Type.Object(
  {
    rating: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
    comment: Type.Optional(Type.String({ maxLength: 1000 }))
  },
  { $id: 'AgentRatingPatch', additionalProperties: false }
)

export type AgentRatingPatch = Static<typeof agentRatingPatchSchema>
export const agentRatingPatchValidator = getValidator(agentRatingPatchSchema, dataValidator)
export const agentRatingPatchResolver = resolve<AgentRating, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

// ──────────────────────────────────────────────
// Query
// ──────────────────────────────────────────────
export const agentRatingQueryProperties = Type.Pick(agentRatingSchema, [
  '_id',
  'agentProfileId',
  'userId',
  'rating',
  'createdAt'
])

export const agentRatingQuerySchema = Type.Intersect(
  [querySyntax(agentRatingQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)

export type AgentRatingQuery = Static<typeof agentRatingQuerySchema>
export const agentRatingQueryValidator = getValidator(agentRatingQuerySchema, queryValidator)
export const agentRatingQueryResolver = resolve<AgentRatingQuery, HookContext>({})
