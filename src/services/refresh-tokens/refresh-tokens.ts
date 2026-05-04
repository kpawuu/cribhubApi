import { hooks as schemaHooks } from '@feathersjs/schema'
import { authenticate } from '@feathersjs/authentication'
import { logoutUser, revokeRefreshToken, refreshAccessToken } from '@w3lcome/feathers-refresh-token'

import type { Application, HookContext } from '../../declarations'
import { RefreshTokensService, getOptions } from './refresh-tokens.class'
import {
  refreshTokensDataValidator,
  refreshTokensPatchValidator,
  refreshTokensQueryValidator,
  refreshTokensResolver,
  refreshTokensExternalResolver,
  refreshTokensDataResolver,
  refreshTokensPatchResolver,
  refreshTokensQueryResolver
} from './refresh-tokens.schema'

const asAppHook = <T>(_hook: any) => _hook as (context: HookContext) => Promise<HookContext>

export const refreshTokensPath = 'refresh-tokens'
export const refreshTokensMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const refreshTokens = (app: Application) => {
  app.use(refreshTokensPath, new RefreshTokensService(getOptions(app)), {
    methods: refreshTokensMethods as any,
    events: []
  })

  app.service(refreshTokensPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(refreshTokensExternalResolver), schemaHooks.resolveResult(refreshTokensResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(refreshTokensQueryValidator), schemaHooks.resolveQuery(refreshTokensQueryResolver)],
      create: [
        schemaHooks.validateData(refreshTokensDataValidator),
        schemaHooks.resolveData(refreshTokensDataResolver),
        asAppHook<RefreshTokensService>(refreshAccessToken())
      ],
      patch: [
        authenticate('jwt'),
        schemaHooks.validateData(refreshTokensPatchValidator),
        schemaHooks.resolveData(refreshTokensPatchResolver),
        asAppHook<RefreshTokensService>(revokeRefreshToken())
      ],
      remove: [authenticate('jwt'), asAppHook<RefreshTokensService>(logoutUser())]
    },
    after: {
      remove: [asAppHook<RefreshTokensService>(logoutUser())]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [refreshTokensPath]: RefreshTokensService
  }
}

