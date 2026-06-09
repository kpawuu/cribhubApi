import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { errors } from '@feathersjs/errors'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { feeProposalSchema, deriveLegacyCommissionPercent } from '../fee-proposal-shared'

export const agentListingRequestStatusSchema = Type.Union([
  Type.Literal('pending'),
  Type.Literal('countered'),
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
    /** Legacy single-percent field. Mirrored from `proposal.rent.value` when type is percent. */
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    message: Type.Optional(Type.String({ maxLength: 4000 })),
    status: agentListingRequestStatusSchema,
    /** Initial fee proposal from the agent. */
    proposal: Type.Optional(feeProposalSchema),
    /** Landlord counter-offer (present when status = 'countered'). */
    counter: Type.Optional(feeProposalSchema),
    /** Final agreed terms (set when status moves to 'accepted'). */
    acceptedTerms: Type.Optional(feeProposalSchema),
    reviewedBy: Type.Optional(Type.String()),
    reviewedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    /** Virtual: full agent profile (loaded via ?include=agent). */
    agent: Type.Optional(Type.Any()),
    property: Type.Optional(Type.Any()),
    thread: Type.Optional(Type.Any())
  },
  { $id: 'AgentListingRequest', additionalProperties: false }
)

export type AgentListingRequest = Static<typeof agentListingRequestSchema>
export const agentListingRequestValidator = getValidator(agentListingRequestSchema, dataValidator)
export const agentListingRequestResolver = resolve<AgentListingRequest, HookContext>({})

async function shouldInclude(context: HookContext, key: string): Promise<boolean> {
  const inc = (context.params as any)?.$include ?? (context.params?.query as any)?.$include
  if (!inc) return false
  if (typeof inc === 'string') return inc.split(',').map((s) => s.trim()).includes(key)
  if (Array.isArray(inc)) return inc.includes(key)
  return false
}

export const agentListingRequestExternalResolver = resolve<AgentListingRequest, HookContext>({
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
  }),
  property: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'property'))) return undefined
    try {
      return await context.app.service('properties').get(String((row as any).propertyId), { provider: undefined } as any)
    } catch {
      return null
    }
  }),
  thread: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'thread'))) return undefined
    const db = await context.app.get('mongodbClient')
    return await db.collection('threads').findOne({
      kind: 'landlord-agent',
      propertyId: String((row as any).propertyId || ''),
      participantIds: { $all: [String((row as any).landlordId || ''), String((row as any).agentUserId || '')] }
    } as any)
  })
})

/** External create: agent proposes representation on a listing. */
export const agentListingRequestDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    /** Optional legacy short-hand; if `proposal.rent` is provided it takes precedence. */
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    message: Type.Optional(Type.String({ maxLength: 4000 })),
    proposal: Type.Optional(feeProposalSchema),
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
  },
  proposal: async (value, data, context) => {
    const uid = (context.params.user as any)?._id?.toString?.()
    // Build a default proposal from commissionPercent for backward compat.
    if (!value && typeof (data as any)?.commissionPercent === 'number') {
      return {
        rent: { type: 'percent', value: Number((data as any).commissionPercent) },
        proposedByUserId: uid,
        at: new Date().toISOString()
      }
    }
    if (!value) return undefined
    const v = value as any
    return { ...v, proposedByUserId: v.proposedByUserId || uid, at: v.at || new Date().toISOString() }
  },
  commissionPercent: async (value, _d, _ctx) => value
})

export const agentListingRequestPatchSchema = Type.Object(
  {
    status: Type.Optional(
      Type.Union([
        Type.Literal('countered'),
        Type.Literal('accepted'),
        Type.Literal('rejected'),
        Type.Literal('withdrawn')
      ])
    ),
    counter: Type.Optional(feeProposalSchema),
    proposal: Type.Optional(feeProposalSchema),
    acceptedTerms: Type.Optional(feeProposalSchema),
    /** Mirrored from `acceptedTerms.rent.value` when type is `percent`; kept in sync by `restrictPatch`. */
    commissionPercent: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    message: Type.Optional(Type.String({ maxLength: 4000 })),
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

export { deriveLegacyCommissionPercent }
