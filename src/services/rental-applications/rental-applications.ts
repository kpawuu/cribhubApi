import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { unitIdsForPropertyManager } from '../../hooks/portfolio-unit-ids'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'

import { RentalApplicationsService, getOptions } from './rental-applications.class'
import {
  rentalApplicationResolver,
  rentalApplicationExternalResolver,
  rentalApplicationDataValidator,
  rentalApplicationDataResolver,
  rentalApplicationPatchValidator,
  rentalApplicationPatchResolver,
  rentalApplicationQueryValidator,
  rentalApplicationQueryResolver
} from './rental-applications.schema'

export const rentalApplicationsPath = 'rental-applications'
export const rentalApplicationsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const tryId = (id: string) => {
  const s = String(id)
  if (ObjectId.isValid(s) && s.length === 24) return new ObjectId(s)
  return s as any
}

const loadApplicationRow = async (context: HookContext) => {
  const db = await context.app.get('mongodbClient')
  const col = db.collection('rental_applications')
  const raw = String(context.id || '')
  if (ObjectId.isValid(raw) && raw.length === 24) {
    const row = await col.findOne({ _id: new ObjectId(raw) })
    if (row) return row
  }
  return await col.findOne({ _id: raw as any })
}

const attachApplicant = async (context: HookContext) => {
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  ;(context.data as any).applicantId = user._id.toString()
  return context
}

const restrictFind = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  if (roles.includes('landlord')) {
    const db = await context.app.get('mongodbClient')
    const uid = user._id.toString()
    const props = await db
      .collection('properties')
      .find({ $or: [{ landlordId: uid }, { landlordId: user._id }] })
      .project({ _id: 1 })
      .toArray()
    if (!props.length) {
      mergeQuery(context, { unitId: { $in: [] }})
      return context
    }
    // Include both string and ObjectId forms to handle mixed storage
    const propIdStrings = props.map((p: any) => p._id.toString())
    const uts = await db.collection('units').find({ propertyId: { $in: propIdStrings } }).project({ _id: 1 }).toArray()
    const unitIds = uts.map((u: any) => u._id.toString())
    mergeQuery(context, { unitId: { $in: unitIds.length ? unitIds : ['__none__'] }})
    return context
  }

  if (roles.includes('agent')) {
    const db = await context.app.get('mongodbClient')
    const assigns = await db
      .collection('agent_assignments')
      .find({ agentUserId: user._id.toString() })
      .project({ propertyId: 1 })
      .toArray()
    const propIdStrings = [...new Set(assigns.map((a: any) => String(a.propertyId)).filter(Boolean))]
    if (!propIdStrings.length) {
      mergeQuery(context, { unitId: { $in: [] }})
      return context
    }
    const uts = await db.collection('units').find({ propertyId: { $in: propIdStrings } }).project({ _id: 1 }).toArray()
    const unitIds = uts.map((u: any) => u._id.toString())
    mergeQuery(context, { unitId: { $in: unitIds.length ? unitIds : ['__none__'] }})
    return context
  }

  if (roles.includes('property_manager')) {
    const unitIds = await unitIdsForPropertyManager(context.app, user._id.toString())
    const unitId = unitIds.length === 0 ? { $in: [] } : unitIds.length === 1 ? unitIds[0] : { $in: unitIds }
    mergeQuery(context, { unitId })
    return context
  }

  if (roles.includes('tenant')) {
    mergeQuery(context, { applicantId: user._id.toString() })
    return context
  }

  throw new errors.Forbidden('You are not allowed to list rental applications.')
}

const restrictGet = async (context: HookContext) => {
  if (!context.params.provider) return context
  const row = await loadApplicationRow(context)
  if (!row) throw new errors.NotFound()

  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context
  if (roles.includes('tenant') && String(row.applicantId) === String(user._id)) return context

  const db = await context.app.get('mongodbClient')
  const unit = await db.collection('units').findOne({ _id: tryId(row.unitId) })
  if (!unit) throw new errors.Forbidden()
  const prop = await db.collection('properties').findOne({ _id: tryId(unit.propertyId) })
  if (!prop) throw new errors.Forbidden()

  if (roles.includes('landlord') && String(prop.landlordId) === String(user._id)) return context

  if (roles.includes('agent')) {
    const count = await db.collection('agent_assignments').countDocuments({
      agentUserId: user._id.toString(),
      propertyId: String(unit.propertyId)
    })
    if (count > 0) return context
  }

  if (roles.includes('property_manager')) {
    const count = await db.collection('property_manager_assignments').countDocuments({
      managerUserId: user._id.toString(),
      propertyId: String(unit.propertyId)
    })
    if (count > 0) return context
  }

  throw new errors.Forbidden()
}

const ensureLandlordOwnsApplicationBeforePatch = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin') || roles.includes('property_manager')) return context
  if (!roles.includes('landlord')) return context

  const row = await loadApplicationRow(context)
  if (!row) throw new errors.NotFound()
  const db = await context.app.get('mongodbClient')
  const unit = await db.collection('units').findOne({ _id: tryId(row.unitId) })
  if (!unit) throw new errors.Forbidden()
  const prop = await db.collection('properties').findOne({ _id: tryId(unit.propertyId) })
  if (!prop || String(prop.landlordId) !== String(user._id)) {
    throw new errors.Forbidden('You cannot review this application.')
  }
  return context
}

