import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const pmRatingSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    pmProfileId: Type.String(),
    userId: Type.String(),
    rating: Type.Number({ minimum: 1, maximum: 5 }),
    comment: Type.Optional(Type.String({ maxLength: 1000 })),
    reviewerName: Type.Optional(Type.String()),
    /** Admin moderation: when true, review is hidden from public listings. */
    hidden: Type.Optional(Type.Boolean()),
    hiddenAt: Type.Optional(Type.String({ format: 'date-time' })),
    hiddenBy: Type.Optional(Type.String()),
    moderationNote: Type.Optional(Type.String({ maxLength: 1000 })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'PmRating', additionalProperties: false }
)

export type PmRating = Static<typeof pmRatingSchema>
export const pmRatingValidator = getValidator(pmRatingSchema, dataValidator)
export const pmRatingResolver = resolve<PmRating, HookContext>({})
export const pmRatingExternalResolver = resolve<PmRating, HookContext>({})

export const pmRatingDataSchema = Type.Object(
  {
    pmProfileId: Type.String(),
    rating: Type.Number({ minimum: 1, maximum: 5 }),
    comment: Type.Optional(Type.String({ maxLength: 1000 })),
    reviewerName: Type.Optional(Type.String())
  },
  { $id: 'PmRatingData', additionalProperties: false }
)

export type PmRatingData = Static<typeof pmRatingDataSchema>
export const pmRatingDataValidator = getValidator(pmRatingDataSchema, dataValidator)
export const pmRatingDataResolver = resolve<PmRating, HookContext>({
  userId: async (_value, _record, context) => {
    const user = context.params?.user as any
    return user?._id?.toString() ?? ''
  },
  reviewerName: async (value, _record, context) => {
    if (value) return value
    const user = context.params?.user as any
    return user?.fullName || user?.displayName || user?.name || user?.email || 'Anonymous'
  },
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const pmRatingPatchSchema = Type.Object(
  {
    rating: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
    comment: Type.Optional(Type.String({ maxLength: 1000 })),
    /** Admin-only: toggle moderation visibility. */
    hidden: Type.Optional(Type.Boolean()),
    /** Admin-only: timestamped when admin toggles `hidden`. */
    hiddenAt: Type.Optional(Type.Union([Type.String({ format: 'date-time' }), Type.Null()])),
    /** Admin-only: stamped to the moderator user id. */
    hiddenBy: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    moderationNote: Type.Optional(Type.String({ maxLength: 1000 }))
  },
  { $id: 'PmRatingPatch', additionalProperties: false }
)

export type PmRatingPatch = Static<typeof pmRatingPatchSchema>
export const pmRatingPatchValidator = getValidator(pmRatingPatchSchema, dataValidator)
export const pmRatingPatchResolver = resolve<PmRating, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const pmRatingQueryProperties = Type.Pick(pmRatingSchema, ['_id', 'pmProfileId', 'userId', 'rating', 'hidden', 'createdAt'])
export const pmRatingQuerySchema = Type.Intersect(
  [querySyntax(pmRatingQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type PmRatingQuery = Static<typeof pmRatingQuerySchema>
export const pmRatingQueryValidator = getValidator(pmRatingQuerySchema, queryValidator)
export const pmRatingQueryResolver = resolve<PmRatingQuery, HookContext>({})
