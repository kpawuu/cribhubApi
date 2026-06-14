import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'
import { createUserNotification } from '../../utils/create-user-notification'
import {
  deriveSubstage,
  loadDocumentsForRequest,
  missingDocumentTypes,
  REQUIRED_DOCUMENT_TYPES,
  type RoleKind
} from '../../utils/role-applications'

import { RoleRequestsService, getOptions } from './role-requests.class'
import {
  roleRequestResolver,
  roleRequestExternalResolver,
  roleRequestDataValidator,
  roleRequestDataResolver,
  roleRequestPatchValidator,
  roleRequestPatchResolver,
  roleRequestQueryValidator,
  roleRequestQueryResolver
} from './role-requests.schema'

export const roleRequestsPath = 'role-requests'
export const roleRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Fetch the IDs of all users with the admin role. */
async function getAdminUserIds(app: Application): Promise<string[]> {
  try {
    const rows = await (app as any).service('user-roles').find({
      paginate: false,
      query: { role: 'admin' }
    } as any, { provider: undefined } as any) as unknown as any[]
    return (rows || []).map((r: any) => r.userId?.toString()).filter(Boolean)
  } catch {
    return []
  }
}

const ROLE_LABEL: Record<string, string> = {
  landlord: 'Landlord',
  property_manager: 'Property Manager',
  agent: 'Agent'
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * find/get: admin sees all; authenticated users see only their own requests.
 */
const restrictFindToSelfOrAdmin = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context // admin sees everything

  // Non-admin: restrict to own requests
  const userId = user._id.toString()
  context.params.query = { ...(context.params.query || {}), userId }
  return context
}

/**
 * create: only allow the authenticated user to create a request for themselves.
 */
const restrictCreateToSelf = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  if ((context.data as any).userId !== user._id.toString()) {
    throw new errors.Forbidden('Cannot create role request for another user.')
  }
  return context
}

/**
 * Prevent duplicate pending requests for the same role from the same user.
 */
const preventDuplicateRequest = async (context: HookContext) => {
  if (!context.params.provider) return context
  const { userId, role } = context.data as any
  const existing = await context.app.service('role-requests').find({
    paginate: false,
    query: { userId, role, status: 'pending' }
  } as any, { provider: undefined } as any) as unknown as any[]
  if (existing?.length > 0) {
    throw new errors.Conflict(`You already have a pending ${ROLE_LABEL[role] || role} request.`)
  }
  return context
}

/**
 * after.create: grant role, notify user, and notify admins.
 */
const afterRoleRequestCreated = async (context: HookContext) => {
  const rr = context.result as any
  if (!rr) return context

  const userName: string = (context.params.user as any)?.fullName || (context.params.user as any)?.email || 'A user'
  const roleLabel = ROLE_LABEL[rr.role] || rr.role

  // Notify all admins about the new request
  const adminIds = await getAdminUserIds(context.app)
  await Promise.all(
    adminIds.map((adminId) =>
      createUserNotification(context.app, {
        userId: adminId,
        eventKey: 'role_request.created',
        category: 'roles',
        title: `New ${roleLabel} request`,
        body: `${userName} has requested the ${roleLabel} role and is awaiting your review.`,
        linkUrl: '/verification/role-requests',
        relatedService: 'role-requests',
        relatedId: String(rr._id)
      })
    )
  )

  return context
}

/**
 * after.patch: grant role on approval; notify the user in both cases. Also
 * keeps `substage` consistent with the new status and uploaded documents.
 *
 * When the recursive substage-recompute patch invokes this hook, it sets
 * `skipSubstageRecompute` to short-circuit — otherwise the approval /
 * rejection notification would fire twice (once for the real admin action,
 * once for the internal substage adjustment).
 */