const toLeaseDate = (v: unknown, fallback: string): string => {
  if (v == null || v === '') return fallback
  const s = String(v).trim()
  if (!s) return fallback
  return s.length >= 10 ? s.slice(0, 10) : s
}

const addOneYear = (yyyyMmDd: string): string => {
  const d = new Date(`${yyyyMmDd}T12:00:00.000Z`)
  if (Number.isNaN(d.getTime())) return yyyyMmDd
  d.setUTCFullYear(d.getUTCFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

const safeMonthlyRent = (unit: any): number => {
  const raw = unit?.rentAmount
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(n) || n < 0) return 0
  return n
}

/**
 * Runs **before** the rental-application document is patched so failures keep the row `pending`
 * and the client receives a proper error instead of a 500 after a partial commit.
 */
const assignUnitAndContractOnApprove = async (context: HookContext) => {
  if (context.method !== 'patch') return context
  const data = context.data as any
  if (data?.status !== 'approved') return context

  const row = await loadApplicationRow(context)
  if (!row || String(row.status) !== 'pending') return context

  const app = context.app
  const unit = await app.service('units').get(String(row.unitId), { provider: undefined } as any)
  const unitIdStr = String((unit as any)._id ?? row.unitId)
  const applicantId = String(row.applicantId)

  if (String((unit as any).status) === 'occupied' && String((unit as any).tenantId || '') === applicantId) {
    return context
  }
  if (String((unit as any).status) === 'occupied') {
    throw new errors.Conflict('This unit is already occupied by another tenant. Resolve the unit before approving.')
  }

  const today = new Date().toISOString().slice(0, 10)
  let startDate = toLeaseDate((unit as any).leaseStart, today)
  let endDate = toLeaseDate((unit as any).leaseEnd, addOneYear(startDate))
  if (endDate <= startDate) {
    endDate = addOneYear(startDate)
  }

  const monthlyRent = safeMonthlyRent(unit)
  const landlordId = await inferLandlordIdForUnit(context, String((unit as any).propertyId))
  if (!landlordId) {
    throw new errors.BadRequest('Property has no landlordId; cannot create rental contract.')
  }

  const db = await app.get('mongodbClient')
  const existingContract = await db.collection('rental_contracts').findOne({
    unitId: unitIdStr,
    tenantId: applicantId,
    status: 'draft'
  })
  if (!existingContract) {
    await app.service('rental-contracts').create(
      {
        unitId: unitIdStr,
        landlordId,
        tenantId: applicantId,
        contractType: 'ai_generated',
        status: 'draft',
        startDate,
        endDate,
        monthlyRent,
        rentCurrency: (unit as any).rentCurrency || 'GHS'
      },
      { provider: undefined } as any
    )
  }

  await app.service('units').patch(
    (unit as any)._id as any,
    {
      status: 'occupied',
      tenantId: applicantId
    },
    { provider: undefined } as any
  )

  return context
}

const inferLandlordIdForUnit = async (context: HookContext, propertyId: string): Promise<string> => {
  const property = await context.app.service('properties').get(propertyId, { provider: undefined } as any)
  const lid = (property as any).landlordId
  return lid != null ? String(lid) : ''
}

const preventDuplicateApplication = async (context: HookContext) => {
  const user = context.params.user as any
  const unitId = (context.data as any)?.unitId
  if (!unitId || !user?._id) return context

  const db = await context.app.get('mongodbClient')
  const existing = await db.collection('rental_applications').findOne({
    applicantId: user._id.toString(),
    unitId: String(unitId),
    status: { $in: ['pending', 'approved'] }
  })

  if (existing) {
    throw new errors.Conflict(
      existing.status === 'approved'
        ? 'Your application for this unit has already been approved.'
        : 'You already have a pending application for this unit.'
    )
  }
  return context
}

export const rentalApplications = (app: Application) => {
  app.use(rentalApplicationsPath, new RentalApplicationsService(getOptions(app)), {
    methods: rentalApplicationsMethods as any,
    events: []
  })

  app.service(rentalApplicationsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(rentalApplicationExternalResolver), schemaHooks.resolveResult(rentalApplicationResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(rentalApplicationQueryValidator), schemaHooks.resolveQuery(rentalApplicationQueryResolver)],
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      get: [authenticateIfExternal('jwt'), populateRoles, restrictGet],
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('tenant', 'admin'),
        preventDuplicateApplication,
        schemaHooks.validateData(rentalApplicationDataValidator),
        schemaHooks.resolveData(rentalApplicationDataResolver),
        attachApplicant
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('landlord', 'admin', 'property_manager'),
        ensureLandlordOwnsApplicationBeforePatch,
        schemaHooks.validateData(rentalApplicationPatchValidator),
        schemaHooks.resolveData(rentalApplicationPatchResolver),
        async (ctx: HookContext) => {
          const u = ctx.params.user as any
          ;(ctx.data as any).reviewedBy = u?._id?.toString()
        },
        assignUnitAndContractOnApprove
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [rentalApplicationsPath]: RentalApplicationsService
  }
}
