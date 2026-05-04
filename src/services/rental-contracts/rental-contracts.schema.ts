import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { RentalContractsService } from './rental-contracts.class'

export const rentalContractSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    unitId: Type.String(),
    landlordId: Type.String(),
    tenantId: Type.String(),
    contractType: Type.Optional(Type.Union([Type.Literal('ai_generated'), Type.Literal('manual_upload')])),
    content: Type.Optional(Type.String()),
    documentUrl: Type.Optional(Type.String()),
    status: Type.Optional(Type.Union([Type.Literal('draft'), Type.Literal('sent'), Type.Literal('signed'), Type.Literal('active'), Type.Literal('expired')])),
    landlordSignedAt: Type.Optional(Type.String({ format: 'date-time' })),
    tenantSignedAt: Type.Optional(Type.String({ format: 'date-time' })),
    startDate: Type.String(),
    endDate: Type.String(),
    monthlyRent: Type.Number(),
    rentCurrency: Type.Optional(Type.String({ default: 'GHS' })),
    lastPaidAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'RentalContract', additionalProperties: false }
)

export type RentalContract = Static<typeof rentalContractSchema>
export const rentalContractValidator = getValidator(rentalContractSchema, dataValidator)
export const rentalContractResolver = resolve<RentalContract, HookContext<RentalContractsService>>({})
export const rentalContractExternalResolver = resolve<RentalContract, HookContext<RentalContractsService>>({})

export const rentalContractDataSchema = Type.Object(
  {
    unitId: Type.String(),
    landlordId: Type.String(),
    tenantId: Type.String(),
    contractType: Type.Optional(Type.Union([Type.Literal('ai_generated'), Type.Literal('manual_upload')])),
    content: Type.Optional(Type.String()),
    documentUrl: Type.Optional(Type.String()),
    status: Type.Optional(Type.Union([Type.Literal('draft'), Type.Literal('sent'), Type.Literal('signed'), Type.Literal('active'), Type.Literal('expired')])),
    startDate: Type.String(),
    endDate: Type.String(),
    monthlyRent: Type.Number(),
    rentCurrency: Type.Optional(Type.String())
  },
  { $id: 'RentalContractData', additionalProperties: false }
)
export type RentalContractData = Static<typeof rentalContractDataSchema>
export const rentalContractDataValidator = getValidator(rentalContractDataSchema, dataValidator)
export const rentalContractDataResolver = resolve<RentalContract, HookContext<RentalContractsService>>({
  status: async (v) => v ?? 'draft',
  contractType: async (v) => v ?? 'ai_generated',
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const rentalContractPatchSchema = Type.Partial(
  Type.Omit(rentalContractSchema, ['_id', 'unitId', 'landlordId', 'tenantId', 'createdAt']),
  { $id: 'RentalContractPatch' }
)
export type RentalContractPatch = Static<typeof rentalContractPatchSchema>
export const rentalContractPatchValidator = getValidator(rentalContractPatchSchema, dataValidator)
export const rentalContractPatchResolver = resolve<RentalContract, HookContext<RentalContractsService>>({
  updatedAt: async () => new Date().toISOString()
})

export const rentalContractQueryProperties = Type.Pick(rentalContractSchema, [
  '_id',
  'unitId',
  'landlordId',
  'tenantId',
  'status',
  'createdAt',
  'updatedAt'
])
export const rentalContractQuerySchema = Type.Intersect(
  [querySyntax(rentalContractQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type RentalContractQuery = Static<typeof rentalContractQuerySchema>
export const rentalContractQueryValidator = getValidator(rentalContractQuerySchema, queryValidator)
export const rentalContractQueryResolver = resolve<RentalContractQuery, HookContext<RentalContractsService>>({})

