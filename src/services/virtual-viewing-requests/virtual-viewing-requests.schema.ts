import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { VirtualViewingRequestsService } from './virtual-viewing-requests.class'

export const virtualViewingRequestSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    unitId: Type.String(),
    name: Type.String(),
    email: Type.String({ format: 'email' }),
    phone: Type.Optional(Type.String()),
    preferredDate: Type.Optional(Type.String()),
    preferredTime: Type.Optional(Type.String()),
    message: Type.Optional(Type.String()),
    status: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('confirmed'), Type.Literal('cancelled')])),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'VirtualViewingRequest', additionalProperties: false }
)

export type VirtualViewingRequest = Static<typeof virtualViewingRequestSchema>
export const virtualViewingRequestValidator = getValidator(virtualViewingRequestSchema, dataValidator)
export const virtualViewingRequestResolver = resolve<VirtualViewingRequest, HookContext<VirtualViewingRequestsService>>({})
export const virtualViewingRequestExternalResolver = resolve<VirtualViewingRequest, HookContext<VirtualViewingRequestsService>>({})

export const virtualViewingRequestDataSchema = Type.Object(
  {
    unitId: Type.String(),
    name: Type.String(),
    email: Type.String({ format: 'email' }),
    phone: Type.Optional(Type.String()),
    preferredDate: Type.Optional(Type.String()),
    preferredTime: Type.Optional(Type.String()),
    message: Type.Optional(Type.String())
  },
  { $id: 'VirtualViewingRequestData', additionalProperties: false }
)
export type VirtualViewingRequestData = Static<typeof virtualViewingRequestDataSchema>
export const virtualViewingRequestDataValidator = getValidator(virtualViewingRequestDataSchema, dataValidator)
export const virtualViewingRequestDataResolver = resolve<VirtualViewingRequest, HookContext<VirtualViewingRequestsService>>({
  status: async () => 'pending' as const,
  createdAt: async () => new Date().toISOString()
})

export const virtualViewingRequestPatchSchema = Type.Partial(
  Type.Object({
    status: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('confirmed'), Type.Literal('cancelled')]))
  }),
  { $id: 'VirtualViewingRequestPatch', additionalProperties: false }
)
export type VirtualViewingRequestPatch = Static<typeof virtualViewingRequestPatchSchema>
export const virtualViewingRequestPatchValidator = getValidator(virtualViewingRequestPatchSchema, dataValidator)
export const virtualViewingRequestPatchResolver = resolve<VirtualViewingRequest, HookContext<VirtualViewingRequestsService>>({})

export const virtualViewingRequestQueryProperties = Type.Pick(virtualViewingRequestSchema, ['_id', 'unitId', 'status', 'email'])
export const virtualViewingRequestQuerySchema = Type.Intersect(
  [querySyntax(virtualViewingRequestQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type VirtualViewingRequestQuery = Static<typeof virtualViewingRequestQuerySchema>
export const virtualViewingRequestQueryValidator = getValidator(virtualViewingRequestQuerySchema, queryValidator)
export const virtualViewingRequestQueryResolver = resolve<VirtualViewingRequestQuery, HookContext<VirtualViewingRequestsService>>({})

