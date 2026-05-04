import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import type { Application } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import type { HookContext } from '../../declarations'

import { VerificationDocumentsService, getOptions } from './verification-documents.class'
import {
  verificationDocumentResolver,
  verificationDocumentExternalResolver,
  verificationDocumentDataValidator,
  verificationDocumentDataResolver,
  verificationDocumentPatchValidator,
  verificationDocumentPatchResolver,
  verificationDocumentQueryValidator,
  verificationDocumentQueryResolver
} from './verification-documents.schema'

export const verificationDocumentsPath = 'verification-documents'
export const verificationDocumentsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const verificationDocuments = (app: Application) => {
  app.use(verificationDocumentsPath, new VerificationDocumentsService(getOptions(app)), {
    methods: verificationDocumentsMethods as any,
    events: []
  })

  app.service(verificationDocumentsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(verificationDocumentExternalResolver), schemaHooks.resolveResult(verificationDocumentResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(verificationDocumentQueryValidator), schemaHooks.resolveQuery(verificationDocumentQueryResolver)],
      find: [
        authenticateIfExternal('jwt'),
        requireRole('admin', 'landlord'),
        async (ctx: HookContext) => {
          // Landlords should only see property_manager documents
          const roles: string[] = Array.isArray((ctx.params.user as any)?.roles) ? ((ctx.params.user as any).roles as string[]) : []
          if (!roles.includes('landlord') || roles.includes('admin')) return ctx

          const requests = (await ctx.app.service('role-requests').find(
            { paginate: false, query: { role: 'property_manager' } } as any,
            { provider: undefined } as any
          )) as unknown as any[]
          const ids = (requests || []).map((r) => r._id?.toString()).filter(Boolean)
          mergeQuery(ctx, { roleRequestId: { $in: ids } })
          return ctx
        }
      ],
      get: [authenticateIfExternal('jwt'), requireRole('admin', 'landlord')],
      create: [
        authenticateIfExternal('jwt'),
        schemaHooks.validateData(verificationDocumentDataValidator),
        schemaHooks.resolveData(verificationDocumentDataResolver)
      ],
      patch: [
        authenticateIfExternal('jwt'),
        requireRole('admin'),
        schemaHooks.validateData(verificationDocumentPatchValidator),
        schemaHooks.resolveData(verificationDocumentPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [verificationDocumentsPath]: VerificationDocumentsService
  }
}

