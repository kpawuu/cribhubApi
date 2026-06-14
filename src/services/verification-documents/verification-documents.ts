import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import type { Application } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import type { HookContext } from '../../declarations'
import { deriveSubstage, loadDocumentsForRequest, type RoleKind } from '../../utils/role-applications'

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
        async (ctx: HookContext) => {
          if (!ctx.params.provider) return ctx
          const user = ctx.params.user as any
          const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
          if (roles.includes('admin')) return ctx

          // Landlords reviewing PM requests see all PM documents.
          if (roles.includes('landlord')) {
            const requests = (await ctx.app.service('role-requests').find(
              { paginate: false, query: { role: 'property_manager' } } as any,
              { provider: undefined } as any
            )) as unknown as any[]
            const ids = (requests || []).map((r) => r._id?.toString()).filter(Boolean)
            mergeQuery(ctx, { roleRequestId: { $in: ids } })
            return ctx
          }

          // Every other authenticated user can only see verification-documents
          // tied to their own role-requests.
          const uid = String(user?._id || '')
          if (!uid) return ctx
          const mine = (await ctx.app.service('role-requests').find(
            { paginate: false, query: { userId: uid } } as any,
            { provider: undefined } as any
          )) as unknown as any[]
          const ids = (mine || []).map((r) => r._id?.toString()).filter(Boolean)
          mergeQuery(ctx, { roleRequestId: { $in: ids } })
          return ctx
        }
      ],
      get: [authenticateIfExternal('jwt')],
      create: [
        authenticateIfExternal('jwt'),
        async (ctx: HookContext) => {
          // Applicants can only attach documents to their own role-requests.
          if (!ctx.params.provider) return ctx
          const user = ctx.params.user as any
          const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
          if (roles.includes('admin')) return ctx
          const targetId = String((ctx.data as any)?.roleRequestId || '')
          if (!targetId) return ctx
          const rr = (await ctx.app.service('role-requests').get(targetId, { provider: undefined } as any)) as any
          if (String(rr?.userId) !== String(user?._id)) {
            const { errors } = await import('@feathersjs/errors')
            throw new errors.Forbidden('You can only upload documents for your own application.')
          }
          return ctx
        },
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
    },
    after: {
      // Whenever an applicant uploads (or admin removes) a verification
      // document, re-derive the linked role-request's substage so the
      // dashboard banner moves from "docs required" to "submitted" or
      // "reviewing" without manual intervention.
      create: [recomputeParentSubstage],
      remove: [recomputeParentSubstage]
    }
  })
}

async function recomputeParentSubstage(context: HookContext) {
  try {
    const result = context.result as any
    const roleRequestId = String(result?.roleRequestId || '')
    if (!roleRequestId) return context
    const rr = (await (context.app as any)
      .service('role-requests')
      .get(roleRequestId, { provider: undefined } as any)) as any
    if (!rr || rr.status !== 'pending') return context
    const docs = await loadDocumentsForRequest(context.app, roleRequestId)
    const next = deriveSubstage({
      status: 'pending',
      role: rr.role as RoleKind,
      uploadedDocumentTypes: docs.map((d) => d.documentType),
      requestedExtras: Array.isArray(rr.requestedDocumentTypes) ? rr.requestedDocumentTypes : [],
      reviewerStartedAt: rr.reviewerStartedAt ?? null
    })
    if (next !== rr.substage) {
      await (context.app as any)
        .service('role-requests')
        .patch(roleRequestId, { substage: next }, { provider: undefined, skipSubstageRecompute: true } as any)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[verification-documents] parent substage recompute failed', e)
  }
  return context
}

declare module '../../declarations' {
  interface ServiceTypes {
    [verificationDocumentsPath]: VerificationDocumentsService
  }
}

