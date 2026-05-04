import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { RefreshTokens, RefreshTokensData, RefreshTokensPatch, RefreshTokensQuery } from './refresh-tokens.schema';
export type { RefreshTokens, RefreshTokensData, RefreshTokensPatch, RefreshTokensQuery };
export interface RefreshTokensParams extends MongoDBAdapterParams<RefreshTokensQuery> {
}
export declare class RefreshTokensService<ServiceParams extends Params = RefreshTokensParams> extends MongoDBService<RefreshTokens, RefreshTokensData, RefreshTokensParams, RefreshTokensPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
