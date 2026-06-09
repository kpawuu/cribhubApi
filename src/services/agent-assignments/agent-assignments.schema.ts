import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { feeProposalSchema, deriveLegacyCommissionPercent } from '../fee-proposal-shared'

export const agentAssignmentSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    agentUserId: Type.String(),
    assignedBy: Type.Optional(Type.String()),
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: Type.Optional(Type.String({ maxLength: 4000 })),
    /** Final agreed fee terms (copied from the source listing request's acceptedTerms). */
    acceptedTerms: Type.Optional(feeProposalSchema),
    sourceRequestId: Type.Optional(Type.String()),
    createdAt: Type.String({ format: 'date-time' }),
    /** Virtual: full agent profile (loaded on demand via ?include=agent). */
    agent: Type.Optional(Type.Any())
  },
  { $id: 'AgentAssignment', additionalProperties: false }
)

export type AgentAssignment = Static<typeof agentAssignmentSchema>
export const agentAssignmentValidator = getValidator(agentAssignmentSchema, dataValidator)
export const agentAssignmentResolver = resolve<AgentAssignment, HookContext>({})

async function shouldInclude(context: HookContext, key: string): Promise<boolean> {
  const inc = (context.params as any)?.$include ?? (context.params?.query as any)?.$include
  if (!inc) return false
  if (typeof inc === 'string') return inc.split(',').map((s) => s.trim()).includes(key)
  if (Array.isArray(inc)) return inc.includes(key)
  return false
}

export const agentAssignmentExternalResolver = resolve<AgentAssignment, HookContext>({
  agent: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'agent'))) return undefined
    const uid = String((row as any).agentUserId || '')
    if (!uid) return undefined
    try {
      const res = (await context.app.service('agent-profiles').find({
        query: { userId: uid, $limit: 1 },
        paginate: false,
        provider: undefined
      } as any)) as any
      const arr = Array.isArray(res) ? res : res?.data || []
      return arr[0] || null
    } catch {
      return null
    }
  })
})

export const agentAssignmentDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    agentUserId: Type.String(),
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: Type.Optional(Type.String({ maxLength: 4000 })),
    acceptedTerms: Type.Optional(feeProposalSchema),
    sourceRequestId: Type.Optional(Type.String())
  },
  { $id: 'AgentAssignmentData', additionalProperties: false }
)
export type AgentAssignmentData = Static<typeof agentAssignmentDataSchema>
export const agentAssignmentDataValidator = getValidator(agentAssignmentDataSchema, dataValidator)
export const agentAssignmentDataResolver = resolve<AgentAssignment, HookContext>({
  createdAt: async () => new Date().toISOString(),
  // Keep legacy commissionPercent in sync with acceptedTerms.rent (percent type).
  commissionPercent: async (value, data) => {
    if (typeof value === 'number') return value
    const cp = deriveLegacyCommissionPercent((data as any)?.acceptedTerms)
    return typeof cp === 'number' ? cp : undefined
  },
  // If old client supplied only commissionPercent, synthesize acceptedTerms so new
  // UI (payouts, fee summary, etc.) renders consistently.
  acceptedTerms: async (value, data) => {
    if (value && typeof value === 'object') return value as any
    const cp = (data as any)?.commissionPercent
    if (typeof cp !== 'number') return undefined
    return { rent: { type: 'percent', value: cp } } as any
  }
})

export const agentAssignmentPatchSchema = Type.Partial(
  Type.Object({
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    agreementNote: Type.Optional(Type.String({ maxLength: 4000 })),
    acceptedTerms: Type.Optional(feeProposalSchema)
  }),
  { $id: 'AgentAssignmentPatch' }
)
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