const afterRoleRequestPatched = async (context: HookContext) => {
  if ((context.params as any)?.skipSubstageRecompute) return context
  const patched = context.result as any
  if (!patched?.status) return context

  // Grant the role when approved (idempotent: skip if already granted)
  if (patched.status === 'approved') {
    const existing = (await (context.app as any).service('user-roles').find({
      paginate: false,
      query: { userId: patched.userId, role: patched.role },
      provider: undefined
    })) as any
    const has = Array.isArray(existing) ? existing.length > 0 : (existing?.data?.length ?? 0) > 0
    if (!has) {
      await context.app.service('user-roles').create(
        { userId: patched.userId, role: patched.role },
        { provider: undefined } as any
      )
    }
  }

  // Recompute substage from the latest documents + status so the persisted
  // value never drifts from reality.
  try {
    const docs = await loadDocumentsForRequest(context.app, String(patched._id))
    const requestedExtras: string[] = Array.isArray(patched.requestedDocumentTypes) ? patched.requestedDocumentTypes : []
    const nextSubstage = deriveSubstage({
      status: patched.status,
      role: patched.role as RoleKind,
      uploadedDocumentTypes: docs.map((d) => d.documentType),
      requestedExtras,
      reviewerStartedAt: patched.reviewerStartedAt ?? null
    })
    if (nextSubstage !== patched.substage) {
      await (context.app as any).service('role-requests').patch(
        String(patched._id),
        { substage: nextSubstage },
        { provider: undefined, skipSubstageRecompute: true } as any
      )
      patched.substage = nextSubstage
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[role-requests] substage recompute failed', e)
  }

  const roleLabel = ROLE_LABEL[patched.role] || patched.role

  // Role-specific welcome deep-link
  const welcomeLink =
    patched.role === 'property_manager'
      ? '/pm/profile'
      : patched.role === 'agent'
        ? '/agent/profile'
        : patched.role === 'landlord'
          ? '/landlord/properties'
          : '/dashboard'

  const welcomeBody =
    patched.role === 'property_manager'
      ? 'You can now complete your manager profile, then browse listings and offer to manage them.'
      : patched.role === 'agent'
        ? 'You can now complete your agent profile, then browse listings and request to represent them.'
        : patched.role === 'landlord'
          ? 'You can now list properties, manage incoming requests, and coordinate with agents or property managers.'
          : `You now have full access to ${roleLabel.toLowerCase()} features.`

  if (patched.status === 'approved') {
    await createUserNotification(context.app, {
      userId: patched.userId,
      eventKey: 'role_request.approved',
      category: 'roles',
      title: `${roleLabel} role approved! 🎉`,
      body: welcomeBody,
      linkUrl: welcomeLink,
      relatedService: 'role-requests',
      relatedId: String(patched._id)
    })
  } else if (patched.status === 'rejected') {
    await createUserNotification(context.app, {
      userId: patched.userId,
      eventKey: 'role_request.rejected',
      category: 'roles',
      title: `${roleLabel} request not approved`,
      body: patched.notes
        ? `Your ${roleLabel} request was not approved. Admin note: "${patched.notes}"`
        : `Your request for the ${roleLabel} role was not approved. Contact support if you believe this is an error.`,
      linkUrl: '/dashboard',
      relatedService: 'role-requests',
      relatedId: String(patched._id)
    })
  }

  // If an admin patched in extra document requests, ping the applicant.
  // We compare against `context.data.requestedDocumentTypes` (what the admin
  // sent) rather than the resolved value to detect a real change vs. echo.
  const sentReqDocs = (context.data as any)?.requestedDocumentTypes
  if (
    patched.status === 'pending' &&
    Array.isArray(sentReqDocs) &&
    sentReqDocs.length > 0 &&
    !(context.params as any)?.skipSubstageRecompute
  ) {
    const missing = missingDocumentTypes(
      patched.role as RoleKind,
      [],
      sentReqDocs as string[]
    )
    await createUserNotification(context.app, {
      userId: patched.userId,
      eventKey: 'role_request.document_requested',
      category: 'roles',
      title: `Action needed on your ${roleLabel} application`,
      body: `Our reviewer needs ${missing.length} more document(s) before they can decide. Open your application to upload them.`,
      linkUrl: '/applications/role-requests',
      relatedService: 'role-requests',
      relatedId: String(patched._id),
      metadata: { requestedDocumentTypes: sentReqDocs }
    })
  }

  return context
}

// ── Service registration ──────────────────────────────────────────────────────

export const roleRequests = (app: Application) => {
  app.use(roleRequestsPath, new RoleRequestsService(getOptions(app)), {
    methods: roleRequestsMethods as any,
    events: []
  })

  app.service(roleRequestsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(roleRequestExternalResolver), schemaHooks.resolveResult(roleRequestResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(roleRequestQueryValidator), schemaHooks.resolveQuery(roleRequestQueryResolver)],

      // Users can see their own requests; admins see all
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFindToSelfOrAdmin],
      get: [authenticateIfExternal('jwt'), populateRoles, restrictFindToSelfOrAdmin],

      create: [
        authenticateIfExternal('jwt'),
        restrictCreateToSelf,
        preventDuplicateRequest,
        schemaHooks.validateData(roleRequestDataValidator),
        schemaHooks.resolveData(roleRequestDataResolver)
      ],

      patch: [
        authenticateIfExternal('jwt'),
        requireRole('admin'),
        schemaHooks.validateData(roleRequestPatchValidator),
        schemaHooks.resolveData(roleRequestPatchResolver),
        async (ctx: HookContext) => {
          const u = ctx.params.user as any
          ;(ctx.data as any).reviewedBy = u?._id?.toString()
        },
        async (ctx: HookContext) => {
          // First time an admin touches a pending request, stamp
          // `reviewerStartedAt` so the dashboard banner can advance from
          // "submitted" to "reviewing".
          if (!ctx.id) return ctx
          try {
            const existing = (await (ctx.app as any).service('role-requests').get(String(ctx.id), {
              provider: undefined
            } as any)) as any
            if (existing && !existing.reviewerStartedAt && existing.status === 'pending') {
              ;(ctx.data as any).reviewerStartedAt = new Date().toISOString()
            }
          } catch {
            /* best effort */
          }
          return ctx
        }
      ],

      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    },
    after: {
      create: [afterRoleRequestCreated],
      patch: [afterRoleRequestPatched]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [roleRequestsPath]: RoleRequestsService
  }
}
