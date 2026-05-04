import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { VerificationDocumentsService } from './verification-documents.class'
import { resolveEntityFiles } from '../../utils/resolveEntityFiles'

export const verificationDocumentSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    roleRequestId: Type.String(),
    documentType: Type.String(),
    documentUrl: Type.String(),
    files: Type.Optional(Type.Array(Type.Any())),
    uploadedAt: Type.String({ format: 'date-time' })
  },
  { $id: 'VerificationDocument', additionalProperties: false }
)

export type VerificationDocument = Static<typeof verificationDocumentSchema>
export const verificationDocumentValidator = getValidator(verificationDocumentSchema, dataValidator)
export const verificationDocumentResolver = resolve<VerificationDocument, HookContext<VerificationDocumentsService>>({})
export const verificationDocumentExternalResolver = resolve<VerificationDocument, HookContext<VerificationDocumentsService>>({
  files: async (_value, doc, context) => {
    const id = (doc as any)?._id?.toString?.() ?? ''
    if (!id) return []
    return await resolveEntityFiles(context.app, 'verification-documents', id)
  }
})

export const verificationDocumentDataSchema = Type.Object(
  {
    roleRequestId: Type.String(),
    documentType: Type.String(),
    documentUrl: Type.String()
  },
  { $id: 'VerificationDocumentData', additionalProperties: false }
)
export type VerificationDocumentData = Static<typeof verificationDocumentDataSchema>
export const verificationDocumentDataValidator = getValidator(verificationDocumentDataSchema, dataValidator)
export const verificationDocumentDataResolver = resolve<VerificationDocument, HookContext<VerificationDocumentsService>>({
  uploadedAt: async () => new Date().toISOString()
})

export const verificationDocumentPatchSchema = Type.Partial(Type.Omit(verificationDocumentSchema, ['_id', 'uploadedAt']), {
  $id: 'VerificationDocumentPatch'
})
export type VerificationDocumentPatch = Static<typeof verificationDocumentPatchSchema>
export const verificationDocumentPatchValidator = getValidator(verificationDocumentPatchSchema, dataValidator)
export const verificationDocumentPatchResolver = resolve<VerificationDocument, HookContext<VerificationDocumentsService>>({})

export const verificationDocumentQueryProperties = Type.Pick(verificationDocumentSchema, ['_id', 'roleRequestId', 'documentType'])
export const verificationDocumentQuerySchema = Type.Intersect(
  [querySyntax(verificationDocumentQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type VerificationDocumentQuery = Static<typeof verificationDocumentQuerySchema>
export const verificationDocumentQueryValidator = getValidator(verificationDocumentQuerySchema, queryValidator)
export const verificationDocumentQueryResolver = resolve<VerificationDocumentQuery, HookContext<VerificationDocumentsService>>({})

