import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ExchangeRatesService } from './exchange-rates.class'

export const exchangeRateSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    landlordId: Type.String(),
    baseCurrency: Type.Optional(Type.String({ default: 'GHS' })),
    targetCurrency: Type.String(),
    rate: Type.Number(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'ExchangeRate', additionalProperties: false }
)

export type ExchangeRate = Static<typeof exchangeRateSchema>
export const exchangeRateValidator = getValidator(exchangeRateSchema, dataValidator)
export const exchangeRateResolver = resolve<ExchangeRate, HookContext<ExchangeRatesService>>({})
export const exchangeRateExternalResolver = resolve<ExchangeRate, HookContext<ExchangeRatesService>>({})

export const exchangeRateDataSchema = Type.Object(
  {
    /** Required for `property_manager` when setting rates for a landlord portfolio. */
    landlordId: Type.Optional(Type.String()),
    baseCurrency: Type.Optional(Type.String()),
    targetCurrency: Type.String(),
    rate: Type.Number()
  },
  { $id: 'ExchangeRateData', additionalProperties: false }
)
export type ExchangeRateData = Static<typeof exchangeRateDataSchema>
export const exchangeRateDataValidator = getValidator(exchangeRateDataSchema, dataValidator)
export const exchangeRateDataResolver = resolve<ExchangeRate, HookContext<ExchangeRatesService>>({
  baseCurrency: async (v) => v ?? 'GHS',
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const exchangeRatePatchSchema = Type.Partial(Type.Omit(exchangeRateSchema, ['_id', 'landlordId', 'createdAt']), {
  $id: 'ExchangeRatePatch'
})
export type ExchangeRatePatch = Static<typeof exchangeRatePatchSchema>
export const exchangeRatePatchValidator = getValidator(exchangeRatePatchSchema, dataValidator)
export const exchangeRatePatchResolver = resolve<ExchangeRate, HookContext<ExchangeRatesService>>({
  updatedAt: async () => new Date().toISOString()
})

export const exchangeRateQueryProperties = Type.Pick(exchangeRateSchema, ['_id', 'landlordId', 'baseCurrency', 'targetCurrency'])
export const exchangeRateQuerySchema = Type.Intersect(
  [querySyntax(exchangeRateQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type ExchangeRateQuery = Static<typeof exchangeRateQuerySchema>
export const exchangeRateQueryValidator = getValidator(exchangeRateQuerySchema, queryValidator)
export const exchangeRateQueryResolver = resolve<ExchangeRateQuery, HookContext<ExchangeRatesService>>({})

