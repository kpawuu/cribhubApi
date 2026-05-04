import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
export const userNotificationSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: Type.String(),
    eventKey: Type.String(),
    category: Type.String(),
    title: Type.String(),
    body: Type.Optional(Type.String()),
    readAt: Type.Optional(Type.String({ format: 'date-time' })),
    linkUrl: Type.Optional(Type.String()),
    relatedService: Type.Optional(Type.String()),
    relatedId: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Any()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'UserNotification', additionalProperties: false }
)

export type UserNotification = Static<typeof userNotificationSchema>
export const userNotificationValidator = getValidator(userNotificationSchema, dataValidator)
export const userNotificationResolver = resolve<UserNotification, HookContext>({})
export const userNotificationExternalResolver = resolve<UserNotification, HookContext>({})

/** Admin / internal only */
export const userNotificationDataSchema = Type.Object(
  {
    userId: Type.String(),
    eventKey: Type.String(),
    category: Type.String(),
    title: Type.String(),
    body: Type.Optional(Type.String()),
    linkUrl: Type.Optional(Type.String()),
    relatedService: Type.Optional(Type.String()),
    relatedId: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Any())
  },
  { $id: 'UserNotificationData', additionalProperties: false }
)
export type UserNotificationData = Static<typeof userNotificationDataSchema>
export const userNotificationDataValidator = getValidator(userNotificationDataSchema, dataValidator)
export const userNotificationDataResolver = resolve<UserNotification, HookContext>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const userNotificationPatchSchema = Type.Object(
  {
    readAt: Type.Optional(Type.Union([Type.String({ format: 'date-time' }), Type.Null()]))
  },
  { $id: 'UserNotificationPatch', additionalProperties: false }
)
export type UserNotificationPatch = Static<typeof userNotificationPatchSchema>
export const userNotificationPatchValidator = getValidator(userNotificationPatchSchema, dataValidator)
export const userNotificationPatchResolver = resolve<UserNotification, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const userNotificationQueryProperties = Type.Intersect(
  [
    Type.Pick(userNotificationSchema, ['_id', 'userId', 'eventKey', 'category', 'createdAt', 'updatedAt']),
    Type.Object(
      {
        readAt: Type.Optional(Type.Union([Type.String({ format: 'date-time' }), Type.Null()])),
        /** Virtual: expanded server-side into a Mongo `$and` clause for unread rows. */
        unreadOnly: Type.Optional(Type.Union([Type.Boolean(), Type.Literal('true'), Type.Literal('false')])),
        /** Virtual: expanded server-side for rows that have been marked read. */
        readOnlyOnly: Type.Optional(Type.Union([Type.Boolean(), Type.Literal('true'), Type.Literal('false')]))
      },
      { additionalProperties: true }
    )
  ],
  { additionalProperties: true }
)
export const userNotificationQuerySchema = Type.Intersect(
  [querySyntax(userNotificationQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type UserNotificationQuery = Static<typeof userNotificationQuerySchema>
export const userNotificationQueryValidator = getValidator(userNotificationQuerySchema, queryValidator)
export const userNotificationQueryResolver = resolve<UserNotificationQuery, HookContext>({})
