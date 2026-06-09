import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { authenticate } from '@feathersjs/authentication'
import { ObjectId } from 'mongodb'

import type { Application, HookContext } from '../../declarations'
import { authenticateIfJwtPresent } from '../../hooks/authenticate-if-jwt-present'
import { populateRoles } from '../../hooks/populate-roles'
import { PmRatingsService, getOptions } from './pm-ratings.class'
import {
  pmRatingResolver,
  pmRatingExternalResolver,
  pmRatingDataValidator,
  pmRatingDataResolver,
  pmRatingPatchValidator,
  pmRatingPatchResolver,
  pmRatingQueryValidator,
  pmRatingQueryResolver
} from './pm-ratings.schema'

export const pmRatingsPath = 'pm-ratings'
export const pmRatingsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

async function syncPmRatingSummary(context: HookContext): Promise<HookContext> {
  const record = Array.isArray(context.result) ? context.result[0] : (context.result as any)
  const pmProfileId: string = record?.pmProfileId ?? (context.data as any)?.pmProfileId ?? ''
  if (!pmProfileId) return context

  try {
    // Aggregate directly via MongoDB to avoid going through service query
    // validators (which don't allow `$exists` on the boolean `hidden` field).
    const db = await context.app.get('mongodbClient')

    const all = (await db.collection('pm_ratings').find({
      pmProfileId,
      $or: [{ hidden: { $exists: false } }, { hidden: false }]
    } as any, {
      projection: { rating: 1 },
      limit: 10000
    } as any).toArray()) as any[]

    const count = all.length
    const avg =
      count > 0 ? Number((all.reduce((s: number, r: any) => s + (Number(r.rating) || 0), 0) / count).toFixed(2)) : 0

    const id = pmProfileId
    const filter = ObjectId.isValid(id) && id.length === 24 ? { _id: new ObjectId(id) } : { _id: id as any }

    await db.collection('property_manager_profiles').updateOne(filter, {
      $set: { ratingAvg: avg, ratingCount: count, updatedAt: new Date().toISOString() }
    })
  } catch (err) {
    console.error('[pm-ratings] syncPmRatingSummary error:', err)
  }
  return context
}

const attachUserAndEnforceUnique = async (context: HookContext): Promise<HookContext> => {
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const userId = user._id.toString()
  const pmProfileId = (context.data as any).pmProfileId
  if (!pmProfileId) throw new errors.BadRequest('pmProfileId is required')

  const existing = ((await context.app.service(pmRatingsPath).find({
    paginate: false,
    query: { pmProfileId, userId, $limit: 1 }
  })) as unknown) as any[]

  if (existing.length > 0) {
    throw new errors.Conflict('You have already rated this manager. Update your existing review instead.', {
      existingId: existing[0]._id?.toString()
    })
  }

  return context
}

const restrictToOwner = async (context: HookContext): Promise<HookContext> => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const isAdmin = roles.includes('admin')

  if (!isAdmin) {
    const existing = await context.app.service(pmRatingsPath).get(context.id as any, { provider: undefined } as any)
    if ((existing as any).userId !== user._id.toString()) {
      throw new errors.Forbidden('You can only modify your own reviews.')
    }
    if (context.method === 'patch' && context.data && typeof context.data === 'object') {
      delete (context.data as any).hidden
      delete (context.data as any).moderationNote
    }
  } else if (context.method === 'patch' && context.data && typeof context.data === 'object') {
    const d = context.data as any
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

/**
 * After-find safety filter: drop hidden reviews from public/non-admin results.
 * Applied after the adapter runs, so it sidesteps schema/query operator
 * validation entirely.
 */
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
  }
  return context
}

export const pmRatings = (app: Application) => {
  app.use(pmRatingsPath, new PmRatingsService(getOptions(app)), {
    methods: pmRatingsMethods as any,
    events: []
  })

  app.service(pmRatingsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(pmRatingExternalResolver), schemaHooks.resolveResult(pmRatingResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(pmRatingQueryValidator), schemaHooks.resolveQuery(pmRatingQueryResolver)],
      find: [authenticateIfJwtPresent(), populateRoles],
      get: [authenticateIfJwtPresent(), populateRoles],
      create: [
        authenticate('jwt'),
        attachUserAndEnforceUnique,
        schemaHooks.validateData(pmRatingDataValidator),
        schemaHooks.resolveData(pmRatingDataResolver)
      ],
      patch: [
        authenticate('jwt'),
        populateRoles,
        restrictToOwner,
        schemaHooks.validateData(pmRatingPatchValidator),
        schemaHooks.resolveData(pmRatingPatchResolver)
      ],
      remove: [authenticate('jwt'), populateRoles, restrictToOwner]
    },
    after: {
      find: [hideModeratedFromPublic],
      create: [syncPmRatingSummary],
      patch: [syncPmRatingSummary],
      remove: [syncPmRatingSummary]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [pmRatingsPath]: PmRatingsService
  }
}
