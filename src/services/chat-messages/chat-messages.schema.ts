import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ChatMessagesService } from './chat-messages.class'

export const chatMessageSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    /**
     * Modern thread reference. Always present on new messages. For legacy
     * inquiry-only messages, `threadId` is populated by a migration hook to
     * the thread auto-created from the inquiry.
     */
    threadId: Type.Optional(Type.String()),
    /** Legacy: inquiry the message belongs to. Still maintained for tenant→landlord chats. */
    inquiryId: Type.Optional(Type.String()),
    senderUserId: Type.String(),
    senderName: Type.Optional(Type.String()),
    senderRole: Type.Optional(
      Type.Union([
        Type.Literal('tenant'),
        Type.Literal('landlord'),
        Type.Literal('agent'),
        Type.Literal('property_manager'),
        Type.Literal('admin')
      ])
    ),
    body: Type.String(),
    /** Optional system message (e.g. "Landlord accepted your request") rendered as a chip. */
    system: Type.Optional(Type.Boolean()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'ChatMessage', additionalProperties: false }
)

export type ChatMessage = Static<typeof chatMessageSchema>
export const chatMessageValidator = getValidator(chatMessageSchema, dataValidator)
export const chatMessageResolver = resolve<ChatMessage, HookContext<ChatMessagesService>>({})
export const chatMessageExternalResolver = resolve<ChatMessage, HookContext<ChatMessagesService>>({})

export const chatMessageDataSchema = Type.Object(
  {
    threadId: Type.Optional(Type.String()),
    inquiryId: Type.Optional(Type.String()),
    body: Type.String(),
    system: Type.Optional(Type.Boolean())
  },
  { $id: 'ChatMessageData', additionalProperties: false }
)

export type ChatMessageData = Static<typeof chatMessageDataSchema>
export const chatMessageDataValidator = getValidator(chatMessageDataSchema, dataValidator)
export const chatMessageDataResolver = resolve<ChatMessage, HookContext<ChatMessagesService>>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const chatMessagePatchSchema = Type.Partial(
  Type.Object({ body: Type.Optional(Type.String()) }),
  { $id: 'ChatMessagePatch', additionalProperties: false }
)
export type ChatMessagePatch = Static<typeof chatMessagePatchSchema>
export const chatMessagePatchValidator = getValidator(chatMessagePatchSchema, dataValidator)
export const chatMessagePatchResolver = resolve<ChatMessage, HookContext<ChatMessagesService>>({
  updatedAt: async () => new Date().toISOString()
})

export const chatMessageQueryProperties = Type.Pick(chatMessageSchema, [
  '_id',
  'threadId',
  'inquiryId',
  'senderUserId',
  'createdAt'
])
export const chatMessageQuerySchema = Type.Intersect(
  [querySyntax(chatMessageQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type ChatMessageQuery = Static<typeof chatMessageQuerySchema>
export const chatMessageQueryValidator = getValidator(chatMessageQuerySchema, queryValidator)
export const chatMessageQueryResolver = resolve<ChatMessageQuery, HookContext<ChatMessagesService>>({})
