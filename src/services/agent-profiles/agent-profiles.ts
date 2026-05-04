import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'

import { AgentProfilesService, getOptions } from './agent-profiles.class'
import {
  agentProfileResolver,
  agentProfileExternalResolver,
  agentProfileDataValidator,
  agentProfileDataResolver,
  agentProfilePatchValidator,
  agentProfilePatchResolver,
  agentProfileQueryValidator,
  agentProfileQueryResolver
} from './agent-profiles.schema'

export const agentProfilesPath = 'agent-profiles'
export const agentProfilesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const attachUserId = async (context: HookContext) => {
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  ;(context.data as any).userId = user._id.toString()
  return context
}

const restrictToSelf = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  // allow admin unrestricted
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  // scope queries and get/patch/remove to their own agent profile
  if (context.method === 'find') {
    mergeQuery(context, { userId: user._id.toString() })
  }
  if (context.id) {
    const existing = await context.app.service(agentProfilesPath).get(context.id as any, { provider: undefined } as any)
    if ((existing as any).userId !== user._id.toString()) throw new errors.Forbidden('Not allowed')
  }
  return context
}

export const agentProfiles = (app: Application) => {
  app.use(agentProfilesPath, new AgentProfilesService(getOptions(app)), {
    methods: agentProfilesMethods as any,
    events: []
  })

  app.service(agentProfilesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(agentProfileExternalResolver), schemaHooks.resolveResult(agentProfileResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(agentProfileQueryValidator), schemaHooks.resolveQuery(agentProfileQueryResolver)],
      // Public directory listing and get are allowed (Find Agent).
      find: [],
      get: [],
      create: [
        authenticateIfExternal('jwt'),
        requireRole('agent', 'admin'),
        schemaHooks.validateData(agentProfileDataValidator),
        schemaHooks.resolveData(agentProfileDataResolver),
        attachUserId
      ],
      patch: [
        authenticateIfExternal('jwt'),
        requireRole('agent', 'admin'),
        restrictToSelf,
        schemaHooks.validateData(agentProfilePatchValidator),
        schemaHooks.resolveData(agentProfilePatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('agent', 'admin'), restrictToSelf]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [agentProfilesPath]: AgentProfilesService
  }
}

