import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { mergeQuery } from '../../hooks/merge-query'
import { populateRoles } from '../../hooks/populate-roles'
import { requireRole } from '../../hooks/require-role'
import { createUserNotification } from '../../utils/create-user-notification'
import { findOrCreateThread } from '../threads/threads'
import { deriveLegacyCommissionPercent } from '../fee-proposal-shared'

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

  const uid = user._id?.toString()
  const d = context.data as any
  const st = d?.status as string | undefined

  if (roles.includes('admin')) {
    if (st && !['countered', 'accepted', 'rejected', 'withdrawn'].includes(st)) {
      throw new errors.BadRequest('Invalid status')
    }
    if (st === 'accepted' && !d.acceptedTerms) {
      d.acceptedTerms = prev.counter || prev.proposal || undefined
    }
    return context
  }

  // Landlord: accept / reject / counter (only on pending or countered)
  if (prev.landlordId === uid) {
    if (!st && !d.counter) throw new errors.BadRequest('Provide a status or counter')
    if (st && !['accepted', 'rejected', 'countered'].includes(st)) {
      throw new errors.Forbidden('Landlords may only accept, reject or counter.')
    }
    if (!['pending', 'countered'].includes(prev.status)) {
      throw new errors.BadRequest(`Cannot update a request with status "${prev.status}".`)
    }
    if (d.counter) {
      d.counter = { ...d.counter, proposedByUserId: uid, at: new Date().toISOString() }
      d.status = 'countered'
    }
    if (st === 'accepted') {
      d.acceptedTerms = d.acceptedTerms || prev.counter || prev.proposal || undefined
      const cp = deriveLegacyCommissionPercent(d.acceptedTerms)
      if (typeof cp === 'number') (d as any).commissionPercent = cp
    }
    d.reviewedBy = uid
    d.reviewedAt = new Date().toISOString()
    delete d.proposal
    return context
  }

  // Agent: withdraw, accept landlord counter, or send new proposal during countered
  if (prev.agentUserId === uid) {
    if (st === 'withdrawn') {
      if (!['pending', 'countered'].includes(prev.status)) {
        throw new errors.BadRequest('Only pending/countered requests can be withdrawn.')
      }
      return context
    }
    if (st === 'accepted') {
      if (prev.status !== 'countered') throw new errors.Forbidden('No counter to accept.')
      d.acceptedTerms = d.acceptedTerms || prev.counter || prev.proposal || undefined
      const cp = deriveLegacyCommissionPercent(d.acceptedTerms)
      if (typeof cp === 'number') (d as any).commissionPercent = cp
      d.reviewedBy = uid
      d.reviewedAt = new Date().toISOString()
      delete d.counter
      delete d.proposal
      return context
    }
    if (d.proposal && prev.status === 'countered') {
      d.proposal = { ...d.proposal, proposedByUserId: uid, at: new Date().toISOString() }
      d.status = 'pending'
      delete d.counter
      return context
    }
    throw new errors.Forbidden('You can only withdraw, accept the counter, or send a new proposal.')
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
    status: { $in: ['pending', 'countered'] }
  })
  if (dup) throw new errors.BadRequest('You already have an open request for this property.')
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

const mirrorCommissionPercent = async (context: HookContext) => {
  if (context.method !== 'create') return context
  const d = context.data as any
  if (typeof d.commissionPercent !== 'number') {
    const derived = deriveLegacyCommissionPercent(d.proposal)
    if (typeof derived === 'number') d.commissionPercent = derived
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
    linkUrl: `${appUrl()}/landlord/properties/${r.propertyId}?tab=agent&request=${r._id}`,
    relatedService: 'agent-listing-requests',
    relatedId: String(r._id),
    metadata: { propertyId: r.propertyId, agentUserId: r.agentUserId }
  })
  return context
}

const notifyOnStatusChange = async (context: HookContext) => {
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
      linkUrl: `${appUrl()}/agent/listings?property=${r.propertyId}`,
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
  } else if (r.status === 'countered') {
    await createUserNotification(context.app, {
      userId: String(r.agentUserId),
      eventKey: 'agent_listing_request.countered',
      category: 'assignment',
      title: 'Landlord proposed different terms',
      body: 'Review their counter-offer to continue.',
      linkUrl: `${appUrl()}/agent/listings?request=${r._id}`,
      relatedService: 'agent-listing-requests',
      relatedId: String(r._id)
    })
  } else if (r.status === 'pending' && prev.status === 'countered') {
    await createUserNotification(context.app, {
      userId: String(r.landlordId),
      eventKey: 'agent_listing_request.recountered',
      category: 'assignment',
      title: 'Agent updated their proposal',
      body: 'Review the new fee proposal to continue.',
      linkUrl: `${appUrl()}/landlord/properties/${r.propertyId}?tab=agent&request=${r._id}`,
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

  const res = (await context.app.service('agent-assignments').find({
    query: { propertyId: r.propertyId, agentUserId: r.agentUserId, $limit: 1 },
    paginate: false,
    provider: undefined
  } as any)) as any
  const data = Array.isArray(res) ? res : []
  if (!data.length) {
    await context.app.service('agent-assignments').create(
      {
        propertyId: r.propertyId,
        agentUserId: r.agentUserId,
        commissionPercent: r.commissionPercent,
        agreementNote: r.message,
        acceptedTerms: r.acceptedTerms,
        sourceRequestId: String(r._id)
      } as any,
      { provider: undefined } as any
    )
  }

  try {
    const prop = await context.app
      .service('properties')
      .get(String(r.propertyId), { provider: undefined } as any)
      .catch(() => null)
    await findOrCreateThread(context.app, {
      kind: 'landlord-agent',
      participantIds: [String(r.landlordId), String(r.agentUserId)],
      subject: { type: 'property', id: String(r.propertyId) },
      propertyId: String(r.propertyId),
      title: (prop as any)?.name ? `Represent: ${(prop as any).name}` : 'Property representation',
      systemNote: 'You are now connected. Use this thread to coordinate listing & commission details.'
    })
  } catch {}
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
        mirrorCommissionPercent,
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
      patch: [provisionAssignmentWhenAccepted, notifyOnStatusChange]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [agentListingRequestsPath]: AgentListingRequestsService
  }
}
