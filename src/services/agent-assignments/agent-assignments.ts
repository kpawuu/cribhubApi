import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { restrictQueryToOwner } from '../../hooks/restrict-query-to-owner'

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

const restrictFind = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []

  // Agents see assignments for themselves; landlords see theirs by joining via property ownership
  if (roles.includes('agent') && !roles.includes('admin')) {
    mergeQuery(context, { agentUserId: user._id.toString() })
  }
  return context
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
      find: [authenticateIfExternal('jwt'), restrictFind],
      get: [authenticateIfExternal('jwt')],
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

