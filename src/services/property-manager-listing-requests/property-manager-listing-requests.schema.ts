import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { errors } from '@feathersjs/errors'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { feeProposalSchema, deriveLegacyCommissionPercent } from '../fee-proposal-shared'

export const pmListingRequestStatusSchema = Type.Union([
  Type.Literal('pending'),
  Type.Literal('countered'),
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
    /** Initial fee proposal from the PM. */
    proposal: Type.Optional(feeProposalSchema),
    /** Landlord counter-offer (present when status = 'countered'). */
    counter: Type.Optional(feeProposalSchema),
    /** Final agreed terms (set when status moves to 'accepted'). */
    acceptedTerms: Type.Optional(feeProposalSchema),
    reviewedBy: Type.Optional(Type.String()),
    reviewedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    /** Virtual: full property manager profile (loaded on demand via ?include=manager). */
    manager: Type.Optional(Type.Any()),
    /** Virtual: property snapshot. */
    property: Type.Optional(Type.Any()),
    /** Virtual: lightweight thread between landlord & manager, when one exists. */
    thread: Type.Optional(Type.Any())
  },
  { $id: 'PropertyManagerListingRequest', additionalProperties: false }
)

export type PropertyManagerListingRequest = Static<typeof propertyManagerListingRequestSchema>
export const propertyManagerListingRequestValidator = getValidator(propertyManagerListingRequestSchema, dataValidator)
export const propertyManagerListingRequestResolver = resolve<PropertyManagerListingRequest, HookContext>({})

async function shouldInclude(context: HookContext, key: string): Promise<boolean> {
  const inc = (context.params as any)?.$include ?? (context.params?.query as any)?.$include
  if (!inc) return false
  if (typeof inc === 'string') return inc.split(',').map((s) => s.trim()).includes(key)
  if (Array.isArray(inc)) return inc.includes(key)
  return false
}

export const propertyManagerListingRequestExternalResolver = resolve<PropertyManagerListingRequest, HookContext>({
  manager: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'manager'))) return undefined
    const uid = String((row as any).managerUserId || '')
    if (!uid) return undefined
    try {
      const res = (await context.app.service('property-manager-profiles').find({
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
    const pid = String((row as any).propertyId || '')
    if (!pid) return undefined
    try {
      return await context.app.service('properties').get(pid, { provider: undefined } as any)
    } catch {
      return null
    }
  }),
  thread: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'thread'))) return undefined
    const db = await context.app.get('mongodbClient')
    const t = await db.collection('threads').findOne({
      kind: 'landlord-pm',
      propertyId: String((row as any).propertyId || ''),
      participantIds: { $all: [String((row as any).landlordId || ''), String((row as any).managerUserId || '')] }
    } as any)
    return t || null
  })
})

export const propertyManagerListingRequestDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    message: Type.Optional(Type.String({ maxLength: 4000 })),
    /** Initial fee proposal from the PM. */
    proposal: Type.Optional(feeProposalSchema),
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
  },
  proposal: async (value, _d, context) => {
    if (!value) return undefined
    const v = value as any
    const uid = (context.params.user as any)?._id?.toString?.()
    return { ...v, proposedByUserId: v.proposedByUserId || uid, at: v.at || new Date().toISOString() }
  }
})

export const propertyManagerListingRequestPatchSchema = Type.Object(
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
    message: Type.Optional(Type.String({ maxLength: 4000 })),
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

export { deriveLegacyCommissionPercent }
