import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  AgentListingRequest,
  AgentListingRequestData,
  AgentListingRequestPatch,
  AgentListingRequestQuery
} from './agent-listing-requests.schema'

export type { AgentListingRequest, AgentListingRequestData, AgentListingRequestPatch, AgentListingRequestQuery }

export interface AgentListingRequestsParams extends MongoDBAdapterParams<AgentListingRequestQuery> {}

export class AgentListingRequestsService<ServiceParams extends Params = AgentListingRequestsParams> extends MongoDBService<
  AgentListingRequest,
  AgentListingRequestData,
  AgentListingRequestsParams,
  AgentListingRequestPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('agent_listing_requests')),
    operators: ['$exists', '$in', '$nin', '$ne', '$and', '$or', '$nor', '$not', '$elemMatch']
  }
}
