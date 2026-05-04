import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { AgentListingRequest, AgentListingRequestData, AgentListingRequestPatch, AgentListingRequestQuery } from './agent-listing-requests.schema';
export type { AgentListingRequest, AgentListingRequestData, AgentListingRequestPatch, AgentListingRequestQuery };
export interface AgentListingRequestsParams extends MongoDBAdapterParams<AgentListingRequestQuery> {
}
export declare class AgentListingRequestsService<ServiceParams extends Params = AgentListingRequestsParams> extends MongoDBService<AgentListingRequest, AgentListingRequestData, AgentListingRequestsParams, AgentListingRequestPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
