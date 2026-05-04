import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PaymentsService } from './payments.class'

export const paymentSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    tenantId: Type.String(),
    landlordId: Type.String(),
    unitId: Type.String(),
    amount: Type.Number(),
    currency: Type.Optional(Type.String({ default: 'GHS' })),
    reference: Type.String(),
    status: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('success'), Type.Literal('failed')])),
    channel: Type.Optional(Type.String()),
    paidAt: Type.Optional(Type.String({ format: 'date-time' })),
    isManualEntry: Type.Optional(Type.Boolean()),
    payerName: Type.Optional(Type.String()),
    payerPhone: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Any()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'Payment', additionalProperties: false }
)

export type Payment = Static<typeof paymentSchema>
export const paymentValidator = getValidator(paymentSchema, dataValidator)
export const paymentResolver = resolve<Payment, HookContext<PaymentsService>>({})
export const paymentExternalResolver = resolve<Payment, HookContext<PaymentsService>>({})

// For manual entries (landlord)
export const paymentDataSchema = Type.Object(
  {
    tenantId: Type.String(),
    unitId: Type.String(),
    /** Required for `property_manager` manual entries; optional for admins (defaults to self). */
    landlordId: Type.Optional(Type.String()),
    amount: Type.Number(),
    currency: Type.Optional(Type.String()),
    reference: Type.Optional(Type.String()),
    paidAt: Type.Optional(Type.String({ format: 'date-time' })),
    payerName: Type.Optional(Type.String()),
    payerPhone: Type.Optional(Type.String())
  },
  { $id: 'PaymentData', additionalProperties: false }
)

export type PaymentData = Static<typeof paymentDataSchema>
export const paymentDataValidator = getValidator(paymentDataSchema, dataValidator)
export const paymentDataResolver = resolve<Payment, HookContext<PaymentsService>>({
  status: async () => 'success' as const,
  isManualEntry: async () => true,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const paymentPatchSchema = Type.Partial(
  Type.Object({
    status: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('success'), Type.Literal('failed')])),
    channel: Type.Optional(Type.String()),
    paidAt: Type.Optional(Type.String({ format: 'date-time' })),
    metadata: Type.Optional(Type.Any())
  }),
  { $id: 'PaymentPatch', additionalProperties: false }
)
export type PaymentPatch = Static<typeof paymentPatchSchema>
export const paymentPatchValidator = getValidator(paymentPatchSchema, dataValidator)
export const paymentPatchResolver = resolve<Payment, HookContext<PaymentsService>>({
  updatedAt: async () => new Date().toISOString()
})

export const paymentQueryProperties = Type.Pick(paymentSchema, [
  '_id',
  'tenantId',
  'landlordId',
  'unitId',
  'status',
  'reference',
  'createdAt',
  'updatedAt'
])
export const paymentQuerySchema = Type.Intersect(
  [querySyntax(paymentQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type PaymentQuery = Static<typeof paymentQuerySchema>
export const paymentQueryValidator = getValidator(paymentQuerySchema, queryValidator)
export const paymentQueryResolver = resolve<PaymentQuery, HookContext<PaymentsService>>({})

