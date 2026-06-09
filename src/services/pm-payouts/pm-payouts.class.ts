import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { PmPayout, PmPayoutData, PmPayoutPatch, PmPayoutQuery } from './pm-payouts.schema'

export type { PmPayout, PmPayoutData, PmPayoutPatch, PmPayoutQuery }

export interface PmPayoutsParams extends MongoDBAdapterParams<PmPayoutQuery> {}

export class PmPayoutsService<ServiceParams extends Params = PmPayoutsParams> extends MongoDBService<
  PmPayout,
  PmPayoutData,
  PmPayoutsParams,
  PmPayoutPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('pm_payouts'))
  }
}
