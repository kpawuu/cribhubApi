import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  VirtualViewingRequest,
  VirtualViewingRequestData,
  VirtualViewingRequestPatch,
  VirtualViewingRequestQuery
} from './virtual-viewing-requests.schema'

export type { VirtualViewingRequest, VirtualViewingRequestData, VirtualViewingRequestPatch, VirtualViewingRequestQuery }

export interface VirtualViewingRequestsParams extends MongoDBAdapterParams<VirtualViewingRequestQuery> {}

export class VirtualViewingRequestsService<ServiceParams extends Params = VirtualViewingRequestsParams> extends MongoDBService<
  VirtualViewingRequest,
  VirtualViewingRequestData,
  VirtualViewingRequestsParams,
  VirtualViewingRequestPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('virtual_viewing_requests'))
  }
}

