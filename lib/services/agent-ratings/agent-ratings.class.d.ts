import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { AgentRating, AgentRatingData, AgentRatingPatch, AgentRatingQuery } from './agent-ratings.schema';
export type { AgentRating, AgentRatingData, AgentRatingPatch, AgentRatingQuery };
export interface AgentRatingsParams extends MongoDBAdapterParams<AgentRatingQuery> {
}
export declare class AgentRatingsService<ServiceParams extends Params = AgentRatingsParams> extends MongoDBService<AgentRating, AgentRatingData, AgentRatingsParams, AgentRatingPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
