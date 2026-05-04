import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { ExchangeRate, ExchangeRateData, ExchangeRatePatch, ExchangeRateQuery } from './exchange-rates.schema'

export type { ExchangeRate, ExchangeRateData, ExchangeRatePatch, ExchangeRateQuery }

export interface ExchangeRatesParams extends MongoDBAdapterParams<ExchangeRateQuery> {}

export class ExchangeRatesService<ServiceParams extends Params = ExchangeRatesParams> extends MongoDBService<
  ExchangeRate,
  ExchangeRateData,
  ExchangeRatesParams,
  ExchangeRatePatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('exchange_rates'))
  }
}

