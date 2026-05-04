import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { mergeQuery } from '../../hooks/merge-query'
import { populateRoles } from '../../hooks/populate-roles'
import { requireRole } from '../../hooks/require-role'
import { createUserNotification } from '../../utils/create-user-notification'

import { PropertyManagerListingRequestsService, getOptions } from './property-manager-listing-requests.class'
import {
  propertyManagerListingRequestResolver,
  propertyManagerListingRequestExternalResolver,
  propertyManagerListingRequestDataValidator,
  propertyManagerListingRequestDataResolver,
  propertyManagerListingRequestPatchValidator,
  propertyManagerListingRequestPatchResolver,
  propertyManagerListingRequestQueryValidator,
  propertyManagerListingRequestQueryResolver
} from './property-manager-listing-requests.schema'

export const propertyManagerListingRequestsPath = 'property-manager-listing-requests'
export const propertyManagerListingRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '')

const idQuery = (raw: string) => {
  if (ObjectId.isValid(raw) && String(new ObjectId(raw)) === raw) return { _id: new ObjectId(raw) }
  return { _id: raw as any }
}

const rowById = async (app: Application, id: string) => {
  const db = await app.get('mongodbClient')
  return db.collection('property_manager_listing_requests').findOne(idQuery(id))
}

const restrictFind = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context
  if (roles.includes('property_manager')) {
    mergeQuery(context, { managerUserId: user._id.toString() })
    return context
  }
  if (roles.includes('landlord')) {
    mergeQuery(context, { landlordId: user._id.toString() })
    return context
  }
  throw new errors.Forbidden('You are not allowed to list these requests.')
}

const assertRowAccess = async (context: HookContext, row: any) => {
  if (!context.params.provider) return
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return
  const uid = user._id?.toString()
  if (row.managerUserId === uid || row.landlordId === uid) return
  throw new errors.Forbidden('You cannot access this request.')
}

const loadRowForPatch = async (context: HookContext) => {
  if (context.method !== 'patch') return context
  const id = String(context.id || '')
  if (!id) throw new errors.BadRequest('Missing id')
  const cur = await rowById(context.app, id)
  if (!cur) throw new errors.NotFound('Request not found')
  ;(context.params as any).__pmListingPrev = cur
  return context
}

const restrictPatch = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const prev = (context.params as any).__pmListingPrev as any
  if (!prev) return context
  await assertRowAccess(context, prev)

  const st = (context.data as any)?.status
  if (!st) throw new errors.BadRequest('status is required')

  if (roles.includes('admin')) {
    if (!['accepted', 'rejected', 'withdrawn'].includes(st)) throw new errors.BadRequest('Invalid status')
    return context
  }

  const uid = user._id.toString()
  if (prev.landlordId === uid) {
    if (st !== 'accepted' && st !== 'rejected') throw new errors.Forbidden('Landlords may only accept or reject requests.')
    if (prev.status !== 'pending') throw new errors.BadRequest('Only pending requests can be decided.')
    ;(context.data as any).reviewedBy = uid
    ;(context.data as any).reviewedAt = new Date().toISOString()
    return context
  }

  if (prev.managerUserId === uid) {
    if (st !== 'withdrawn') throw new errors.Forbidden('You may only withdraw your own pending request.')
    if (prev.status !== 'pending') throw new errors.BadRequest('Only pending requests can be withdrawn.')
    return context
  }

  throw new errors.Forbidden('You cannot update this request.')
}

const preventRequestOnOwnListing = async (context: HookContext) => {
  if (context.method !== 'create') return context
  const d = context.data as any
  if (String(d.landlordId || '') === String(d.managerUserId || '')) {
    throw new errors.BadRequest('You cannot request to manage your own listing.')
  }
  return context
}

const preventDuplicatePending = async (context: HookContext) => {
  if (context.method !== 'create') return context
  const d = context.data as any
  if (!d?.managerUserId || !d?.propertyId) return context
  const db = await context.app.get('mongodbClient')
  const dup = await db.collection('property_manager_listing_requests').findOne({
    propertyId: d.propertyId,
    managerUserId: d.managerUserId,
    status: 'pending'
  })
  if (dup) throw new errors.BadRequest('You already have a pending request for this property.')
  return context
}

const ensureRequesterIsPm = async (context: HookContext) => {
  if (context.method !== 'create' || !context.params.provider) return context
  const roles: string[] = Array.isArray((context.params.user as any)?.roles)
    ? ((context.params.user as any).roles as string[])
    : []
  if (roles.includes('admin')) return context
  if (!roles.includes('property_manager')) throw new errors.Forbidden('Only approved property managers can request to manage a listing.')
  return context
}

