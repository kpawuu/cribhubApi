import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { mergeQuery } from '../../hooks/merge-query'
import { populateRoles } from '../../hooks/populate-roles'
import { requireRole } from '../../hooks/require-role'
import { createUserNotification } from '../../utils/create-user-notification'

import { AgentListingRequestsService, getOptions } from './agent-listing-requests.class'
import {
  agentListingRequestResolver,
  agentListingRequestExternalResolver,
  agentListingRequestDataValidator,
  agentListingRequestDataResolver,
  agentListingRequestPatchValidator,
  agentListingRequestPatchResolver,
  agentListingRequestQueryValidator,
  agentListingRequestQueryResolver
} from './agent-listing-requests.schema'

export const agentListingRequestsPath = 'agent-listing-requests'
export const agentListingRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '')

const idQuery = (raw: string) => {
  if (ObjectId.isValid(raw) && String(new ObjectId(raw)) === raw) return { _id: new ObjectId(raw) }
  return { _id: raw as any }
}

const rowById = async (app: Application, id: string) => {
  const db = await app.get('mongodbClient')
  return db.collection('agent_listing_requests').findOne(idQuery(id))
}

const restrictFind = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context
  if (roles.includes('agent')) {
    mergeQuery(context, { agentUserId: user._id.toString() })
    return context
  }
  if (roles.includes('landlord')) {
    mergeQuery(context, { landlordId: user._id.toString() })
    return context
  }
  throw new errors.Forbidden('You are not allowed to list agent listing requests.')
}

const assertRowAccess = async (context: HookContext, row: any) => {
  if (!context.params.provider) return
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return
  const uid = user._id?.toString()
  if (row.agentUserId === uid || row.landlordId === uid) return
  throw new errors.Forbidden('You cannot access this request.')
}

const loadRowForPatch = async (context: HookContext) => {
  if (context.method !== 'patch') return context
  const id = String(context.id || '')
  if (!id) throw new errors.BadRequest('Missing id')
  const cur = await rowById(context.app, id)
  if (!cur) throw new errors.NotFound('Request not found')
  ;(context.params as any).__agentListingPrev = cur
  return context
}

const restrictPatch = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const prev = (context.params as any).__agentListingPrev as any
  if (!prev) return context
  await assertRowAccess(context, prev)

  const st = (context.data as any)?.status
  if (!st) throw new errors.BadRequest('status is required')

  if (roles.includes('admin')) {
    if (!['accepted', 'rejected', 'withdrawn'].includes(st)) throw new errors.BadRequest('Invalid status')
    return context
  }

  const uid = user._id?.toString()
  if (prev.landlordId === uid) {
    if (st !== 'accepted' && st !== 'rejected') throw new errors.Forbidden('Landlords may only accept or reject requests.')
    if (prev.status !== 'pending') throw new errors.BadRequest('Only pending requests can be decided.')
    ;(context.data as any).reviewedBy = uid
    ;(context.data as any).reviewedAt = new Date().toISOString()
    return context
  }

  if (prev.agentUserId === uid) {
    if (st !== 'withdrawn') throw new errors.Forbidden('Agents may only withdraw their own pending request.')
    if (prev.status !== 'pending') throw new errors.BadRequest('Only pending requests can be withdrawn.')
    return context
  }

  throw new errors.Forbidden('You cannot update this request.')
}

const preventDuplicatePending = async (context: HookContext) => {
  if (context.method !== 'create') return context
  const d = context.data as any
  if (!d?.agentUserId || !d?.propertyId) return context
  const db = await context.app.get('mongodbClient')
  const dup = await db.collection('agent_listing_requests').findOne({
    propertyId: d.propertyId,
    agentUserId: d.agentUserId,
    status: 'pending'
  })
  if (dup) throw new errors.BadRequest('You already have a pending request for this property.')
  return context
}

const preventSelfRequestAsLandlord = async (context: HookContext) => {
  if (context.method !== 'create') return context
  const d = context.data as any
  if (d.landlordId && d.agentUserId && String(d.landlordId) === String(d.agentUserId)) {
    throw new errors.BadRequest('You cannot request your own listing.')
  }
  return context
}

