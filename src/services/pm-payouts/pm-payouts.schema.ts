import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const pmPayoutStatusSchema = Type.Union([
  Type.Literal('pending'),
  Type.Literal('paid'),
  Type.Literal('cancelled')
])

export const pmPayoutTriggerSchema = Type.Union([
  Type.Literal('rent_consummated'),
  Type.Literal('sale_consummated'),
  Type.Literal('first_month_paid'),
  Type.Literal('each_renewal'),
  Type.Literal('monthly_rent_collected'),
  Type.Literal('manual')
])

export const pmPayoutSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    unitId: Type.Optional(Type.String()),
    landlordId: Type.String(),
    managerUserId: Type.String(),
    assignmentId: Type.String(),
    contractId: Type.Optional(Type.String()),
    paymentId: Type.Optional(Type.String()),
    baseAmount: Type.Optional(Type.Number({ minimum: 0 })),
    amount: Type.Number({ minimum: 0 }),
    currency: Type.String({ maxLength: 6 }),
    feeSnapshot: Type.Optional(Type.Any()),
    trigger: pmPayoutTriggerSchema,
    status: pmPayoutStatusSchema,
    paidAt: Type.Optional(Type.String({ format: 'date-time' })),
    paidBy: Type.Optional(Type.String()),
    paidNote: Type.Optional(Type.String({ maxLength: 1000 })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    manager: Type.Optional(Type.Any())
  },
  { $id: 'PmPayout', additionalProperties: false }
)

export type PmPayout = Static<typeof pmPayoutSchema>
export const pmPayoutValidator = getValidator(pmPayoutSchema, dataValidator)
export const pmPayoutResolver = resolve<PmPayout, HookContext>({})

async function shouldInclude(context: HookContext, key: string): Promise<boolean> {
  const inc = (context.params as any)?.$include ?? (context.params?.query as any)?.$include
  if (!inc) return false
  if (typeof inc === 'string') return inc.split(',').map((s) => s.trim()).includes(key)
  if (Array.isArray(inc)) return inc.includes(key)
  return false
}

export const pmPayoutExternalResolver = resolve<PmPayout, HookContext>({
  manager: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'manager'))) return undefined
    const uid = String((row as any).managerUserId || '')
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

export const pmPayoutDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    unitId: Type.Optional(Type.String()),
    managerUserId: Type.String(),
    assignmentId: Type.String(),
    contractId: Type.Optional(Type.String()),
    paymentId: Type.Optional(Type.String()),
    baseAmount: Type.Optional(Type.Number({ minimum: 0 })),
    amount: Type.Number({ minimum: 0 }),
    currency: Type.String({ maxLength: 6 }),
    feeSnapshot: Type.Optional(Type.Any()),
    trigger: pmPayoutTriggerSchema,
    /** Auto-derived from the property's `landlordId` by the `populateLandlordOnCreate` hook. */
    landlordId: Type.Optional(Type.String())
  },
  { $id: 'PmPayoutData', additionalProperties: false }
)
export type PmPayoutData = Static<typeof pmPayoutDataSchema>
export const pmPayoutDataValidator = getValidator(pmPayoutDataSchema, dataValidator)
export const pmPayoutDataResolver = resolve<PmPayout, HookContext>({
  status: async () => 'pending' as const,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const pmPayoutPatchSchema = Type.Partial(
  Type.Object({
    status: pmPayoutStatusSchema,
    paidAt: Type.Optional(Type.String({ format: 'date-time' })),
    paidBy: Type.Optional(Type.String()),
    paidNote: Type.Optional(Type.String({ maxLength: 1000 }))
  }),
  { $id: 'PmPayoutPatch', additionalProperties: false }
)
export type PmPayoutPatch = Static<typeof pmPayoutPatchSchema>
export const pmPayoutPatchValidator = getValidator(pmPayoutPatchSchema, dataValidator)
export const pmPayoutPatchResolver = resolve<PmPayout, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const pmPayoutQueryProperties = Type.Pick(pmPayoutSchema, [
  '_id',
  'propertyId',
  'unitId',
  'managerUserId',
  'landlordId',
  'assignmentId',
  'status',
  'trigger',
  'createdAt'
])
export const pmPayoutQuerySchema = Type.Intersect(
  [querySyntax(pmPayoutQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type PmPayoutQuery = Static<typeof pmPayoutQuerySchema>
export const pmPayoutQueryValidator = getValidator(pmPayoutQuerySchema, queryValidator)
export const pmPayoutQueryResolver = resolve<PmPayoutQuery, HookContext>({})
