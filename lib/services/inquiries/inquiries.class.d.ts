import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Inquiry, InquiryData, InquiryPatch, InquiryQuery } from './inquiries.schema';
export type { Inquiry, InquiryData, InquiryPatch, InquiryQuery };
export interface InquiriesParams extends MongoDBAdapterParams<InquiryQuery> {
}
export declare class InquiriesService<ServiceParams extends Params = InquiriesParams> extends MongoDBService<Inquiry, InquiryData, InquiriesParams, InquiryPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
