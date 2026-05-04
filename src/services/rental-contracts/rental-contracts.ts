import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'

import { RentalContractsService, getOptions } from './rental-contracts.class'
import {
  rentalContractResolver,
  rentalContractExternalResolver,
  rentalContractDataValidator,
  rentalContractDataResolver,
  rentalContractPatchValidator,
  rentalContractPatchResolver,
  rentalContractQueryValidator,
  rentalContractQueryResolver
} from './rental-contracts.schema'

export const rentalContractsPath = 'rental-contracts'
export const rentalContractsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

/**
 * Intercepts patch calls where `data.action === 'renew'`.
 * Creates a fresh draft contract extending the existing lease by `data.months` months
 * then clears `context.result` so the original patch is skipped.
 * Only the tenant who owns the contract (or admin/landlord) may request renewal.
 */
const handleRenewalAction = async (context: HookContext) => {
  const data = context.data as any
  if (data?.action !== 'renew') return context

  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []

  const id = String(context.id || '')
  const db = await context.app.get('mongodbClient')
  const col = db.collection('rental_contracts')

  let existing: any = await col.findOne({ _id: id as any })
  if (!existing && ObjectId.isValid(id) && id.length === 24) {
    existing = await col.findOne({ _id: new ObjectId(id) })
  }
  if (!existing) throw new errors.NotFound('Contract not found.')

  const isTenant = roles.includes('tenant') && String(existing.tenantId) === String(user._id)
  const isLandlord = roles.includes('landlord') && String(existing.landlordId) === String(user._id)
  const isAdmin = roles.includes('admin')
  if (!isTenant && !isLandlord && !isAdmin) throw new errors.Forbidden('You cannot renew this contract.')

  const months = Math.max(1, Math.min(60, Number(data.months) || 12))
  const oldEnd = existing.endDate ? new Date(existing.endDate) : new Date()
  const newStart = new Date(oldEnd)
  newStart.setDate(newStart.getDate() + 1)
  const newEnd = new Date(newStart)
  newEnd.setMonth(newEnd.getMonth() + months)

  const renewal = await context.app.service(rentalContractsPath).create(
    {
      unitId: existing.unitId,
      landlordId: existing.landlordId,
      tenantId: existing.tenantId,
      monthlyRent: existing.monthlyRent,
      rentCurrency: existing.rentCurrency || 'GHS',
      startDate: newStart.toISOString().split('T')[0],
      endDate: newEnd.toISOString().split('T')[0],
      status: 'draft',
      contractType: existing.contractType || 'ai_generated',
      content: existing.content || undefined,
      documentUrl: existing.documentUrl || undefined
    },
    { provider: undefined } as any
  )

  // Return the new renewal contract; skip default patch behaviour
  context.result = renewal
  return context
}

const restrictFindToOwn = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  if (roles.includes('property_manager')) {
    const db = await context.app.get('mongodbClient')
    const assigns = await db
      .collection('property_manager_assignments')
      .find({ managerUserId: user._id.toString() })
      .project({ propertyId: 1 })
      .toArray()
    const pids = [...new Set(assigns.map((a: any) => String(a.propertyId)).filter(Boolean))]
    if (!pids.length) {
      mergeQuery(context, { landlordId: '__none__' })
      return context
    }
    const oids: unknown[] = pids.map((i) => (ObjectId.isValid(String(i)) && String(i).length === 24 ? new ObjectId(String(i)) : i))
    const props = await db.collection('properties').find({ _id: { $in: oids as any } }).project({ landlordId: 1 }).toArray()
    const lids = [...new Set(props.map((p: any) => String(p.landlordId)).filter(Boolean))]
    if (!lids.length) mergeQuery(context, { landlordId: '__none__' })
    else if (lids.length === 1) mergeQuery(context, { landlordId: lids[0] })
    else mergeQuery(context, { landlordId: { $in: lids } })
    return context
  }

  if (roles.includes('tenant') && !roles.includes('admin')) {
    mergeQuery(context, { tenantId: user._id.toString() })
  }
  if (roles.includes('landlord') && !roles.includes('admin')) {
    mergeQuery(context, { landlordId: user._id.toString() })
  }
  return context
}

export const rentalContracts = (app: Application) => {
  app.use(rentalContractsPath, new RentalContractsService(getOptions(app)), {
    methods: rentalContractsMethods as any,
    events: []
  })

  /**
   * After any patch, if both parties have now signed and the contract is still
   * in 'draft' / 'sent' / 'signed' status, automatically promote it to 'active'.
   * This runs as an internal call so it bypasses the patch validator.
   */
  const autoActivateOnFullySigned = async (context: HookContext) => {
    const result = context.result as any
    if (!result?._id) return context

    const bothSigned = !!(result.landlordSignedAt && result.tenantSignedAt)
    const notYetActive = ['draft', 'sent', 'signed'].includes(result.status || 'draft')

    if (bothSigned && notYetActive) {
      await context.app.service(rentalContractsPath).patch(
        String(result._id),
        { status: 'active' },
        { provider: undefined } as any
      )
    }
    return context
  }

  app.service(rentalContractsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(rentalContractExternalResolver), schemaHooks.resolveResult(rentalContractResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(rentalContractQueryValidator), schemaHooks.resolveQuery(rentalContractQueryResolver)],
      find: [authenticateIfExternal('jwt'), restrictFindToOwn],
      get: [authenticateIfExternal('jwt')],
      create: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin', 'property_manager'),
        schemaHooks.validateData(rentalContractDataValidator),
        schemaHooks.resolveData(rentalContractDataResolver)
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('tenant', 'landlord', 'admin', 'property_manager'),
        handleRenewalAction,
        schemaHooks.validateData(rentalContractPatchValidator),
        schemaHooks.resolveData(rentalContractPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    },
    after: {
      patch: [autoActivateOnFullySigned]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [rentalContractsPath]: RentalContractsService
  }
}

