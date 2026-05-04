import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UnitsService } from './units.class'
import { resolveEntityFiles } from '../../utils/resolveEntityFiles'

export const unitSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    propertyId: Type.String(),
    unitNumber: Type.String(),
    bedrooms: Type.Number(),
    bathrooms: Type.Number(),
    squareFeet: Type.Optional(Type.Number()),
    rentAmount: Type.Number(),
    rentCurrency: Type.Optional(Type.String({ default: 'GHS' })),
    status: Type.Optional(Type.Union([Type.Literal('vacant'), Type.Literal('occupied'), Type.Literal('maintenance')])),
    tenantId: Type.Optional(Type.String()),
    leaseStart: Type.Optional(Type.String()),
    leaseEnd: Type.Optional(Type.String()),
    // listing support
    listingType: Type.Optional(Type.Union([Type.Literal('rental'), Type.Literal('sale')])),
    salePrice: Type.Optional(Type.Number()),
    mortgageEligible: Type.Optional(Type.Boolean()),
    mortgagePartner: Type.Optional(Type.String()),
    images: Type.Optional(Type.Array(Type.String())),
    files: Type.Optional(Type.Array(Type.Any())),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'Unit', additionalProperties: false }
)

export type Unit = Static<typeof unitSchema>
export const unitValidator = getValidator(unitSchema, dataValidator)
export const unitResolver = resolve<Unit, HookContext<UnitsService>>({})
export const unitExternalResolver = resolve<Unit, HookContext<UnitsService>>({
  files: async (_value, unit, context) => {
    const id = (unit as any)?._id?.toString?.() ?? ''
    if (!id) return []
    return await resolveEntityFiles(context.app, 'units', id)
  }
})

export const unitDataSchema = Type.Object(
  {
    propertyId: Type.String(),
    unitNumber: Type.String(),
    bedrooms: Type.Number(),
    bathrooms: Type.Number(),
    squareFeet: Type.Optional(Type.Number()),
    rentAmount: Type.Number(),
    rentCurrency: Type.Optional(Type.String()),
    status: Type.Optional(Type.Union([Type.Literal('vacant'), Type.Literal('occupied'), Type.Literal('maintenance')])),
    tenantId: Type.Optional(Type.String()),
    leaseStart: Type.Optional(Type.String()),
    leaseEnd: Type.Optional(Type.String()),
    listingType: Type.Optional(Type.Union([Type.Literal('rental'), Type.Literal('sale')])),
    salePrice: Type.Optional(Type.Number()),
    mortgageEligible: Type.Optional(Type.Boolean()),
    mortgagePartner: Type.Optional(Type.String()),
    images: Type.Optional(Type.Array(Type.String()))
  },
  { $id: 'UnitData', additionalProperties: false }
)
export type UnitData = Static<typeof unitDataSchema>
export const unitDataValidator = getValidator(unitDataSchema, dataValidator)
export const unitDataResolver = resolve<Unit, HookContext<UnitsService>>({
  status: async () => 'vacant' as const,
  listingType: async (v) => (v ?? 'rental'),
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const unitPatchSchema = Type.Partial(Type.Omit(unitSchema, ['_id', 'createdAt']), { $id: 'UnitPatch' })
export type UnitPatch = Static<typeof unitPatchSchema>
export const unitPatchValidator = getValidator(unitPatchSchema, dataValidator)
export const unitPatchResolver = resolve<Unit, HookContext<UnitsService>>({
  updatedAt: async () => new Date().toISOString()
})

export const unitQueryProperties = Type.Pick(unitSchema, [
  '_id',
  'propertyId',
  'unitNumber',
  'status',
  'tenantId',
  'listingType',
  'createdAt',
  'updatedAt'
])
export const unitQuerySchema = Type.Intersect(
  [querySyntax(unitQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type UnitQuery = Static<typeof unitQuerySchema>
export const unitQueryValidator = getValidator(unitQuerySchema, queryValidator)
export const unitQueryResolver = resolve<UnitQuery, HookContext<UnitsService>>({})

