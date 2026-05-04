import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Property, PropertyData, PropertyPatch, PropertyQuery } from './properties.schema';
export type { Property, PropertyData, PropertyPatch, PropertyQuery };
export interface PropertiesParams extends MongoDBAdapterParams<PropertyQuery> {
}
export declare class PropertiesService<ServiceParams extends Params = PropertiesParams> extends MongoDBService<Property, PropertyData, PropertiesParams, PropertyPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
