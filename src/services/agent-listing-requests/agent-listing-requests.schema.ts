import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { errors } from '@feathersjs/errors'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const agentListingRequestStatusSchema = Type.Union([
  Type.Literal('pending'),
  Type.Literal('accepted'),
  Type.Literal('rejected'),
  Type.Literal('withdrawn')
])

export const agentListingRequestSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    agentUserId: Type.String(),
    landlordId: Type.String(),
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    message: Type.Optional(Type.String({ maxLength: 4000 })),
    status: agentListingRequestStatusSchema,
    reviewedBy: Type.Optional(Type.String()),
    reviewedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'AgentListingRequest', additionalProperties: false }
)

export type AgentListingRequest = Static<typeof agentListingRequestSchema>
export const agentListingRequestValidator = getValidator(agentListingRequestSchema, dataValidator)
export const agentListingRequestResolver = resolve<AgentListingRequest, HookContext>({})
export const agentListingRequestExternalResolver = resolve<AgentListingRequest, HookContext>({})

/** External create: agent proposes representation on a listing. */
export const agentListingRequestDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    message: Type.Optional(Type.String({ maxLength: 4000 })),
    /** Admin-only: create a request on behalf of this agent user. */
    agentUserId: Type.Optional(Type.String())
  },
  { $id: 'AgentListingRequestData', additionalProperties: false }
)
export type AgentListingRequestData = Static<typeof agentListingRequestDataSchema>
export const agentListingRequestDataValidator = getValidator(agentListingRequestDataSchema, dataValidator)
export const agentListingRequestDataResolver = resolve<AgentListingRequest, HookContext>({
  status: async () => 'pending' as const,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString(),
  agentUserId: async (_value, data, context) => {
    const roles: string[] = Array.isArray((context.params.user as any)?.roles)
      ? ((context.params.user as any).roles as string[])
      : []
    const adminOverride = (data as any)?.agentUserId
    if (roles.includes('admin')) {
      if (typeof adminOverride === 'string' && adminOverride.trim()) return adminOverride.trim()
      throw new errors.BadRequest('Admins must pass agentUserId when creating a listing request.')
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

export const agentListingRequestPatchSchema = Type.Object(
  {
    status: Type.Optional(Type.Union([Type.Literal('accepted'), Type.Literal('rejected'), Type.Literal('withdrawn')])),
    reviewedBy: Type.Optional(Type.String()),
    reviewedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'AgentListingRequestPatch', additionalProperties: false }
)
export type AgentListingRequestPatch = Static<typeof agentListingRequestPatchSchema>
export const agentListingRequestPatchValidator = getValidator(agentListingRequestPatchSchema, dataValidator)
export const agentListingRequestPatchResolver = resolve<AgentListingRequest, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const agentListingRequestQueryProperties = Type.Pick(agentListingRequestSchema, [
  '_id',
  'propertyId',
  'agentUserId',
  'landlordId',
  'status',
  'createdAt',
  'updatedAt'
])
export const agentListingRequestQuerySchema = Type.Intersect(
  [querySyntax(agentListingRequestQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type AgentListingRequestQuery = Static<typeof agentListingRequestQuerySchema>
export const agentListingRequestQueryValidator = getValidator(agentListingRequestQuerySchema, queryValidator)
export const agentListingRequestQueryResolver = resolve<AgentListingRequestQuery, HookContext>({})
