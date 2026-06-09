import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { PmRating, PmRatingData, PmRatingPatch, PmRatingQuery } from './pm-ratings.schema'

export type { PmRating, PmRatingData, PmRatingPatch, PmRatingQuery }

export interface PmRatingsParams extends MongoDBAdapterParams<PmRatingQuery> {}

export class PmRatingsService<ServiceParams extends Params = PmRatingsParams> extends MongoDBService<
  PmRating,
  PmRatingData,
  PmRatingsParams,
  PmRatingPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('pm_ratings'))
  }
}
