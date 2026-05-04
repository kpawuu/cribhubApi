import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Notice, NoticeData, NoticePatch, NoticeQuery } from './notices.schema';
export type { Notice, NoticeData, NoticePatch, NoticeQuery };
export interface NoticesParams extends MongoDBAdapterParams<NoticeQuery> {
}
export declare class NoticesService<ServiceParams extends Params = NoticesParams> extends MongoDBService<Notice, NoticeData, NoticesParams, NoticePatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
