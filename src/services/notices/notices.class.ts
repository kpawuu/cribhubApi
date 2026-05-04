import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Notice, NoticeData, NoticePatch, NoticeQuery } from './notices.schema'

export type { Notice, NoticeData, NoticePatch, NoticeQuery }

export interface NoticesParams extends MongoDBAdapterParams<NoticeQuery> {}

export class NoticesService<ServiceParams extends Params = NoticesParams> extends MongoDBService<Notice, NoticeData, NoticesParams, NoticePatch> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('notices'))
  }
}

