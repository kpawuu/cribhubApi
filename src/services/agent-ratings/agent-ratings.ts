import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { authenticate } from '@feathersjs/authentication'
import { ObjectId } from 'mongodb'

import type { Application, HookContext } from '../../declarations'
import { authenticateIfJwtPresent } from '../../hooks/authenticate-if-jwt-present'
import { populateRoles } from '../../hooks/populate-roles'
import { AgentRatingsService, getOptions } from './agent-ratings.class'
import {
  agentRatingResolver,
  agentRatingExternalResolver,
  agentRatingDataValidator,
  agentRatingDataResolver,
  agentRatingPatchValidator,
  agentRatingPatchResolver,
  agentRatingQueryValidator,
  agentRatingQueryResolver
} from './agent-ratings.schema'

export const agentRatingsPath = 'agent-ratings'
export const agentRatingsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

// ──────────────────────────────────────────────────────────────────
// After any write: recompute ratingAvg + ratingCount on the
// agent-profile document via direct MongoDB (bypasses schema hooks).
// ──────────────────────────────────────────────────────────────────
async function syncAgentRatingSummary(context: HookContext): Promise<HookContext> {
  // Determine the agentProfileId from the written/deleted record.
  const record = Array.isArray(context.result)
    ? context.result[0]
    : (context.result as any)
  const agentProfileId: string = record?.agentProfileId ?? (context.data as any)?.agentProfileId ?? ''

  if (!agentProfileId) return context

  try {
    // Aggregate directly via MongoDB to avoid going through service query
    // validators (which don't allow `$exists` on the boolean `hidden` field)
    // AND the agent-profiles patch validators.
    const db = await context.app.get('mongodbClient')

    const visibleFilter = {
      agentProfileId,
      $or: [{ hidden: { $exists: false } }, { hidden: false }]
    } as any

    const all = (await db.collection('agent_ratings').find(visibleFilter, {
      projection: { rating: 1 },
      limit: 10000
    } as any).toArray()) as any[]

    const count = all.length
    const avg =
      count > 0
        ? Number((all.reduce((s: number, r: any) => s + (Number(r.rating) || 0), 0) / count).toFixed(2))
        : 0

    const id = agentProfileId
    const filter = ObjectId.isValid(id) && id.length === 24 ? { _id: new ObjectId(id) } : { _id: id as any }

    await db.collection('agent_profiles').updateOne(filter, {
      $set: { ratingAvg: avg, ratingCount: count, updatedAt: new Date().toISOString() }
    })
  } catch (err) {
    // Non-fatal: log but don't block the response.
    console.error('[agent-ratings] syncAgentRatingSummary error:', err)
  }

  return context
}

// ──────────────────────────────────────────────────────────────────
// Before create: attach userId + reviewerName; enforce one-per-user.
// ──────────────────────────────────────────────────────────────────
const attachUserAndEnforceUnique = async (context: HookContext): Promise<HookContext> => {
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  // NOTE: do NOT touch context.data here — agentRatingDataSchema has
  // additionalProperties: false, so any extra field (e.g. userId) added
  // before validateData will fail validation.  userId is injected by the
  // resolver (agentRatingDataResolver) which runs after validation.

  const userId = user._id.toString()
  const agentProfileId = (context.data as any).agentProfileId
  if (!agentProfileId) throw new errors.BadRequest('agentProfileId is required')

  // Reject duplicate submissions.
  const existing = (await context.app.service(agentRatingsPath).find({
    paginate: false,
    query: { agentProfileId, userId, $limit: 1 }
  }) as unknown) as any[]

  if (existing.length > 0) {
    throw new errors.Conflict('You have already rated this agent. Update your existing review instead.', {
      existingId: existing[0]._id?.toString()
    })
  }

  return context
}

// ──────────────────────────────────────────────────────────────────
// Before patch/remove: only the owner (or admin) may modify.
// Owners cannot toggle moderation fields.
// ──────────────────────────────────────────────────────────────────
const restrictToOwner = async (context: HookContext): Promise<HookContext> => {
  if (!context.params.provider) return context

  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const isAdmin = roles.includes('admin')

  if (!isAdmin) {
    const existing = await context.app
      .service(agentRatingsPath)
      .get(context.id as any, { provider: undefined } as any)
    if ((existing as any).userId !== user._id.toString()) {
      throw new errors.Forbidden('You can only modify your own reviews.')
    }
    // Strip moderation fields from non-admin patches.
    if (context.method === 'patch' && context.data && typeof context.data === 'object') {
      delete (context.data as any).hidden
      delete (context.data as any).moderationNote
    }
  } else if (context.method === 'patch' && context.data && typeof context.data === 'object') {
    const d = context.data as any
    // Stamp hiddenBy/hiddenAt when an admin toggles `hidden`.
    if (d.hidden === true) {
      d.hiddenAt = new Date().toISOString()
      d.hiddenBy = user._id.toString()
    } else if (d.hidden === false) {
      d.hiddenAt = null as any
      d.hiddenBy = null as any
    }
  }
  return context
}

// ──────────────────────────────────────────────────────────────────
// Public find: hide reviews where `hidden=true` unless admin or
// requesting your own review. Applied as an after-find filter so it
// works regardless of mongo query operator validation quirks.
// ──────────────────────────────────────────────────────────────────
const hideModeratedFromPublic = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  const uid = user?._id?.toString?.()
  const keep = (r: any): boolean => {
    if (!r?.hidden) return true
    if (uid && String(r.userId) === uid) return true
    return false
  }

  const result = context.result as any
  if (Array.isArray(result)) {
    context.result = result.filter(keep)
  } else if (result && Array.isArray(result.data)) {
    result.data = result.data.filter(keep)
    if (typeof result.total === 'number') {
      result.total = Math.max(0, result.total - (Array.isArray(result.data) ? 0 : 0))
    }
  }
  return context
}

// ──────────────────────────────────────────────────────────────────
// Service registration
// ──────────────────────────────────────────────────────────────────
export const agentRatings = (app: Application) => {
  app.use(agentRatingsPath, new AgentRatingsService(getOptions(app)), {
    methods: agentRatingsMethods as any,
    events: []
  })

  app.service(agentRatingsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(agentRatingExternalResolver),
        schemaHooks.resolveResult(agentRatingResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(agentRatingQueryValidator),
        schemaHooks.resolveQuery(agentRatingQueryResolver)
      ],
      // Public browse: anyone can list reviews; admins see hidden ones too.
      find: [authenticateIfJwtPresent(), populateRoles],
      get: [authenticateIfJwtPresent(), populateRoles],
      create: [
        authenticate('jwt'),
        attachUserAndEnforceUnique,
        schemaHooks.validateData(agentRatingDataValidator),
        schemaHooks.resolveData(agentRatingDataResolver)
      ],
      patch: [
        authenticate('jwt'),
        populateRoles,
        restrictToOwner,
        schemaHooks.validateData(agentRatingPatchValidator),
        schemaHooks.resolveData(agentRatingPatchResolver)
      ],
      remove: [authenticate('jwt'), populateRoles, restrictToOwner]
    },
    after: {
      find: [hideModeratedFromPublic],
      create: [syncAgentRatingSummary],
      patch: [syncAgentRatingSummary],
      remove: [syncAgentRatingSummary]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [agentRatingsPath]: AgentRatingsService
  }
}
