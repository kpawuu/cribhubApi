import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Property, PropertyData, PropertyPatch, PropertyQuery } from './properties.schema'

export type { Property, PropertyData, PropertyPatch, PropertyQuery }

export interface PropertiesParams extends MongoDBAdapterParams<PropertyQuery> {}

export class PropertiesService<ServiceParams extends Params = PropertiesParams> extends MongoDBService<
  Property,
  PropertyData,
  PropertiesParams,
  PropertyPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('properties')),
    operators: ['$regex', '$options', '$text', '$elemMatch', '$exists', '$type', '$size', '$all', '$and', '$or', '$nor', '$not']
  }
}

