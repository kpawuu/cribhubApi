import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { errors } from '@feathersjs/errors'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const pmListingRequestStatusSchema = Type.Union([
  Type.Literal('pending'),
  Type.Literal('accepted'),
  Type.Literal('rejected'),
  Type.Literal('withdrawn')
])

export const propertyManagerListingRequestSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    managerUserId: Type.String(),
    landlordId: Type.String(),
    message: Type.Optional(Type.String({ maxLength: 4000 })),
    status: pmListingRequestStatusSchema,
    reviewedBy: Type.Optional(Type.String()),
    reviewedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'PropertyManagerListingRequest', additionalProperties: false }
)

export type PropertyManagerListingRequest = Static<typeof propertyManagerListingRequestSchema>
export const propertyManagerListingRequestValidator = getValidator(propertyManagerListingRequestSchema, dataValidator)
export const propertyManagerListingRequestResolver = resolve<PropertyManagerListingRequest, HookContext>({})
export const propertyManagerListingRequestExternalResolver = resolve<PropertyManagerListingRequest, HookContext>({})

export const propertyManagerListingRequestDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    message: Type.Optional(Type.String({ maxLength: 4000 })),
    /** Admin-only: create on behalf of this manager user. */
    managerUserId: Type.Optional(Type.String())
  },
  { $id: 'PropertyManagerListingRequestData', additionalProperties: false }
)
export type PropertyManagerListingRequestData = Static<typeof propertyManagerListingRequestDataSchema>
export const propertyManagerListingRequestDataValidator = getValidator(propertyManagerListingRequestDataSchema, dataValidator)
export const propertyManagerListingRequestDataResolver = resolve<PropertyManagerListingRequest, HookContext>({
  status: async () => 'pending' as const,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString(),
  managerUserId: async (_value, data, context) => {
    const roles: string[] = Array.isArray((context.params.user as any)?.roles)
      ? ((context.params.user as any).roles as string[])
      : []
    const adminOverride = (data as any)?.managerUserId
    if (roles.includes('admin')) {
      if (typeof adminOverride === 'string' && adminOverride.trim()) return adminOverride.trim()
      throw new errors.BadRequest('Admins must pass managerUserId when creating a listing request.')
    }
    const uid = (context.params.user as any)?._id?.toString?.()
    if (!uid) throw new errors.BadRequest('Missing user')
    return uid
  },
  landlordId: async (_value, data, context) => {
    const pid = (data as any)?.propertyId
    if (!pid) throw new errors.BadRequest('Missing propertyId')
    try {
      const prop = await context.app.service('properties').get(String(pid), { provider: undefined } as any)
      const lid = (prop as any)?.landlordId
      if (!lid) throw new errors.BadRequest('Property has no landlord')
      return String(lid)
    } catch (e: any) {
      if (e?.className === 'not-found') throw new errors.BadRequest('Property not found')
      throw e
    }
  }
})

export const propertyManagerListingRequestPatchSchema = Type.Object(
  {
    status: Type.Optional(Type.Union([Type.Literal('accepted'), Type.Literal('rejected'), Type.Literal('withdrawn')])),
    reviewedBy: Type.Optional(Type.String()),
    reviewedAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'PropertyManagerListingRequestPatch', additionalProperties: false }
)
export type PropertyManagerListingRequestPatch = Static<typeof propertyManagerListingRequestPatchSchema>
export const propertyManagerListingRequestPatchValidator = getValidator(propertyManagerListingRequestPatchSchema, dataValidator)
export const propertyManagerListingRequestPatchResolver = resolve<PropertyManagerListingRequestPatch, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const propertyManagerListingRequestQueryProperties = Type.Pick(propertyManagerListingRequestSchema, [
  '_id',
  'propertyId',
  'managerUserId',
  'landlordId',
  'status',
  'createdAt',
  'updatedAt'
])
export const propertyManagerListingRequestQuerySchema = Type.Intersect(
  [querySyntax(propertyManagerListingRequestQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type PropertyManagerListingRequestQuery = Static<typeof propertyManagerListingRequestQuerySchema>
export const propertyManagerListingRequestQueryValidator = getValidator(propertyManagerListingRequestQuerySchema, queryValidator)
export const propertyManagerListingRequestQueryResolver = resolve<PropertyManagerListingRequestQuery, HookContext>({})
