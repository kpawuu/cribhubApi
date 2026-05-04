import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Communication, CommunicationData, CommunicationPatch, CommunicationQuery } from './communications.schema'

export type { Communication, CommunicationData, CommunicationPatch, CommunicationQuery }

export interface CommunicationsParams extends MongoDBAdapterParams<CommunicationQuery> {}

export class CommunicationsService<ServiceParams extends Params = CommunicationsParams> extends MongoDBService<
  Communication,
  CommunicationData,
  CommunicationsParams,
  CommunicationPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('communications'))
  }
}

