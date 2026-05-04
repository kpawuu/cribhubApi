import { hooks as schemaHooks } from '@feathersjs/schema'
import type { Application } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'

import { VirtualViewingRequestsService, getOptions } from './virtual-viewing-requests.class'
import {
  virtualViewingRequestResolver,
  virtualViewingRequestExternalResolver,
  virtualViewingRequestDataValidator,
  virtualViewingRequestDataResolver,
  virtualViewingRequestPatchValidator,
  virtualViewingRequestPatchResolver,
  virtualViewingRequestQueryValidator,
  virtualViewingRequestQueryResolver
} from './virtual-viewing-requests.schema'

export const virtualViewingRequestsPath = 'virtual-viewing-requests'
export const virtualViewingRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const virtualViewingRequests = (app: Application) => {
  app.use(virtualViewingRequestsPath, new VirtualViewingRequestsService(getOptions(app)), {
    methods: virtualViewingRequestsMethods as any,
    events: []
  })

  app.service(virtualViewingRequestsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(virtualViewingRequestExternalResolver), schemaHooks.resolveResult(virtualViewingRequestResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(virtualViewingRequestQueryValidator), schemaHooks.resolveQuery(virtualViewingRequestQueryResolver)],
      // public create supported
      create: [schemaHooks.validateData(virtualViewingRequestDataValidator), schemaHooks.resolveData(virtualViewingRequestDataResolver)],
      find: [authenticateIfExternal('jwt'), requireRole('landlord', 'property_manager', 'admin')],
      get: [authenticateIfExternal('jwt'), requireRole('landlord', 'property_manager', 'admin')],
      patch: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'property_manager', 'admin'),
        schemaHooks.validateData(virtualViewingRequestPatchValidator),
        schemaHooks.resolveData(virtualViewingRequestPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [virtualViewingRequestsPath]: VirtualViewingRequestsService
  }
}

