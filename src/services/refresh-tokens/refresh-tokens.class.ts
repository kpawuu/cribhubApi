import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { RefreshTokens, RefreshTokensData, RefreshTokensPatch, RefreshTokensQuery } from './refresh-tokens.schema'

export type { RefreshTokens, RefreshTokensData, RefreshTokensPatch, RefreshTokensQuery }

export interface RefreshTokensParams extends MongoDBAdapterParams<RefreshTokensQuery> {}

export class RefreshTokensService<ServiceParams extends Params = RefreshTokensParams> extends MongoDBService<
  RefreshTokens,
  RefreshTokensData,
  RefreshTokensParams,
  RefreshTokensPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('refresh-tokens'))
  }
}

