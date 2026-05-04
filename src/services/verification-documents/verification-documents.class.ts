import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  VerificationDocument,
  VerificationDocumentData,
  VerificationDocumentPatch,
  VerificationDocumentQuery
} from './verification-documents.schema'

export type { VerificationDocument, VerificationDocumentData, VerificationDocumentPatch, VerificationDocumentQuery }

export interface VerificationDocumentsParams extends MongoDBAdapterParams<VerificationDocumentQuery> {}

export class VerificationDocumentsService<ServiceParams extends Params = VerificationDocumentsParams> extends MongoDBService<
  VerificationDocument,
  VerificationDocumentData,
  VerificationDocumentsParams,
  VerificationDocumentPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('verification_documents'))
  }
}

