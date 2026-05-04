import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { MaintenanceRequestsService } from './maintenance-requests.class'

export const maintenanceRequestSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    unitId: Type.String(),
    tenantId: Type.String(),
    title: Type.String(),
    description: Type.String(),
    category: Type.String(),
    priority: Type.Optional(Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('urgent')])),
    status: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('in_progress'), Type.Literal('completed')])),
    images: Type.Optional(Type.Array(Type.String())),
    assignedTo: Type.Optional(Type.String()),
    estimatedCompletion: Type.Optional(Type.String()),
    completedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'MaintenanceRequest', additionalProperties: false }
)

export type MaintenanceRequest = Static<typeof maintenanceRequestSchema>
export const maintenanceRequestValidator = getValidator(maintenanceRequestSchema, dataValidator)
export const maintenanceRequestResolver = resolve<MaintenanceRequest, HookContext<MaintenanceRequestsService>>({})
export const maintenanceRequestExternalResolver = resolve<MaintenanceRequest, HookContext<MaintenanceRequestsService>>({})

export const maintenanceRequestDataSchema = Type.Object(
  {
    unitId: Type.String(),
    title: Type.String(),
    description: Type.String(),
    category: Type.String(),
    priority: Type.Optional(Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('urgent')])),
    images: Type.Optional(Type.Array(Type.String()))
  },
  { $id: 'MaintenanceRequestData', additionalProperties: false }
)
export type MaintenanceRequestData = Static<typeof maintenanceRequestDataSchema>
export const maintenanceRequestDataValidator = getValidator(maintenanceRequestDataSchema, dataValidator)
export const maintenanceRequestDataResolver = resolve<MaintenanceRequest, HookContext<MaintenanceRequestsService>>({
  status: async () => 'pending' as const,
  priority: async (v) => v ?? 'medium',
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const maintenanceRequestPatchSchema = Type.Partial(
  Type.Object({
    status: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('in_progress'), Type.Literal('completed')])),
    assignedTo: Type.Optional(Type.String()),
    estimatedCompletion: Type.Optional(Type.String()),
    completedAt: Type.Optional(Type.String({ format: 'date-time' }))
  }),
  { $id: 'MaintenanceRequestPatch', additionalProperties: false }
)
export type MaintenanceRequestPatch = Static<typeof maintenanceRequestPatchSchema>
export const maintenanceRequestPatchValidator = getValidator(maintenanceRequestPatchSchema, dataValidator)
export const maintenanceRequestPatchResolver = resolve<MaintenanceRequest, HookContext<MaintenanceRequestsService>>({
  updatedAt: async () => new Date().toISOString()
})

export const maintenanceRequestQueryProperties = Type.Pick(maintenanceRequestSchema, [
  '_id',
  'unitId',
  'tenantId',
  'status',
  'priority',
  'createdAt',
  'updatedAt'
])
export const maintenanceRequestQuerySchema = Type.Intersect(
  [querySyntax(maintenanceRequestQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type MaintenanceRequestQuery = Static<typeof maintenanceRequestQuerySchema>
export const maintenanceRequestQueryValidator = getValidator(maintenanceRequestQuerySchema, queryValidator)
export const maintenanceRequestQueryResolver = resolve<MaintenanceRequestQuery, HookContext<MaintenanceRequestsService>>({})

