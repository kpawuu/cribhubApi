import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  PropertyManagerProfile,
  PropertyManagerProfileData,
  PropertyManagerProfilePatch,
  PropertyManagerProfileQuery
} from './property-manager-profiles.schema'

export type {
  PropertyManagerProfile,
  PropertyManagerProfileData,
  PropertyManagerProfilePatch,
  PropertyManagerProfileQuery
}

export interface PropertyManagerProfilesParams extends MongoDBAdapterParams<PropertyManagerProfileQuery> {}

export class PropertyManagerProfilesService<
  ServiceParams extends Params = PropertyManagerProfilesParams
> extends MongoDBService<
  PropertyManagerProfile,
  PropertyManagerProfileData,
  PropertyManagerProfilesParams,
  PropertyManagerProfilePatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('property_manager_profiles'))
  }
}
