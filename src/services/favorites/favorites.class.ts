import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Favorite, FavoriteData, FavoritePatch, FavoriteQuery } from './favorites.schema'

export type { Favorite, FavoriteData, FavoritePatch, FavoriteQuery }

export interface FavoritesParams extends MongoDBAdapterParams<FavoriteQuery> {}

export class FavoritesService<ServiceParams extends Params = FavoritesParams> extends MongoDBService<
  Favorite,
  FavoriteData,
  ServiceParams,
  FavoritePatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('favorites'))
  }
}
