import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  RentalApplication,
  RentalApplicationData,
  RentalApplicationPatch,
  RentalApplicationQuery
} from './rental-applications.schema'

export type { RentalApplication, RentalApplicationData, RentalApplicationPatch, RentalApplicationQuery }

export interface RentalApplicationsParams extends MongoDBAdapterParams<RentalApplicationQuery> {}

export class RentalApplicationsService<ServiceParams extends Params = RentalApplicationsParams> extends MongoDBService<
  RentalApplication,
  RentalApplicationData,
  RentalApplicationsParams,
  RentalApplicationPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('rental_applications'))
  }
}

