import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Unit, UnitData, UnitPatch, UnitQuery } from './units.schema'

export type { Unit, UnitData, UnitPatch, UnitQuery }

export interface UnitsParams extends MongoDBAdapterParams<UnitQuery> {}

export class UnitsService<ServiceParams extends Params = UnitsParams> extends MongoDBService<Unit, UnitData, UnitsParams, UnitPatch> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('units')),
    operators: ['$regex', '$options', '$exists', '$elemMatch', '$and', '$or', '$nor', '$not']
  }
}

