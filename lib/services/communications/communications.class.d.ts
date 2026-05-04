import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Communication, CommunicationData, CommunicationPatch, CommunicationQuery } from './communications.schema';
export type { Communication, CommunicationData, CommunicationPatch, CommunicationQuery };
export interface CommunicationsParams extends MongoDBAdapterParams<CommunicationQuery> {
}
export declare class CommunicationsService<ServiceParams extends Params = CommunicationsParams> extends MongoDBService<Communication, CommunicationData, CommunicationsParams, CommunicationPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
