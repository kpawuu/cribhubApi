import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'

import { AgentAssignmentsService, getOptions } from './agent-assignments.class'
import {
  agentAssignmentResolver,
  agentAssignmentExternalResolver,
  agentAssignmentDataValidator,
  agentAssignmentDataResolver,
  agentAssignmentPatchValidator,
  agentAssignmentPatchResolver,
  agentAssignmentQueryValidator,
  agentAssignmentQueryResolver
} from './agent-assignments.schema'

export const agentAssignmentsPath = 'agent-assignments'
export const agentAssignmentsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const attachAssignedBy = async (context: HookContext) => {
  const user = context.params.user as any
  if (user?._id) (context.data as any).assignedBy = user._id.toString()
  return context
}

/** After create: store agentUserId on the property document for fast lookup. */
const syncPropertyAgentOnCreate = async (context: HookContext) => {
  const result = context.result as any
  const { propertyId, agentUserId } = result || {}
  if (!propertyId || !agentUserId) return context
  try {
    await context.app
      .service('properties')
      .patch(propertyId, { agentUserId } as any, { provider: undefined } as any)
  } catch (err: any) {
    ;(context.app as any).logger?.warn?.('syncPropertyAgentOnCreate failed', err?.message)
  }
  return context
}

/** After remove: clear agentUserId from the property document. */
const clearPropertyAgentOnRemove = async (context: HookContext) => {
  const result = context.result as any
  const propertyId = result?.propertyId
  if (!propertyId) return context
  try {
    await context.app
      .service('properties')
      .patch(propertyId, { agentUserId: null } as any, { provider: undefined } as any)
  } catch (err: any) {
    ;(context.app as any).logger?.warn?.('clearPropertyAgentOnRemove failed', err?.message)
  }
  return context
}

const ensurePropertyOwnedByLandlordUnlessAdmin = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  const propertyId = (context.data as any)?.propertyId
  if (!propertyId) return context
  const property = await context.app.service('properties').get(propertyId, { provider: undefined } as any)
  if ((property as any).landlordId !== user._id.toString()) {
    throw new errors.Forbidden('You can only assign agents to your own properties.')
  }
  return context
}

async function loadAssignmentRow(context: HookContext) {
  const db = await context.app.get('mongodbClient')
  const col = db.collection('agent_assignments')
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
  const uid = user._id.toString()

  if (roles.includes('admin')) return context

  if (roles.includes('landlord') && !roles.includes('admin')) {
    const db = await context.app.get('mongodbClient')
    const propIds = (await db.collection('properties').distinct('_id', { landlordId: uid })).map((x) => String(x))
    if (!propIds.length) {
      mergeQuery(context, { propertyId: '__none__' })
    } else if (propIds.length === 1) {
      mergeQuery(context, { propertyId: propIds[0] })
    } else {
      mergeQuery(context, { propertyId: { $in: propIds } })
    }
    return context
  }

  if (roles.includes('property_manager') && !roles.includes('admin')) {
    const db = await context.app.get('mongodbClient')
    const assigns = await db.collection('property_manager_assignments').find({ managerUserId: uid }).project({ propertyId: 1 }).toArray()
    const pids = [...new Set(assigns.map((a: any) => String(a.propertyId)).filter(Boolean))]
    if (!pids.length) {
      mergeQuery(context, { propertyId: '__none__' })
    } else if (pids.length === 1) {
      mergeQuery(context, { propertyId: pids[0] })
    } else {
      mergeQuery(context, { propertyId: { $in: pids } })
    }
    return context
  }

  if (roles.includes('agent') && !roles.includes('admin')) {
    mergeQuery(context, { agentUserId: uid })
    return context
  }

  throw new errors.Forbidden('You are not allowed to list agent assignments.')
}

const restrictAssignmentGet = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const uid = user._id.toString()

  const row = await loadAssignmentRow(context)
  if (!row) throw new errors.NotFound()

  if (roles.includes('admin')) return context
  if (roles.includes('agent') && String(row.agentUserId) === uid) return context

  const db = await context.app.get('mongodbClient')
  const pid = String(row.propertyId || '')
  const propIdQuery =
    ObjectId.isValid(pid) && pid.length === 24 ? new ObjectId(pid) : pid
  const prop = await db.collection('properties').findOne({ _id: propIdQuery as any })
  if (!prop) throw new errors.Forbidden()

  if (roles.includes('landlord') && String(prop.landlordId) === uid) return context

  if (roles.includes('property_manager')) {
    const n = await db.collection('property_manager_assignments').countDocuments({
      managerUserId: uid,
      propertyId: String(row.propertyId)
    })
    if (n > 0) return context
  }

  throw new errors.Forbidden('You cannot access this assignment.')
}

export const agentAssignments = (app: Application) => {
  app.use(agentAssignmentsPath, new AgentAssignmentsService(getOptions(app)), {
    methods: agentAssignmentsMethods as any,
    events: []
  })

  app.service(agentAssignmentsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(agentAssignmentExternalResolver), schemaHooks.resolveResult(agentAssignmentResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(agentAssignmentQueryValidator), schemaHooks.resolveQuery(agentAssignmentQueryResolver)],
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      get: [authenticateIfExternal('jwt'), populateRoles, restrictAssignmentGet],
      create: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin'),
        schemaHooks.validateData(agentAssignmentDataValidator),
        schemaHooks.resolveData(agentAssignmentDataResolver),
        ensurePropertyOwnedByLandlordUnlessAdmin,
        attachAssignedBy
      ],
      patch: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin'),
        schemaHooks.validateData(agentAssignmentPatchValidator),
        schemaHooks.resolveData(agentAssignmentPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('landlord', 'admin')]
    },
    after: {
      create: [syncPropertyAgentOnCreate],
      remove: [clearPropertyAgentOnRemove]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [agentAssignmentsPath]: AgentAssignmentsService
  }
}

