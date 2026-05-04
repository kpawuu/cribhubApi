import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { LegalDocument, LegalDocumentData, LegalDocumentPatch, LegalDocumentQuery } from './legal-documents.schema';
export type { LegalDocument, LegalDocumentData, LegalDocumentPatch, LegalDocumentQuery };
export interface LegalDocumentsParams extends MongoDBAdapterParams<LegalDocumentQuery> {
}
export declare class LegalDocumentsService<ServiceParams extends Params = LegalDocumentsParams> extends MongoDBService<LegalDocument, LegalDocumentData, LegalDocumentsParams, LegalDocumentPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
