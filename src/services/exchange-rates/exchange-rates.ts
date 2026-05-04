import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { restrictQueryToOwner } from '../../hooks/restrict-query-to-owner'

import { ExchangeRatesService, getOptions } from './exchange-rates.class'
import {
  exchangeRateResolver,
  exchangeRateExternalResolver,
  exchangeRateDataValidator,
  exchangeRateDataResolver,
  exchangeRatePatchValidator,
  exchangeRatePatchResolver,
  exchangeRateQueryValidator,
  exchangeRateQueryResolver
} from './exchange-rates.schema'

export const exchangeRatesPath = 'exchange-rates'
export const exchangeRatesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const attachLandlordId = async (context: HookContext) => {
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
  const data = context.data as any
  if (roles.includes('admin')) {
    const lid = data.landlordId != null ? String(data.landlordId).trim() : ''
    data.landlordId = lid || user?._id?.toString()
    return context
  }
  if (roles.includes('property_manager')) {
    const lid = data.landlordId != null ? String(data.landlordId).trim() : ''
    if (!lid) throw new errors.BadRequest('landlordId is required')
    data.landlordId = lid
    return context
  }
  data.landlordId = user?._id?.toString()
  return context
}

export const exchangeRates = (app: Application) => {
  app.use(exchangeRatesPath, new ExchangeRatesService(getOptions(app)), {
    methods: exchangeRatesMethods as any,
    events: []
  })

  app.service(exchangeRatesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(exchangeRateExternalResolver), schemaHooks.resolveResult(exchangeRateResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(exchangeRateQueryValidator), schemaHooks.resolveQuery(exchangeRateQueryResolver)],
      find: [authenticateIfExternal('jwt'), restrictQueryToOwner('landlordId', ['admin', 'property_manager'])],
      get: [authenticateIfExternal('jwt')],
      create: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin', 'property_manager'),
        schemaHooks.validateData(exchangeRateDataValidator),
        schemaHooks.resolveData(exchangeRateDataResolver),
        attachLandlordId
      ],
      patch: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin', 'property_manager'),
        schemaHooks.validateData(exchangeRatePatchValidator),
        schemaHooks.resolveData(exchangeRatePatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [exchangeRatesPath]: ExchangeRatesService
  }
}

