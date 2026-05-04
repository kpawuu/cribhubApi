import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { CommunicationsService } from './communications.class'

export const communicationSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    landlordId: Type.String(),
    type: Type.Optional(Type.String()),
    fromName: Type.String(),
    property: Type.String(),
    message: Type.String(),
    isRead: Type.Optional(Type.Boolean()),
    isManualEntry: Type.Optional(Type.Boolean()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'Communication', additionalProperties: false }
)

export type Communication = Static<typeof communicationSchema>
export const communicationValidator = getValidator(communicationSchema, dataValidator)
export const communicationResolver = resolve<Communication, HookContext<CommunicationsService>>({})
export const communicationExternalResolver = resolve<Communication, HookContext<CommunicationsService>>({})

export const communicationDataSchema = Type.Object(
  {
    /** Required for `property_manager` when posting on behalf of a landlord. */
    landlordId: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
    fromName: Type.String(),
    property: Type.String(),
    message: Type.String(),
    isManualEntry: Type.Optional(Type.Boolean())
  },
  { $id: 'CommunicationData', additionalProperties: false }
)
export type CommunicationData = Static<typeof communicationDataSchema>
export const communicationDataValidator = getValidator(communicationDataSchema, dataValidator)
export const communicationDataResolver = resolve<Communication, HookContext<CommunicationsService>>({
  isRead: async () => false,
  isManualEntry: async (v) => v ?? false,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const communicationPatchSchema = Type.Partial(Type.Omit(communicationSchema, ['_id', 'landlordId', 'createdAt']), {
  $id: 'CommunicationPatch'
})
export type CommunicationPatch = Static<typeof communicationPatchSchema>
export const communicationPatchValidator = getValidator(communicationPatchSchema, dataValidator)
export const communicationPatchResolver = resolve<Communication, HookContext<CommunicationsService>>({
  updatedAt: async () => new Date().toISOString()
})

export const communicationQueryProperties = Type.Pick(communicationSchema, [
  '_id',
  'landlordId',
  'isRead',
  'type',
  'createdAt',
  'updatedAt'
])
export const communicationQuerySchema = Type.Intersect(
  [querySyntax(communicationQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type CommunicationQuery = Static<typeof communicationQuerySchema>
export const communicationQueryValidator = getValidator(communicationQuerySchema, queryValidator)
export const communicationQueryResolver = resolve<CommunicationQuery, HookContext<CommunicationsService>>({})

