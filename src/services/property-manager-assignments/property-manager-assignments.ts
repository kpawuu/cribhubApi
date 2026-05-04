import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { populateRoles } from '../../hooks/populate-roles'
import { requireRole } from '../../hooks/require-role'

import { PropertyManagerAssignmentsService, getOptions } from './property-manager-assignments.class'
import {
  propertyManagerAssignmentResolver,
  propertyManagerAssignmentExternalResolver,
  propertyManagerAssignmentDataValidator,
  propertyManagerAssignmentDataResolver,
  propertyManagerAssignmentPatchValidator,
  propertyManagerAssignmentPatchResolver,
  propertyManagerAssignmentQueryValidator,
  propertyManagerAssignmentQueryResolver
} from './property-manager-assignments.schema'

export const propertyManagerAssignmentsPath = 'property-manager-assignments'
export const propertyManagerAssignmentsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const listFromFind = (res: any): any[] => (Array.isArray(res) ? res : res?.data || [])

const userHasPmRole = async (app: Application, userId: string): Promise<boolean> => {
  const res = (await app.service('user-roles').find(
    { paginate: false, query: { userId, role: 'property_manager' } } as any,
    { provider: undefined } as any
  )) as any
  return listFromFind(res).length > 0
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
  throw new errors.Forbidden('You are not allowed to list property manager assignments.')
}

const ensureLandlordOrAdminCreates = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context
  if (!roles.includes('landlord')) throw new errors.Forbidden('Only landlords or admins can assign property managers.')

  const propertyId = String((context.data as any)?.propertyId || '')
  const prop = await context.app.service('properties').get(propertyId, { provider: undefined } as any)
  if (String((prop as any).landlordId) !== String(user._id)) {
    throw new errors.Forbidden('You can only assign managers to your own properties.')
  }
  return context
}

const ensureManagerIsApprovedPm = async (context: HookContext) => {
  const mid = String((context.data as any)?.managerUserId || '').trim()
  if (!mid) throw new errors.BadRequest('managerUserId is required')
  if (!(await userHasPmRole(context.app, mid))) {
    throw new errors.BadRequest('That user is not an approved property manager (admin must approve their role first).')
  }
  return context
}

const preventDuplicateAssignment = async (context: HookContext) => {
  if (context.method !== 'create') return context
  const d = context.data as any
  const db = await context.app.get('mongodbClient')
  const dup = await db.collection('property_manager_assignments').findOne({
    propertyId: String(d.propertyId),
    managerUserId: String(d.managerUserId)
  })
  if (dup) throw new errors.BadRequest('This property manager is already assigned to that property.')
  return context
}

const loadRow = async (app: Application, id: string) => {
  const db = await app.get('mongodbClient')
  return db.collection('property_manager_assignments').findOne({ _id: id as any })
}

const assertGetOrRemove = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context
  const row = await loadRow(context.app, String(context.id || ''))
  if (!row) throw new errors.NotFound()
  const uid = user._id.toString()
  if (roles.includes('landlord') && String(row.landlordId) === uid) return context
  if (roles.includes('property_manager') && String(row.managerUserId) === uid) return context
  throw new errors.Forbidden()
}

export const propertyManagerAssignments = (app: Application) => {
  app.use(propertyManagerAssignmentsPath, new PropertyManagerAssignmentsService(getOptions(app)), {
    methods: propertyManagerAssignmentsMethods as any,
    events: []
  })

  app.service(propertyManagerAssignmentsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(propertyManagerAssignmentExternalResolver),
        schemaHooks.resolveResult(propertyManagerAssignmentResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(propertyManagerAssignmentQueryValidator), schemaHooks.resolveQuery(propertyManagerAssignmentQueryResolver)],
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      get: [authenticateIfExternal('jwt'), populateRoles, assertGetOrRemove],
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('landlord', 'admin'),
        ensureLandlordOrAdminCreates,
        schemaHooks.validateData(propertyManagerAssignmentDataValidator),
        schemaHooks.resolveData(propertyManagerAssignmentDataResolver),
        ensureManagerIsApprovedPm,
        preventDuplicateAssignment
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('admin'),
        schemaHooks.validateData(propertyManagerAssignmentPatchValidator),
        schemaHooks.resolveData(propertyManagerAssignmentPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), populateRoles, assertGetOrRemove, requireRole('landlord', 'admin', 'property_manager')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [propertyManagerAssignmentsPath]: PropertyManagerAssignmentsService
  }
}
