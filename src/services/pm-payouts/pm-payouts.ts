import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { mergeQuery } from '../../hooks/merge-query'
import { populateRoles } from '../../hooks/populate-roles'
import { requireRole } from '../../hooks/require-role'
import { createUserNotification } from '../../utils/create-user-notification'

import { PmPayoutsService, getOptions } from './pm-payouts.class'
import {
  pmPayoutResolver,
  pmPayoutExternalResolver,
  pmPayoutDataValidator,
  pmPayoutDataResolver,
  pmPayoutPatchValidator,
  pmPayoutPatchResolver,
  pmPayoutQueryValidator,
  pmPayoutQueryResolver
} from './pm-payouts.schema'

export const pmPayoutsPath = 'pm-payouts'
export const pmPayoutsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '')

const restrictFind = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const uid = user._id.toString()
  if (roles.includes('admin')) return context
  if (roles.includes('property_manager')) {
    mergeQuery(context, { managerUserId: uid })
    return context
  }
  if (roles.includes('landlord')) {
    mergeQuery(context, { landlordId: uid })
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
  const row = await db.collection('pm_payouts').findOne(filter as any)
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

const notifyManagerOnPaid = async (context: HookContext) => {
  const r = context.result as any
  if (!r || r.status !== 'paid') return context
  await createUserNotification(context.app, {
    userId: String(r.managerUserId),
    eventKey: 'pm_payout.paid',
    category: 'payment',
    title: 'Management fee marked as paid',
    body: `${r.currency} ${Number(r.amount || 0).toLocaleString()} was marked as paid for property management.`,
    linkUrl: `${appUrl()}/pm/payouts`,
    relatedService: 'pm-payouts',
    relatedId: String(r._id)
  })
  return context
}

export const pmPayouts = (app: Application) => {
  app.use(pmPayoutsPath, new PmPayoutsService(getOptions(app)), {
    methods: pmPayoutsMethods as any,
    events: []
  })

  app.service(pmPayoutsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(pmPayoutExternalResolver), schemaHooks.resolveResult(pmPayoutResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(pmPayoutQueryValidator), schemaHooks.resolveQuery(pmPayoutQueryResolver)],
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      get: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('landlord', 'admin'),
        populateLandlordOnCreate,
        schemaHooks.validateData(pmPayoutDataValidator),
        schemaHooks.resolveData(pmPayoutDataResolver)
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        restrictMarkPaid,
        schemaHooks.validateData(pmPayoutPatchValidator),
        schemaHooks.resolveData(pmPayoutPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), populateRoles, requireRole('admin')]
    },
    after: {
      patch: [notifyManagerOnPaid]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [pmPayoutsPath]: PmPayoutsService
  }
}
