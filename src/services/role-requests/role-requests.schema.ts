import { resolve } from '@feathersjs/schema'
import { Type, getValidator, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const roleRequestSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: Type.String(),
    role: Type.Union([Type.Literal('landlord'), Type.Literal('property_manager'), Type.Literal('agent')]),
    status: Type.Union([Type.Literal('pending'), Type.Literal('approved'), Type.Literal('rejected')]),
    /** Optional message / pitch from the applicant */
    message: Type.Optional(Type.String()),
    notes: Type.Optional(Type.String()),
    reviewedBy: Type.Optional(Type.String()),
    reviewedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'RoleRequest', additionalProperties: false }
)

export type RoleRequest = Static<typeof roleRequestSchema>
export const roleRequestValidator = getValidator(roleRequestSchema, dataValidator)
export const roleRequestResolver = resolve<RoleRequest, HookContext>({})
export const roleRequestExternalResolver = resolve<RoleRequest, HookContext>({})

export const roleRequestDataSchema = Type.Object(
  {
    userId: Type.String(),
    role: Type.Union([Type.Literal('landlord'), Type.Literal('property_manager'), Type.Literal('agent')]),
    status: Type.Optional(Type.Literal('pending')),
    /** Optional message the applicant wants to include with their request */
    message: Type.Optional(Type.String({ maxLength: 2000 }))
  },
  { $id: 'RoleRequestData', additionalProperties: false }
)
export type RoleRequestData = Static<typeof roleRequestDataSchema>
export const roleRequestDataValidator = getValidator(roleRequestDataSchema, dataValidator)
export const roleRequestDataResolver = resolve<RoleRequest, HookContext>({
  status: async () => 'pending' as const,
  createdAt: async () => new Date().toISOString()
})

export const roleRequestPatchSchema = Type.Partial(Type.Omit(roleRequestSchema, ['_id', 'userId', 'role', 'createdAt']), {
  $id: 'RoleRequestPatch'
})
export type RoleRequestPatch = Static<typeof roleRequestPatchSchema>
export const roleRequestPatchValidator = getValidator(roleRequestPatchSchema, dataValidator)
export const roleRequestPatchResolver = resolve<RoleRequest, HookContext>({
  reviewedAt: async (_v, _r, context) => (context.data as any)?.status ? new Date().toISOString() : undefined
})

export const roleRequestQuerySchema = Type.Object({}, { $id: 'RoleRequestQuery', additionalProperties: true })
export type RoleRequestQuery = Static<typeof roleRequestQuerySchema>
export const roleRequestQueryValidator = getValidator(roleRequestQuerySchema, queryValidator)
export const roleRequestQueryResolver = resolve<RoleRequestQuery, HookContext>({})
