import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { mergeQuery } from '../../hooks/merge-query'
import { populateRoles } from '../../hooks/populate-roles'
import { requireRole } from '../../hooks/require-role'
import { createUserNotification } from '../../utils/create-user-notification'

import { AgentPayoutsService, getOptions } from './agent-payouts.class'
import {
  agentPayoutResolver,
  agentPayoutExternalResolver,
  agentPayoutDataValidator,
  agentPayoutDataResolver,
  agentPayoutPatchValidator,
  agentPayoutPatchResolver,
  agentPayoutQueryValidator,
  agentPayoutQueryResolver
} from './agent-payouts.schema'

export const agentPayoutsPath = 'agent-payouts'
export const agentPayoutsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '')

const restrictFind = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const uid = user._id.toString()
  if (roles.includes('admin')) return context
  if (roles.includes('agent')) {
    mergeQuery(context, { agentUserId: uid })
    return context
  }
  if (roles.includes('landlord')) {
    mergeQuery(context, { landlordId: uid })
    return context
  }
  if (roles.includes('property_manager')) {
    const db = await context.app.get('mongodbClient')
    const pids = (await db
      .collection('property_manager_assignments')
      .distinct('propertyId', { managerUserId: uid })).map((x) => String(x))
    mergeQuery(context, pids.length ? { propertyId: { $in: pids } } : { propertyId: '__none__' })
    return context
  }
  throw new errors.Forbidden()
}

const populateLandlordOnCreate = async (context: HookContext) => {
  const d = context.data as any
  if (!d.propertyId) throw new errors.BadRequest('propertyId is required')
  try {
    const prop = await context.app.service('properties').get(String(d.propertyId), { provider: undefined } as any)
    d.landlordId = String((prop as any).landlordId || '')
  } catch {
    throw new errors.BadRequest('Property not found')
  }
  return context
}

const restrictMarkPaid = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const uid = user._id?.toString()
  if (roles.includes('admin')) return context

  const id = String(context.id || '')
  const db = await context.app.get('mongodbClient')
  const filter = ObjectId.isValid(id) && id.length === 24 ? { _id: new ObjectId(id) } : { _id: id as any }
  const row = await db.collection('agent_payouts').findOne(filter as any)
  if (!row) throw new errors.NotFound()

  if (roles.includes('landlord') && String(row.landlordId) === uid) {
    ;(context.data as any).paidBy = uid
    if ((context.data as any).status === 'paid' && !(context.data as any).paidAt) {
      ;(context.data as any).paidAt = new Date().toISOString()
    }
    return context
  }
  throw new errors.Forbidden('Only the landlord (or admin) can update payouts.')
}

const notifyAgentOnPaid = async (context: HookContext) => {
  const r = context.result as any
  if (!r || r.status !== 'paid') return context
  await createUserNotification(context.app, {
    userId: String(r.agentUserId),
    eventKey: 'agent_payout.paid',
    category: 'payment',
    title: 'Commission marked as paid',
    body: `${r.currency} ${Number(r.amount || 0).toLocaleString()} was marked as paid for your representation.`,
    linkUrl: `${appUrl()}/agent/payouts`,
    relatedService: 'agent-payouts',
    relatedId: String(r._id)
  })
  return context
}

export const agentPayouts = (app: Application) => {
  app.use(agentPayoutsPath, new AgentPayoutsService(getOptions(app)), {
    methods: agentPayoutsMethods as any,
    events: []
  })

  app.service(agentPayoutsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(agentPayoutExternalResolver),
        schemaHooks.resolveResult(agentPayoutResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(agentPayoutQueryValidator), schemaHooks.resolveQuery(agentPayoutQueryResolver)],
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      get: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('landlord', 'admin'),
        populateLandlordOnCreate,
        schemaHooks.validateData(agentPayoutDataValidator),
        schemaHooks.resolveData(agentPayoutDataResolver)
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        restrictMarkPaid,
        schemaHooks.validateData(agentPayoutPatchValidator),
        schemaHooks.resolveData(agentPayoutPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), populateRoles, requireRole('admin')]
    },
    after: {
      patch: [notifyAgentOnPaid]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [agentPayoutsPath]: AgentPayoutsService
  }
}
