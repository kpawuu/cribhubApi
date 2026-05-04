import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { RentalContract, RentalContractData, RentalContractPatch, RentalContractQuery } from './rental-contracts.schema'

export type { RentalContract, RentalContractData, RentalContractPatch, RentalContractQuery }

export interface RentalContractsParams extends MongoDBAdapterParams<RentalContractQuery> {}

export class RentalContractsService<ServiceParams extends Params = RentalContractsParams> extends MongoDBService<
  RentalContract,
  RentalContractData,
  RentalContractsParams,
  RentalContractPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('rental_contracts'))
  }
}