const stripNonAdminManagerUserId = async (context: HookContext) => {
  if (context.method !== 'create' || !context.params.provider) return context
  const roles: string[] = Array.isArray((context.params.user as any)?.roles)
    ? ((context.params.user as any).roles as string[])
    : []
  if (!roles.includes('admin') && context.data && typeof context.data === 'object' && 'managerUserId' in (context.data as any)) {
    delete (context.data as any).managerUserId
  }
  return context
}

const notifyLandlordOnCreate = async (context: HookContext) => {
  const r = context.result as any
  if (!r?.landlordId || !r?.propertyId) return context
  await createUserNotification(context.app, {
    userId: String(r.landlordId),
    eventKey: 'pm_listing_request.created',
    category: 'assignment',
    title: 'Property manager requested access',
    body: r.message ? String(r.message).slice(0, 280) : 'A property manager asked to help manage one of your listings.',
    linkUrl: `${appUrl()}/landlord/properties/${r.propertyId}`,
    relatedService: 'property-manager-listing-requests',
    relatedId: String(r._id),
    metadata: { propertyId: r.propertyId, managerUserId: r.managerUserId }
  })
  return context
}

const notifyManagerOnDecision = async (context: HookContext) => {
  const r = context.result as any
  const prev = (context.params as any).__pmListingPrev as any
  if (!r?.managerUserId || !prev || prev.status === r.status) return context
  if (r.status === 'accepted') {
    await createUserNotification(context.app, {
      userId: String(r.managerUserId),
      eventKey: 'pm_listing_request.accepted',
      category: 'assignment',
      title: 'Management request accepted',
      body: 'The landlord accepted your request to help manage their property.',
      linkUrl: `${appUrl()}/landlord/properties`,
      relatedService: 'property-manager-listing-requests',
      relatedId: String(r._id)
    })
  } else if (r.status === 'rejected') {
    await createUserNotification(context.app, {
      userId: String(r.managerUserId),
      eventKey: 'pm_listing_request.rejected',
      category: 'assignment',
      title: 'Management request declined',
      body: 'The landlord did not accept your request for this property.',
      linkUrl: `${appUrl()}/listings`,
      relatedService: 'property-manager-listing-requests',
      relatedId: String(r._id)
    })
  }
  return context
}

const provisionAssignmentWhenAccepted = async (context: HookContext) => {
  const r = context.result as any
  const prev = (context.params as any).__pmListingPrev as any
  if (!r || r.status !== 'accepted' || !prev || prev.status === 'accepted') return context

  const res = await context.app.service('property-manager-assignments').find({
    query: { propertyId: r.propertyId, managerUserId: r.managerUserId, $limit: 1 },
    paginate: false,
    provider: undefined
  } as any)
  const data = Array.isArray(res) ? res : []
  if (data.length) return context

  await context.app.service('property-manager-assignments').create(
    {
      propertyId: r.propertyId,
      managerUserId: r.managerUserId
    } as any,
    { provider: undefined } as any
  )
  return context
}

export const propertyManagerListingRequests = (app: Application) => {
  app.use(propertyManagerListingRequestsPath, new PropertyManagerListingRequestsService(getOptions(app)), {
    methods: propertyManagerListingRequestsMethods as any,
    events: []
  })

  app.service(propertyManagerListingRequestsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(propertyManagerListingRequestExternalResolver),
        schemaHooks.resolveResult(propertyManagerListingRequestResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(propertyManagerListingRequestQueryValidator),
        schemaHooks.resolveQuery(propertyManagerListingRequestQueryResolver)
      ],
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
        requireRole('property_manager', 'admin'),
        ensureRequesterIsPm,
        stripNonAdminManagerUserId,
        schemaHooks.validateData(propertyManagerListingRequestDataValidator),
        schemaHooks.resolveData(propertyManagerListingRequestDataResolver),
        preventRequestOnOwnListing,
        preventDuplicatePending
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        loadRowForPatch,
        restrictPatch,
        schemaHooks.validateData(propertyManagerListingRequestPatchValidator),
        schemaHooks.resolveData(propertyManagerListingRequestPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), populateRoles, requireRole('admin')]
    },
    after: {
      create: [notifyLandlordOnCreate],
      patch: [provisionAssignmentWhenAccepted, notifyManagerOnDecision]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [propertyManagerListingRequestsPath]: PropertyManagerListingRequestsService
  }
}
