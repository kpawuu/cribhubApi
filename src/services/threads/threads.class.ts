import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Thread, ThreadData, ThreadPatch, ThreadQuery } from './threads.schema'

export type { Thread, ThreadData, ThreadPatch, ThreadQuery }

export interface ThreadsParams extends MongoDBAdapterParams<ThreadQuery> {}

export class ThreadsService<ServiceParams extends Params = ThreadsParams> extends MongoDBService<
  Thread,
  ThreadData,
  ThreadsParams,
  ThreadPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('threads')),
    operators: ['$exists', '$in', '$nin', '$ne', '$and', '$or', '$nor', '$not', '$elemMatch']
  }
}
