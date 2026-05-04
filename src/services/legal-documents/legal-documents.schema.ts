import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { LegalDocumentsService } from './legal-documents.class'

export const legalDocumentSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: Type.String(),
    title: Type.String(),
    documentType: Type.String(),
    jurisdiction: Type.Optional(Type.String()),
    status: Type.Optional(Type.Union([Type.Literal('draft'), Type.Literal('final')])),
    content: Type.String(),
    metadata: Type.Optional(Type.Any()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'LegalDocument', additionalProperties: false }
)

export type LegalDocument = Static<typeof legalDocumentSchema>
export const legalDocumentValidator = getValidator(legalDocumentSchema, dataValidator)
export const legalDocumentResolver = resolve<LegalDocument, HookContext<LegalDocumentsService>>({})
export const legalDocumentExternalResolver = resolve<LegalDocument, HookContext<LegalDocumentsService>>({})

export const legalDocumentDataSchema = Type.Object(
  {
    title: Type.String(),
    documentType: Type.String(),
    jurisdiction: Type.Optional(Type.String()),
    content: Type.String(),
    metadata: Type.Optional(Type.Any())
  },
  { $id: 'LegalDocumentData', additionalProperties: false }
)

export type LegalDocumentData = Static<typeof legalDocumentDataSchema>
export const legalDocumentDataValidator = getValidator(legalDocumentDataSchema, dataValidator)
export const legalDocumentDataResolver = resolve<LegalDocument, HookContext<LegalDocumentsService>>({
  status: async () => 'draft' as const,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const legalDocumentPatchSchema = Type.Partial(Type.Omit(legalDocumentSchema, ['_id', 'userId', 'createdAt']), {
  $id: 'LegalDocumentPatch'
})
export type LegalDocumentPatch = Static<typeof legalDocumentPatchSchema>
export const legalDocumentPatchValidator = getValidator(legalDocumentPatchSchema, dataValidator)
export const legalDocumentPatchResolver = resolve<LegalDocument, HookContext<LegalDocumentsService>>({
  updatedAt: async () => new Date().toISOString()
})

export const legalDocumentQueryProperties = Type.Pick(legalDocumentSchema, ['_id', 'userId', 'status', 'documentType', 'createdAt', 'updatedAt'])
export const legalDocumentQuerySchema = Type.Intersect(
  [querySyntax(legalDocumentQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type LegalDocumentQuery = Static<typeof legalDocumentQuerySchema>
export const legalDocumentQueryValidator = getValidator(legalDocumentQuerySchema, queryValidator)
export const legalDocumentQueryResolver = resolve<LegalDocumentQuery, HookContext<LegalDocumentsService>>({})

