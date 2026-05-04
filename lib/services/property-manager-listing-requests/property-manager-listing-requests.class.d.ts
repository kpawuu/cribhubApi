import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { PropertyManagerListingRequest, PropertyManagerListingRequestData, PropertyManagerListingRequestPatch, PropertyManagerListingRequestQuery } from './property-manager-listing-requests.schema';
export type { PropertyManagerListingRequest, PropertyManagerListingRequestData, PropertyManagerListingRequestPatch, PropertyManagerListingRequestQuery };
export interface PropertyManagerListingRequestsParams extends MongoDBAdapterParams<PropertyManagerListingRequestQuery> {
}
export declare class PropertyManagerListingRequestsService<ServiceParams extends Params = PropertyManagerListingRequestsParams> extends MongoDBService<PropertyManagerListingRequest, PropertyManagerListingRequestData, ServiceParams, PropertyManagerListingRequestPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
