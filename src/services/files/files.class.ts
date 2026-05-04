import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { FileRecord, FileRecordData, FileRecordPatch, FileRecordQuery } from './files.schema'

export type { FileRecord, FileRecordData, FileRecordPatch, FileRecordQuery }

export interface FilesParams extends MongoDBAdapterParams<FileRecordQuery> {}

export class FilesService<ServiceParams extends Params = FilesParams> extends MongoDBService<
  FileRecord,
  FileRecordData,
  FilesParams,
  FileRecordPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    multi: true,
    Model: app.get('mongodbClient').then((db) => db.collection('files'))
  }
}

