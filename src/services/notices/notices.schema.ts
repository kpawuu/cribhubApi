import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { NoticesService } from './notices.class'

export const noticeSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    landlordId: Type.String(),
    title: Type.String(),
    content: Type.String(),
    type: Type.Optional(Type.String()),
    author: Type.String(),
    isManualEntry: Type.Optional(Type.Boolean()),
    smsSent: Type.Optional(Type.Boolean()),
    smsRecipients: Type.Optional(Type.Array(Type.String())),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'Notice', additionalProperties: false }
)

export type Notice = Static<typeof noticeSchema>
export const noticeValidator = getValidator(noticeSchema, dataValidator)
export const noticeResolver = resolve<Notice, HookContext<NoticesService>>({})
export const noticeExternalResolver = resolve<Notice, HookContext<NoticesService>>({})

export const noticeDataSchema = Type.Object(
  {
    /** Required for `property_manager` (and optional for `admin`) when posting on behalf of a landlord. */
    landlordId: Type.Optional(Type.String()),
    title: Type.String(),
    content: Type.String(),
    type: Type.Optional(Type.String()),
    author: Type.String(),
    isManualEntry: Type.Optional(Type.Boolean()),
    smsRecipients: Type.Optional(Type.Array(Type.String()))
  },
  { $id: 'NoticeData', additionalProperties: false }
)
export type NoticeData = Static<typeof noticeDataSchema>
export const noticeDataValidator = getValidator(noticeDataSchema, dataValidator)
export const noticeDataResolver = resolve<Notice, HookContext<NoticesService>>({
  smsSent: async () => false,
  isManualEntry: async (v) => v ?? false,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const noticePatchSchema = Type.Partial(Type.Omit(noticeSchema, ['_id', 'landlordId', 'createdAt']), { $id: 'NoticePatch' })
export type NoticePatch = Static<typeof noticePatchSchema>
export const noticePatchValidator = getValidator(noticePatchSchema, dataValidator)
export const noticePatchResolver = resolve<Notice, HookContext<NoticesService>>({
  updatedAt: async () => new Date().toISOString()
})

export const noticeQueryProperties = Type.Pick(noticeSchema, [
  '_id',
  'landlordId',
  'type',
  'smsSent',
  'createdAt',
  'updatedAt'
])
export const noticeQuerySchema = Type.Intersect(
  [querySyntax(noticeQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type NoticeQuery = Static<typeof noticeQuerySchema>
export const noticeQueryValidator = getValidator(noticeQuerySchema, queryValidator)
export const noticeQueryResolver = resolve<NoticeQuery, HookContext<NoticesService>>({})

