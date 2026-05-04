import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { SitePage, SitePageData, SitePagePatch, SitePageQuery } from './site-pages.schema';
export type { SitePage, SitePageData, SitePagePatch, SitePageQuery };
export interface SitePagesParams extends MongoDBAdapterParams<SitePageQuery> {
}
export declare class SitePagesService<ServiceParams extends Params = SitePagesParams> extends MongoDBService<SitePage, SitePageData, SitePagesParams, SitePagePatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
