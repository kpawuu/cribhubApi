import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'

import { PropertyManagerProfilesService, getOptions } from './property-manager-profiles.class'
import {
  propertyManagerProfileResolver,
  propertyManagerProfileExternalResolver,
  propertyManagerProfileDataValidator,
  propertyManagerProfileDataResolver,
  propertyManagerProfilePatchValidator,
  propertyManagerProfilePatchResolver,
  propertyManagerProfileQueryValidator,
  propertyManagerProfileQueryResolver
} from './property-manager-profiles.schema'

export const propertyManagerProfilesPath = 'property-manager-profiles'
export const propertyManagerProfilesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

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

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  if (context.method === 'find') {
    mergeQuery(context, { userId: user._id.toString() })
  }
  if (context.id) {
    const existing = await context.app
      .service(propertyManagerProfilesPath)
      .get(context.id as any, { provider: undefined } as any)
    if ((existing as any).userId !== user._id.toString()) throw new errors.Forbidden('Not allowed')
  }
  return context
}

export const propertyManagerProfiles = (app: Application) => {
  app.use(propertyManagerProfilesPath, new PropertyManagerProfilesService(getOptions(app)), {
    methods: propertyManagerProfilesMethods as any,
    events: []
  })

  app.service(propertyManagerProfilesPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(propertyManagerProfileExternalResolver),
        schemaHooks.resolveResult(propertyManagerProfileResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(propertyManagerProfileQueryValidator),
        schemaHooks.resolveQuery(propertyManagerProfileQueryResolver)
      ],
      // Public directory listing and get (Find a property manager).
      find: [],
      get: [],
      create: [
        authenticateIfExternal('jwt'),
        requireRole('property_manager', 'admin'),
        schemaHooks.validateData(propertyManagerProfileDataValidator),
        schemaHooks.resolveData(propertyManagerProfileDataResolver),
        attachUserId
      ],
      patch: [
        authenticateIfExternal('jwt'),
        requireRole('property_manager', 'admin'),
        restrictToSelf,
        schemaHooks.validateData(propertyManagerProfilePatchValidator),
        schemaHooks.resolveData(propertyManagerProfilePatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('property_manager', 'admin'), restrictToSelf]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [propertyManagerProfilesPath]: PropertyManagerProfilesService
  }
}
