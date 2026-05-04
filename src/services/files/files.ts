import { hooks as schemaHooks } from '@feathersjs/schema'
import type { Application } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'

import { FilesService, getOptions } from './files.class'
import {
  filesResolver,
  filesExternalResolver,
  filesDataValidator,
  filesDataResolver,
  filesPatchValidator,
  filesPatchResolver,
  filesQueryValidator,
  filesQueryResolver
} from './files.schema'

export const filesPath = 'files'
export const filesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const files = (app: Application) => {
  app.use(filesPath, new FilesService(getOptions(app)), {
    methods: filesMethods as any,
    events: []
  })

  app.service(filesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(filesExternalResolver), schemaHooks.resolveResult(filesResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(filesQueryValidator), schemaHooks.resolveQuery(filesQueryResolver)],
      find: [authenticateIfExternal('jwt')],
      get: [authenticateIfExternal('jwt')],
      create: [authenticateIfExternal('jwt'), schemaHooks.validateData(filesDataValidator), schemaHooks.resolveData(filesDataResolver)],
      patch: [authenticateIfExternal('jwt'), schemaHooks.validateData(filesPatchValidator), schemaHooks.resolveData(filesPatchResolver)],
      remove: [authenticateIfExternal('jwt')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [filesPath]: FilesService
  }
}

