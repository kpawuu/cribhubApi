import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { UserRolesService, getOptions } from './user-roles.class'
import {
  userRoleResolver,
  userRoleExternalResolver,
  userRoleDataValidator,
  userRoleDataResolver,
  userRolePatchValidator,
  userRolePatchResolver,
  userRoleQueryValidator,
  userRoleQueryResolver
} from './user-roles.schema'

export const userRolesPath = 'user-roles'
export const userRolesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const restrictExternalCreate = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const { userId, role } = context.data as any
  if (userId !== user._id.toString()) {
    throw new errors.Forbidden('Cannot assign roles for another user.')
  }
  if (role !== 'tenant') {
    throw new errors.Forbidden('Only tenant role can be self-assigned.')
  }
  return context
}

export const userRoles = (app: Application) => {
  app.use(userRolesPath, new UserRolesService(getOptions(app)), {
    methods: userRolesMethods as any,
    events: []
  })

  app.service(userRolesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(userRoleExternalResolver), schemaHooks.resolveResult(userRoleResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(userRoleQueryValidator), schemaHooks.resolveQuery(userRoleQueryResolver)],
      find: [authenticateIfExternal('jwt')],
      get: [authenticateIfExternal('jwt')],
      create: [
        // internal calls allowed; external require auth + restrictions
        schemaHooks.validateData(userRoleDataValidator),
        schemaHooks.resolveData(userRoleDataResolver),
        authenticateIfExternal('jwt'),
        restrictExternalCreate
      ],
      patch: [authenticateIfExternal('jwt'), schemaHooks.validateData(userRolePatchValidator), schemaHooks.resolveData(userRolePatchResolver)],
      remove: [authenticateIfExternal('jwt')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [userRolesPath]: UserRolesService
  }
}

