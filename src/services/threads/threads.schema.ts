import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const threadKindSchema = Type.Union([
  Type.Literal('landlord-pm'),
  Type.Literal('landlord-agent'),
  Type.Literal('landlord-tenant')
])

export const threadSubjectSchema = Type.Object(
  {
    type: Type.Union([Type.Literal('property'), Type.Literal('unit'), Type.Literal('inquiry'), Type.Literal('none')]),
    id: Type.Optional(Type.String())
  },
  // No `$id` — this nested type is referenced from both threadSchema and
  // threadDataSchema, which causes AJV to error when both register it.
  { additionalProperties: false }
)

export const threadSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    kind: threadKindSchema,
    /** Primary subject (property/unit/inquiry/none). */
    subject: threadSubjectSchema,
    /** Optional property the thread relates to (denormalised for fast scoping). */
    propertyId: Type.Optional(Type.String()),
    /** Optional inquiry the thread relates to (for landlord-tenant continuity with legacy inquiries). */
    inquiryId: Type.Optional(Type.String()),
    /** All user IDs allowed in this thread. */
    participantIds: Type.Array(Type.String()),
    /** Friendly label shown in the inbox (defaults to property name on create). */
    title: Type.Optional(Type.String()),
    /** Optional system message displayed at the top of the thread. */
    systemNote: Type.Optional(Type.String()),
    lastMessageAt: Type.Optional(Type.String({ format: 'date-time' })),
    lastMessagePreview: Type.Optional(Type.String()),
    lastMessageBy: Type.Optional(Type.String()),
    createdByUserId: Type.Optional(Type.String()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'Thread', additionalProperties: false }
)

export type Thread = Static<typeof threadSchema>
export const threadValidator = getValidator(threadSchema, dataValidator)
export const threadResolver = resolve<Thread, HookContext>({})
export const threadExternalResolver = resolve<Thread, HookContext>({})

export const threadDataSchema = Type.Object(
  {
    kind: threadKindSchema,
    subject: threadSubjectSchema,
    propertyId: Type.Optional(Type.String()),
    inquiryId: Type.Optional(Type.String()),
    participantIds: Type.Array(Type.String()),
    title: Type.Optional(Type.String()),
    systemNote: Type.Optional(Type.String())
  },
  { $id: 'ThreadData', additionalProperties: false }
)

export type ThreadData = Static<typeof threadDataSchema>
export const threadDataValidator = getValidator(threadDataSchema, dataValidator)
export const threadDataResolver = resolve<Thread, HookContext>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString(),
  createdByUserId: async (_v, _r, context) => (context.params.user as any)?._id?.toString?.()
})

export const threadPatchSchema = Type.Partial(
  Type.Object({
    title: Type.Optional(Type.String()),
    systemNote: Type.Optional(Type.String()),
    lastMessageAt: Type.Optional(Type.String({ format: 'date-time' })),
    lastMessagePreview: Type.Optional(Type.String()),
    lastMessageBy: Type.Optional(Type.String())
  }),
  { $id: 'ThreadPatch', additionalProperties: false }
)

export type ThreadPatch = Static<typeof threadPatchSchema>
export const threadPatchValidator = getValidator(threadPatchSchema, dataValidator)
export const threadPatchResolver = resolve<Thread, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const threadQueryProperties = Type.Pick(threadSchema, [
  '_id',
  'kind',
  'propertyId',
  'inquiryId',
  'createdAt',
  'updatedAt',
  'lastMessageAt'
])
export const threadQuerySchema = Type.Intersect(
  [querySyntax(threadQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type ThreadQuery = Static<typeof threadQuerySchema>
export const threadQueryValidator = getValidator(threadQuerySchema, queryValidator)
export const threadQueryResolver = resolve<ThreadQuery, HookContext>({})
