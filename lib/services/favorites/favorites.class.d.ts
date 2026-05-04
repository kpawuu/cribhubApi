import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Favorite, FavoriteData, FavoritePatch, FavoriteQuery } from './favorites.schema';
export type { Favorite, FavoriteData, FavoritePatch, FavoriteQuery };
export interface FavoritesParams extends MongoDBAdapterParams<FavoriteQuery> {
}
export declare class FavoritesService<ServiceParams extends Params = FavoritesParams> extends MongoDBService<Favorite, FavoriteData, ServiceParams, FavoritePatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
