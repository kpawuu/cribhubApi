import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { errors } from '@feathersjs/errors'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const propertyManagerAssignmentSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    managerUserId: Type.String(),
    landlordId: Type.String(),
    assignedBy: Type.Optional(Type.String()),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'PropertyManagerAssignment', additionalProperties: false }
)

export type PropertyManagerAssignment = Static<typeof propertyManagerAssignmentSchema>
export const propertyManagerAssignmentValidator = getValidator(propertyManagerAssignmentSchema, dataValidator)
export const propertyManagerAssignmentResolver = resolve<PropertyManagerAssignment, HookContext>({})
export const propertyManagerAssignmentExternalResolver = resolve<PropertyManagerAssignment, HookContext>({})

export const propertyManagerAssignmentDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    managerUserId: Type.String()
  },
  { $id: 'PropertyManagerAssignmentData', additionalProperties: false }
)
export type PropertyManagerAssignmentData = Static<typeof propertyManagerAssignmentDataSchema>
export const propertyManagerAssignmentDataValidator = getValidator(propertyManagerAssignmentDataSchema, dataValidator)
export const propertyManagerAssignmentDataResolver = resolve<PropertyManagerAssignment, HookContext>({
  createdAt: async () => new Date().toISOString(),
  landlordId: async (_v, data, context) => {
    const pid = (data as any)?.propertyId
    if (!pid) throw new errors.BadRequest('propertyId is required')
    const prop = await context.app.service('properties').get(String(pid), { provider: undefined } as any)
    return String((prop as any).landlordId || '')
  },
  assignedBy: async (_v, _d, context) => (context.params.user as any)?._id?.toString?.()
})

export const propertyManagerAssignmentPatchSchema = Type.Partial(
  Type.Omit(propertyManagerAssignmentSchema, ['_id', 'propertyId', 'managerUserId', 'landlordId', 'createdAt']),
  { $id: 'PropertyManagerAssignmentPatch' }
)
export type PropertyManagerAssignmentPatch = Static<typeof propertyManagerAssignmentPatchSchema>
export const propertyManagerAssignmentPatchValidator = getValidator(propertyManagerAssignmentPatchSchema, dataValidator)
export const propertyManagerAssignmentPatchResolver = resolve<PropertyManagerAssignmentPatch, HookContext>({})

export const propertyManagerAssignmentQueryProperties = Type.Pick(propertyManagerAssignmentSchema, [
  '_id',
  'propertyId',
  'managerUserId',
  'landlordId',
  'createdAt'
])
export const propertyManagerAssignmentQuerySchema = Type.Intersect(
  [querySyntax(propertyManagerAssignmentQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type PropertyManagerAssignmentQuery = Static<typeof propertyManagerAssignmentQuerySchema>
export const propertyManagerAssignmentQueryValidator = getValidator(propertyManagerAssignmentQuerySchema, queryValidator)
export const propertyManagerAssignmentQueryResolver = resolve<PropertyManagerAssignmentQuery, HookContext>({})
