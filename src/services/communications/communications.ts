import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { restrictQueryToOwner } from '../../hooks/restrict-query-to-owner'

import { CommunicationsService, getOptions } from './communications.class'
import {
  communicationResolver,
  communicationExternalResolver,
  communicationDataValidator,
  communicationDataResolver,
  communicationPatchValidator,
  communicationPatchResolver,
  communicationQueryValidator,
  communicationQueryResolver
} from './communications.schema'

export const communicationsPath = 'communications'
export const communicationsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const attachLandlordId = async (context: HookContext) => {
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
  const data = context.data as any
  if (roles.includes('admin')) {
    const lid = data.landlordId != null ? String(data.landlordId).trim() : ''
    data.landlordId = lid || user?._id?.toString()
    return context
  }
  if (roles.includes('property_manager')) {
    const lid = data.landlordId != null ? String(data.landlordId).trim() : ''
    if (!lid) throw new errors.BadRequest('landlordId is required')
    data.landlordId = lid
    return context
  }
  data.landlordId = user?._id?.toString()
  return context
}

export const communications = (app: Application) => {
  app.use(communicationsPath, new CommunicationsService(getOptions(app)), {
    methods: communicationsMethods as any,
    events: []
  })

  app.service(communicationsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(communicationExternalResolver), schemaHooks.resolveResult(communicationResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(communicationQueryValidator), schemaHooks.resolveQuery(communicationQueryResolver)],
      find: [authenticateIfExternal('jwt'), restrictQueryToOwner('landlordId', ['admin', 'property_manager'])],
      get: [authenticateIfExternal('jwt')],
      create: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin', 'property_manager'),
        schemaHooks.validateData(communicationDataValidator),
        schemaHooks.resolveData(communicationDataResolver),
        attachLandlordId
      ],
      patch: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin', 'property_manager'),
        schemaHooks.validateData(communicationPatchValidator),
        schemaHooks.resolveData(communicationPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [communicationsPath]: CommunicationsService
  }
}