const notifyLandlordOnCreate = async (context: HookContext) => {
  const r = context.result as any
  if (!r?.landlordId || !r?.propertyId) return context
  await createUserNotification(context.app, {
    userId: String(r.landlordId),
    eventKey: 'agent_listing_request.created',
    category: 'assignment',
    title: 'Agent requested to represent your listing',
    body: r.message ? String(r.message).slice(0, 280) : 'An agent asked to represent one of your properties.',
    linkUrl: `${appUrl()}/landlord/properties/${r.propertyId}`,
    relatedService: 'agent-listing-requests',
    relatedId: String(r._id),
    metadata: { propertyId: r.propertyId, agentUserId: r.agentUserId }
  })
  return context
}

const notifyAgentOnDecision = async (context: HookContext) => {
  const r = context.result as any
  const prev = (context.params as any).__agentListingPrev as any
  if (!r?.agentUserId || !prev || prev.status === r.status) return context
  if (r.status === 'accepted') {
    await createUserNotification(context.app, {
      userId: String(r.agentUserId),
      eventKey: 'agent_listing_request.accepted',
      category: 'assignment',
      title: 'Listing request accepted',
      body: 'The landlord accepted your request to represent their property.',
      linkUrl: `${appUrl()}/properties/${r.propertyId}`,
      relatedService: 'agent-listing-requests',
      relatedId: String(r._id)
    })
  } else if (r.status === 'rejected') {
    await createUserNotification(context.app, {
      userId: String(r.agentUserId),
      eventKey: 'agent_listing_request.rejected',
      category: 'assignment',
      title: 'Listing request declined',
      body: 'The landlord did not accept your request for this property.',
      linkUrl: `${appUrl()}/listings`,
      relatedService: 'agent-listing-requests',
      relatedId: String(r._id)
    })
  }
  return context
}

const provisionAssignmentWhenAccepted = async (context: HookContext) => {
  const r = context.result as any
  const prev = (context.params as any).__agentListingPrev as any
  if (!r || r.status !== 'accepted' || !prev || prev.status === 'accepted') return context

  const res = await context.app.service('agent-assignments').find({
    query: { propertyId: r.propertyId, agentUserId: r.agentUserId, $limit: 1 },
    paginate: false,
    provider: undefined
  } as any)
  const data = Array.isArray(res) ? res : []
  if (data.length) return context

  await context.app.service('agent-assignments').create(
    {
      propertyId: r.propertyId,
      agentUserId: r.agentUserId,
      commissionPercent: r.commissionPercent,
      agreementNote: r.message
    } as any,
    { provider: undefined } as any
  )
  return context
}

const stripNonAdminAgentUserId = async (context: HookContext) => {
  if (context.method !== 'create' || !context.params.provider) return context
  const roles: string[] = Array.isArray((context.params.user as any)?.roles)
    ? ((context.params.user as any).roles as string[])
    : []
  if (!roles.includes('admin') && context.data && typeof context.data === 'object' && 'agentUserId' in (context.data as any)) {
    delete (context.data as any).agentUserId
  }
  return context
}

export const agentListingRequests = (app: Application) => {
  app.use(agentListingRequestsPath, new AgentListingRequestsService(getOptions(app)), {
    methods: agentListingRequestsMethods as any,
    events: []
  })

  app.service(agentListingRequestsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(agentListingRequestExternalResolver),
        schemaHooks.resolveResult(agentListingRequestResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(agentListingRequestQueryValidator), schemaHooks.resolveQuery(agentListingRequestQueryResolver)],
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      get: [
        authenticateIfExternal('jwt'),
        populateRoles,
        async (ctx: HookContext) => {
          const row = await rowById(ctx.app, String(ctx.id || ''))
          if (!row) throw new errors.NotFound('Request not found')
          await assertRowAccess(ctx, row)
          return ctx
        }
      ],
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('agent', 'admin'),
        stripNonAdminAgentUserId,
        schemaHooks.validateData(agentListingRequestDataValidator),
        schemaHooks.resolveData(agentListingRequestDataResolver),
        preventDuplicatePending,
        preventSelfRequestAsLandlord
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        loadRowForPatch,
        restrictPatch,
        schemaHooks.validateData(agentListingRequestPatchValidator),
        schemaHooks.resolveData(agentListingRequestPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), populateRoles, requireRole('admin')]
    },
    after: {
      create: [notifyLandlordOnCreate],
      patch: [provisionAssignmentWhenAccepted, notifyAgentOnDecision]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [agentListingRequestsPath]: AgentListingRequestsService
  }
}
