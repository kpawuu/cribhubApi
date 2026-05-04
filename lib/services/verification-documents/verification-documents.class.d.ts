import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { VerificationDocument, VerificationDocumentData, VerificationDocumentPatch, VerificationDocumentQuery } from './verification-documents.schema';
export type { VerificationDocument, VerificationDocumentData, VerificationDocumentPatch, VerificationDocumentQuery };
export interface VerificationDocumentsParams extends MongoDBAdapterParams<VerificationDocumentQuery> {
}
export declare class VerificationDocumentsService<ServiceParams extends Params = VerificationDocumentsParams> extends MongoDBService<VerificationDocument, VerificationDocumentData, VerificationDocumentsParams, VerificationDocumentPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
