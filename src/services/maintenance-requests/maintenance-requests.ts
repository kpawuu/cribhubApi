import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'
import { unitIdsForAgent, unitIdsForLandlord, unitIdsForPropertyManager } from '../../hooks/portfolio-unit-ids'

import { MaintenanceRequestsService, getOptions } from './maintenance-requests.class'
import {
  maintenanceRequestResolver,
  maintenanceRequestExternalResolver,
  maintenanceRequestDataValidator,
  maintenanceRequestDataResolver,
  maintenanceRequestPatchValidator,
  maintenanceRequestPatchResolver,
  maintenanceRequestQueryValidator,
  maintenanceRequestQueryResolver
} from './maintenance-requests.schema'

export const maintenanceRequestsPath = 'maintenance-requests'
export const maintenanceRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const attachTenant = async (context: HookContext) => {
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  ;(context.data as any).tenantId = user._id.toString()
  return context
}

const tryId = (id: string) => {
  const s = String(id)
  if (ObjectId.isValid(s) && s.length === 24) return new ObjectId(s)
  return s as any
}

const loadMaintenanceRow = async (context: HookContext) => {
  const db = await context.app.get('mongodbClient')
  const col = db.collection('maintenance_requests')
  const raw = String(context.id || '')
  let row: any = await col.findOne({ _id: raw as any })
  if (!row && ObjectId.isValid(raw) && raw.length === 24) {
    row = await col.findOne({ _id: new ObjectId(raw) })
  }
  return row
}

const restrictFind = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []

  if (roles.includes('admin')) return context

  if (roles.includes('landlord')) {
    const unitIds = await unitIdsForLandlord(context.app, user)
    const unitId = unitIds.length === 0 ? { $in: [] } : unitIds.length === 1 ? unitIds[0] : { $in: unitIds }
    mergeQuery(context, { unitId })
    return context
  }

  if (roles.includes('agent')) {
    const unitIds = await unitIdsForAgent(context.app, user._id.toString())
    const unitId = unitIds.length === 0 ? { $in: [] } : unitIds.length === 1 ? unitIds[0] : { $in: unitIds }
    mergeQuery(context, { unitId })
    return context
  }

  if (roles.includes('property_manager')) {
    const unitIds = await unitIdsForPropertyManager(context.app, user._id.toString())
    const unitId = unitIds.length === 0 ? { $in: [] } : unitIds.length === 1 ? unitIds[0] : { $in: unitIds }
    mergeQuery(context, { unitId })
    return context
  }

  if (roles.includes('tenant')) {
    mergeQuery(context, { tenantId: user._id.toString() })
    return context
  }

  throw new errors.Forbidden('You are not allowed to list maintenance requests.')
}

const restrictGet = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  const row = await loadMaintenanceRow(context)
  if (!row) throw new errors.NotFound()

  if (roles.includes('tenant') && String(row.tenantId) === String(user._id)) return context

  const db = await context.app.get('mongodbClient')
  const unit = await db.collection('units').findOne({ _id: tryId(row.unitId) })
  if (!unit) throw new errors.Forbidden()
  const prop = await db.collection('properties').findOne({ _id: tryId(unit.propertyId) })
  if (!prop) throw new errors.Forbidden()

  if (roles.includes('landlord') && String(prop.landlordId) === String(user._id)) return context

  if (roles.includes('agent')) {
    const n = await db.collection('agent_assignments').countDocuments({
      agentUserId: user._id.toString(),
      propertyId: String(unit.propertyId)
    })
    if (n > 0) return context
  }

  if (roles.includes('property_manager')) {
    const n = await db.collection('property_manager_assignments').countDocuments({
      managerUserId: user._id.toString(),
      propertyId: String(unit.propertyId)
    })
    if (n > 0) return context
  }

  throw new errors.Forbidden()
}

const ensurePatchAccess = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  const row = await loadMaintenanceRow(context)
  if (!row) throw new errors.NotFound()

  const db = await context.app.get('mongodbClient')
  const unit = await db.collection('units').findOne({ _id: tryId(row.unitId) })
  if (!unit) throw new errors.Forbidden()
  const prop = await db.collection('properties').findOne({ _id: tryId(unit.propertyId) })
  if (!prop) throw new errors.Forbidden()

  if (roles.includes('landlord') && String(prop.landlordId) === String(user._id)) return context

  if (roles.includes('agent')) {
    const n = await db.collection('agent_assignments').countDocuments({
      agentUserId: user._id.toString(),
      propertyId: String(unit.propertyId)
    })
    if (n > 0) return context
  }

  if (roles.includes('property_manager')) {
    const n = await db.collection('property_manager_assignments').countDocuments({
      managerUserId: user._id.toString(),
      propertyId: String(unit.propertyId)
    })
    if (n > 0) return context
  }

  throw new errors.Forbidden('You cannot update this maintenance request.')
}

export const maintenanceRequests = (app: Application) => {
  app.use(maintenanceRequestsPath, new MaintenanceRequestsService(getOptions(app)), {
    methods: maintenanceRequestsMethods as any,
    events: []
  })

  app.service(maintenanceRequestsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(maintenanceRequestExternalResolver), schemaHooks.resolveResult(maintenanceRequestResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(maintenanceRequestQueryValidator), schemaHooks.resolveQuery(maintenanceRequestQueryResolver)],
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      get: [authenticateIfExternal('jwt'), populateRoles, restrictGet],
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('tenant', 'admin'),
        schemaHooks.validateData(maintenanceRequestDataValidator),
        schemaHooks.resolveData(maintenanceRequestDataResolver),
        attachTenant
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('landlord', 'property_manager', 'admin', 'agent'),
        ensurePatchAccess,
        schemaHooks.validateData(maintenanceRequestPatchValidator),
        schemaHooks.resolveData(maintenanceRequestPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [maintenanceRequestsPath]: MaintenanceRequestsService
  }
}

