import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const agentAssignmentSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    agentUserId: Type.String(),
    assignedBy: Type.Optional(Type.String()),
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: Type.Optional(Type.String({ maxLength: 4000 })),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'AgentAssignment', additionalProperties: false }
)

export type AgentAssignment = Static<typeof agentAssignmentSchema>
export const agentAssignmentValidator = getValidator(agentAssignmentSchema, dataValidator)
export const agentAssignmentResolver = resolve<AgentAssignment, HookContext>({})
export const agentAssignmentExternalResolver = resolve<AgentAssignment, HookContext>({})

export const agentAssignmentDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    agentUserId: Type.String(),
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: Type.Optional(Type.String({ maxLength: 4000 }))
  },
  { $id: 'AgentAssignmentData', additionalProperties: false }
)
export type AgentAssignmentData = Static<typeof agentAssignmentDataSchema>
export const agentAssignmentDataValidator = getValidator(agentAssignmentDataSchema, dataValidator)
export const agentAssignmentDataResolver = resolve<AgentAssignment, HookContext>({
  createdAt: async () => new Date().toISOString()
})

export const agentAssignmentPatchSchema = Type.Partial(Type.Omit(agentAssignmentSchema, ['_id', 'createdAt']), {
  $id: 'AgentAssignmentPatch'
})
export type AgentAssignmentPatch = Static<typeof agentAssignmentPatchSchema>
export const agentAssignmentPatchValidator = getValidator(agentAssignmentPatchSchema, dataValidator)
export const agentAssignmentPatchResolver = resolve<AgentAssignment, HookContext>({})

export const agentAssignmentQueryProperties = Type.Pick(agentAssignmentSchema, [
  '_id',
  'propertyId',
  'agentUserId',
  'commissionPercent',
  'createdAt'
])
export const agentAssignmentQuerySchema = Type.Intersect(
  [querySyntax(agentAssignmentQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type AgentAssignmentQuery = Static<typeof agentAssignmentQuerySchema>
export const agentAssignmentQueryValidator = getValidator(agentAssignmentQuerySchema, queryValidator)
export const agentAssignmentQueryResolver = resolve<AgentAssignmentQuery, HookContext>({})

