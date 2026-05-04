import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const inquirySchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    unitId: Type.Optional(Type.String()),
    agentUserId: Type.Optional(Type.String()),
    landlordId: Type.Optional(Type.String()),
    createdByUserId: Type.Optional(Type.String()), // if authenticated
    name: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: 'email' })),
    phone: Type.Optional(Type.String()),
    contactMethod: Type.Optional(Type.Union([Type.Literal('call'), Type.Literal('email'), Type.Literal('whatsapp'), Type.Literal('message')])),
    message: Type.Optional(Type.String()),
    status: Type.Optional(
      Type.Union([Type.Literal('new'), Type.Literal('contacted'), Type.Literal('viewing_scheduled'), Type.Literal('closed'), Type.Literal('lost')])
    ),
    lastMessageAt: Type.Optional(Type.String({ format: 'date-time' })),
    lastMessagePreview: Type.Optional(Type.String()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'Inquiry', additionalProperties: false }
)

export type Inquiry = Static<typeof inquirySchema>
export const inquiryValidator = getValidator(inquirySchema, dataValidator)
export const inquiryResolver = resolve<Inquiry, HookContext>({})
export const inquiryExternalResolver = resolve<Inquiry, HookContext>({})

export const inquiryDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    unitId: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: 'email' })),
    phone: Type.Optional(Type.String()),
    contactMethod: Type.Optional(Type.Union([Type.Literal('call'), Type.Literal('email'), Type.Literal('whatsapp'), Type.Literal('message')])),
    message: Type.Optional(Type.String())
  },
  { $id: 'InquiryData', additionalProperties: false }
)

export type InquiryData = Static<typeof inquiryDataSchema>
export const inquiryDataValidator = getValidator(inquiryDataSchema, dataValidator)
export const inquiryDataResolver = resolve<Inquiry, HookContext>({
  status: async () => 'new' as const,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const inquiryPatchSchema = Type.Partial(
  Type.Object({
    status: Type.Optional(
      Type.Union([Type.Literal('new'), Type.Literal('contacted'), Type.Literal('viewing_scheduled'), Type.Literal('closed'), Type.Literal('lost')])
    ),
    message: Type.Optional(Type.String()),
    lastMessageAt: Type.Optional(Type.String({ format: 'date-time' })),
    lastMessagePreview: Type.Optional(Type.String())
  }),
  { $id: 'InquiryPatch', additionalProperties: false }
)
export type InquiryPatch = Static<typeof inquiryPatchSchema>
export const inquiryPatchValidator = getValidator(inquiryPatchSchema, dataValidator)
export const inquiryPatchResolver = resolve<Inquiry, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const inquiryQueryProperties = Type.Pick(inquirySchema, [
  '_id',
  'propertyId',
  'agentUserId',
  'landlordId',
  'status',
  'createdAt',
  'updatedAt'
])
export const inquiryQuerySchema = Type.Intersect([querySyntax(inquiryQueryProperties), Type.Object({}, { additionalProperties: true })], {
  additionalProperties: true
})
export type InquiryQuery = Static<typeof inquiryQuerySchema>
export const inquiryQueryValidator = getValidator(inquiryQuerySchema, queryValidator)
export const inquiryQueryResolver = resolve<InquiryQuery, HookContext>({})

