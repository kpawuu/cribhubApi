import { resolve } from '@feathersjs/schema'
import { Type, getValidator, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const userRoleSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: Type.String(),
    role: Type.Union([
      Type.Literal('tenant'),
      Type.Literal('landlord'),
      Type.Literal('property_manager'),
      Type.Literal('agent'),
      Type.Literal('admin')
    ]),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'UserRole', additionalProperties: false }
)

export type UserRole = Static<typeof userRoleSchema>
export const userRoleValidator = getValidator(userRoleSchema, dataValidator)
export const userRoleResolver = resolve<UserRole, HookContext>({})
export const userRoleExternalResolver = resolve<UserRole, HookContext>({})

export const userRoleDataSchema = Type.Pick(userRoleSchema, ['userId', 'role'], { $id: 'UserRoleData' })
export type UserRoleData = Static<typeof userRoleDataSchema>
export const userRoleDataValidator = getValidator(userRoleDataSchema, dataValidator)
export const userRoleDataResolver = resolve<UserRole, HookContext>({
  createdAt: async () => new Date().toISOString()
})

export const userRolePatchSchema = Type.Partial(userRoleSchema, { $id: 'UserRolePatch' })
export type UserRolePatch = Static<typeof userRolePatchSchema>
export const userRolePatchValidator = getValidator(userRolePatchSchema, dataValidator)
export const userRolePatchResolver = resolve<UserRole, HookContext>({})

export const userRoleQuerySchema = Type.Object({}, { $id: 'UserRoleQuery', additionalProperties: true })
export type UserRoleQuery = Static<typeof userRoleQuerySchema>
export const userRoleQueryValidator = getValidator(userRoleQuerySchema, queryValidator)
export const userRoleQueryResolver = resolve<UserRoleQuery, HookContext>({})

