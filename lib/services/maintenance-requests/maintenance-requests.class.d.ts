import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { MaintenanceRequest, MaintenanceRequestData, MaintenanceRequestPatch, MaintenanceRequestQuery } from './maintenance-requests.schema';
export type { MaintenanceRequest, MaintenanceRequestData, MaintenanceRequestPatch, MaintenanceRequestQuery };
export interface MaintenanceRequestsParams extends MongoDBAdapterParams<MaintenanceRequestQuery> {
}
export declare class MaintenanceRequestsService<ServiceParams extends Params = MaintenanceRequestsParams> extends MongoDBService<MaintenanceRequest, MaintenanceRequestData, MaintenanceRequestsParams, MaintenanceRequestPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
