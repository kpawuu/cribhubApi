import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const payoutStatusSchema = Type.Union([
  Type.Literal('pending'),
  Type.Literal('paid'),
  Type.Literal('cancelled')
])

export const payoutTriggerSchema = Type.Union([
  Type.Literal('rent_consummated'),
  Type.Literal('sale_consummated'),
  Type.Literal('first_month_paid'),
  Type.Literal('each_renewal'),
  Type.Literal('monthly_rent_collected'),
  Type.Literal('manual')
])

export const agentPayoutSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    unitId: Type.Optional(Type.String()),
    landlordId: Type.String(),
    agentUserId: Type.String(),
    assignmentId: Type.String(),
    /** Reference to the source rental contract / payment if any. */
    contractId: Type.Optional(Type.String()),
    paymentId: Type.Optional(Type.String()),
    /** Base amount (e.g. rent or sale price) the fee is calculated against. */
    baseAmount: Type.Optional(Type.Number({ minimum: 0 })),
    /** Computed payout amount in `currency`. */
    amount: Type.Number({ minimum: 0 }),
    currency: Type.String({ maxLength: 6 }),
    /** Snapshot of the fee unit at the time of creation (rent/sale). */
    feeSnapshot: Type.Optional(Type.Any()),
    trigger: payoutTriggerSchema,
    status: payoutStatusSchema,
    paidAt: Type.Optional(Type.String({ format: 'date-time' })),
    paidBy: Type.Optional(Type.String()),
    paidNote: Type.Optional(Type.String({ maxLength: 1000 })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    /** Virtual: agent profile (loaded via ?include=agent). */
    agent: Type.Optional(Type.Any())
  },
  { $id: 'AgentPayout', additionalProperties: false }
)

export type AgentPayout = Static<typeof agentPayoutSchema>
export const agentPayoutValidator = getValidator(agentPayoutSchema, dataValidator)
export const agentPayoutResolver = resolve<AgentPayout, HookContext>({})

async function shouldInclude(context: HookContext, key: string): Promise<boolean> {
  const inc = (context.params as any)?.$include ?? (context.params?.query as any)?.$include
  if (!inc) return false
  if (typeof inc === 'string') return inc.split(',').map((s) => s.trim()).includes(key)
  if (Array.isArray(inc)) return inc.includes(key)
  return false
}

export const agentPayoutExternalResolver = resolve<AgentPayout, HookContext>({
  agent: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'agent'))) return undefined
    const uid = String((row as any).agentUserId || '')
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

export const agentPayoutDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    unitId: Type.Optional(Type.String()),
    agentUserId: Type.String(),
    assignmentId: Type.String(),
    contractId: Type.Optional(Type.String()),
    paymentId: Type.Optional(Type.String()),
    baseAmount: Type.Optional(Type.Number({ minimum: 0 })),
    amount: Type.Number({ minimum: 0 }),
    currency: Type.String({ maxLength: 6 }),
    feeSnapshot: Type.Optional(Type.Any()),
    trigger: payoutTriggerSchema,
    /** Auto-derived from the property's `landlordId` by the `populateLandlordOnCreate` hook. */
    landlordId: Type.Optional(Type.String())
  },
  { $id: 'AgentPayoutData', additionalProperties: false }
)
export type AgentPayoutData = Static<typeof agentPayoutDataSchema>
export const agentPayoutDataValidator = getValidator(agentPayoutDataSchema, dataValidator)
export const agentPayoutDataResolver = resolve<AgentPayout, HookContext>({
  status: async () => 'pending' as const,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const agentPayoutPatchSchema = Type.Partial(
  Type.Object({
    status: payoutStatusSchema,
    paidAt: Type.Optional(Type.String({ format: 'date-time' })),
    paidBy: Type.Optional(Type.String()),
    paidNote: Type.Optional(Type.String({ maxLength: 1000 }))
  }),
  { $id: 'AgentPayoutPatch', additionalProperties: false }
)
export type AgentPayoutPatch = Static<typeof agentPayoutPatchSchema>
export const agentPayoutPatchValidator = getValidator(agentPayoutPatchSchema, dataValidator)
export const agentPayoutPatchResolver = resolve<AgentPayout, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const agentPayoutQueryProperties = Type.Pick(agentPayoutSchema, [
  '_id',
  'propertyId',
  'unitId',
  'agentUserId',
  'landlordId',
  'assignmentId',
  'status',
  'trigger',
  'createdAt'
])
export const agentPayoutQuerySchema = Type.Intersect(
  [querySyntax(agentPayoutQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type AgentPayoutQuery = Static<typeof agentPayoutQuerySchema>
export const agentPayoutQueryValidator = getValidator(agentPayoutQuerySchema, queryValidator)
export const agentPayoutQueryResolver = resolve<AgentPayoutQuery, HookContext>({})
