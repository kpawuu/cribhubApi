import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  PropertyManagerListingRequest,
  PropertyManagerListingRequestData,
  PropertyManagerListingRequestPatch,
  PropertyManagerListingRequestQuery
} from './property-manager-listing-requests.schema'

export type {
  PropertyManagerListingRequest,
  PropertyManagerListingRequestData,
  PropertyManagerListingRequestPatch,
  PropertyManagerListingRequestQuery
}

export interface PropertyManagerListingRequestsParams extends MongoDBAdapterParams<PropertyManagerListingRequestQuery> {}

export class PropertyManagerListingRequestsService<
  ServiceParams extends Params = PropertyManagerListingRequestsParams
> extends MongoDBService<
  PropertyManagerListingRequest,
  PropertyManagerListingRequestData,
  ServiceParams,
  PropertyManagerListingRequestPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('property_manager_listing_requests')),
    operators: ['$exists', '$in', '$nin', '$ne', '$and', '$or', '$nor', '$not', '$elemMatch']
  }
}
