import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { FilesService } from './files.class'

export const filesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    entityId: Type.String(),
    entityType: Type.String(),
    fileName: Type.String(),
    fileType: Type.String(),
    fileSize: Type.Optional(Type.Number()),
    fileUrl: Type.String(),
    fileHash: Type.Optional(Type.String()),
    fileExtension: Type.Optional(Type.String()),
    tags: Type.Optional(Type.Array(Type.String())),
    metadata: Type.Optional(Type.Any()),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'FileRecord', additionalProperties: false }
)

export type FileRecord = Static<typeof filesSchema>
export const filesValidator = getValidator(filesSchema, dataValidator)
export const filesResolver = resolve<FileRecord, HookContext<FilesService>>({})
export const filesExternalResolver = resolve<FileRecord, HookContext<FilesService>>({})

export const filesDataSchema = Type.Pick(filesSchema, ['entityId', 'entityType', 'fileName', 'fileType', 'fileSize', 'fileUrl', 'fileHash', 'fileExtension', 'tags', 'metadata'], {
  $id: 'FileRecordData'
})
export type FileRecordData = Static<typeof filesDataSchema>
export const filesDataValidator = getValidator(filesDataSchema, dataValidator)
export const filesDataResolver = resolve<FileRecord, HookContext<FilesService>>({
  createdAt: async () => new Date().toISOString()
})

export const filesPatchSchema = Type.Partial(Type.Omit(filesSchema, ['_id', 'createdAt']), { $id: 'FileRecordPatch' })
export type FileRecordPatch = Static<typeof filesPatchSchema>
export const filesPatchValidator = getValidator(filesPatchSchema, dataValidator)
export const filesPatchResolver = resolve<FileRecord, HookContext<FilesService>>({})

export const filesQueryProperties = Type.Pick(filesSchema, ['_id', 'entityId', 'entityType'])
export const filesQuerySchema = Type.Intersect([querySyntax(filesQueryProperties), Type.Object({}, { additionalProperties: true })], {
  additionalProperties: true
})
export type FileRecordQuery = Static<typeof filesQuerySchema>
export const filesQueryValidator = getValidator(filesQuerySchema, queryValidator)
export const filesQueryResolver = resolve<FileRecordQuery, HookContext<FilesService>>({})

