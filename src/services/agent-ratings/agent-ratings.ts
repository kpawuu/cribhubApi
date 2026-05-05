import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { authenticate } from '@feathersjs/authentication'
import { ObjectId } from 'mongodb'

import type { Application, HookContext } from '../../declarations'
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
    // Fetch all ratings for this agent (up to 10 000 – sufficient for any real scenario).
    const all = (await context.app.service(agentRatingsPath).find({
      paginate: false,
      query: { agentProfileId, $limit: 10000 }
    }) as unknown) as any[]

    const count = all.length
    const avg =
      count > 0
        ? Number((all.reduce((s: number, r: any) => s + (r.rating ?? 0), 0) / count).toFixed(2))
        : 0

    // Write directly to MongoDB to avoid going through agent-profiles schema validators.
    const db = await context.app.get('mongodbClient')
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
// ──────────────────────────────────────────────────────────────────
const restrictToOwner = async (context: HookContext): Promise<HookContext> => {
  if (!context.params.provider) return context

  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  const existing = await context.app
    .service(agentRatingsPath)
    .get(context.id as any, { provider: undefined } as any)

  if ((existing as any).userId !== user._id.toString()) {
    throw new errors.Forbidden('You can only modify your own reviews.')
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
      // Public: anyone can browse reviews.
      find: [],
      get: [],
      create: [
        authenticate('jwt'),
        attachUserAndEnforceUnique,
        schemaHooks.validateData(agentRatingDataValidator),
        schemaHooks.resolveData(agentRatingDataResolver)
      ],
      patch: [
        authenticate('jwt'),
        restrictToOwner,
        schemaHooks.validateData(agentRatingPatchValidator),
        schemaHooks.resolveData(agentRatingPatchResolver)
      ],
      remove: [authenticate('jwt'), restrictToOwner]
    },
    after: {
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
