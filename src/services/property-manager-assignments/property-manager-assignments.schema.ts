import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { errors } from '@feathersjs/errors'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { feeProposalSchema } from '../fee-proposal-shared'

export const propertyManagerAssignmentSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    managerUserId: Type.String(),
    landlordId: Type.String(),
    assignedBy: Type.Optional(Type.String()),
    /** Mirrored from the listing-request `acceptedTerms` (or set by admin on direct assignment). */
    acceptedTerms: Type.Optional(feeProposalSchema),
    sourceRequestId: Type.Optional(Type.String()),
    createdAt: Type.String({ format: 'date-time' }),
    /** Virtual: full property manager profile (loaded on demand via ?include=manager). */
    manager: Type.Optional(Type.Any())
  },
  { $id: 'PropertyManagerAssignment', additionalProperties: false }
)

export type PropertyManagerAssignment = Static<typeof propertyManagerAssignmentSchema>
export const propertyManagerAssignmentValidator = getValidator(propertyManagerAssignmentSchema, dataValidator)
export const propertyManagerAssignmentResolver = resolve<PropertyManagerAssignment, HookContext>({})

async function shouldInclude(context: HookContext, key: string): Promise<boolean> {
  const inc = (context.params as any)?.$include ?? (context.params?.query as any)?.$include
  if (!inc) return false
  if (typeof inc === 'string') return inc.split(',').map((s) => s.trim()).includes(key)
  if (Array.isArray(inc)) return inc.includes(key)
  return false
}

export const propertyManagerAssignmentExternalResolver = resolve<PropertyManagerAssignment, HookContext>({
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
  })
})

export const propertyManagerAssignmentDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    managerUserId: Type.String(),
    acceptedTerms: Type.Optional(feeProposalSchema),
    sourceRequestId: Type.Optional(Type.String())
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
  Type.Object({
    acceptedTerms: Type.Optional(feeProposalSchema)
  }),
  { $id: 'PropertyManagerAssignmentPatch', additionalProperties: false }
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
