import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'

import { LegalDocumentsService, getOptions } from './legal-documents.class'
import {
  legalDocumentResolver,
  legalDocumentExternalResolver,
  legalDocumentDataValidator,
  legalDocumentDataResolver,
  legalDocumentPatchValidator,
  legalDocumentPatchResolver,
  legalDocumentQueryValidator,
  legalDocumentQueryResolver
} from './legal-documents.schema'

export const legalDocumentsPath = 'legal-documents'
export const legalDocumentsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const attachUser = async (context: HookContext) => {
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  ;(context.data as any).userId = user._id.toString()
  return context
}

export const legalDocuments = (app: Application) => {
  app.use(legalDocumentsPath, new LegalDocumentsService(getOptions(app)), {
    methods: legalDocumentsMethods as any,
    events: []
  })

  app.service(legalDocumentsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(legalDocumentExternalResolver), schemaHooks.resolveResult(legalDocumentResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(legalDocumentQueryValidator), schemaHooks.resolveQuery(legalDocumentQueryResolver)],
      find: [
        authenticateIfExternal('jwt'),
        async (ctx: HookContext) => {
          const u = ctx.params.user as any
          mergeQuery(ctx, { userId: u._id.toString() })
        }
      ],
      get: [authenticateIfExternal('jwt')],
      create: [
        authenticateIfExternal('jwt'),
        schemaHooks.validateData(legalDocumentDataValidator),
        schemaHooks.resolveData(legalDocumentDataResolver),
        attachUser
      ],
      patch: [authenticateIfExternal('jwt'), schemaHooks.validateData(legalDocumentPatchValidator), schemaHooks.resolveData(legalDocumentPatchResolver)],
      remove: [authenticateIfExternal('jwt')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [legalDocumentsPath]: LegalDocumentsService
  }
}

