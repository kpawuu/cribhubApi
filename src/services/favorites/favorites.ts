import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'

import { FavoritesService, getOptions } from './favorites.class'
import {
  favoriteResolver,
  favoriteExternalResolver,
  favoriteDataValidator,
  favoriteDataResolver,
  favoritePatchValidator,
  favoritePatchResolver,
  favoriteQueryValidator,
  favoriteQueryResolver
} from './favorites.schema'

export const favoritesPath = 'favorites'
export const favoritesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

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
    const existing = await context.app.service(favoritesPath).get(context.id as any, { provider: undefined } as any)
    if ((existing as any).userId !== user._id.toString()) throw new errors.Forbidden('Not allowed')
  }
  return context
}

const assertUniqueFavorite = async (context: HookContext) => {
  const user = context.params.user as any
  const propertyId = (context.data as any)?.propertyId
  if (!propertyId) throw new errors.BadRequest('propertyId is required')
  const db = await context.app.get('mongodbClient')
  const dup = await db.collection('favorites').countDocuments({ userId: user._id.toString(), propertyId })
  if (dup > 0) throw new errors.BadRequest('Property is already in favorites')
  return context
}

export const favorites = (app: Application) => {
  app.use(favoritesPath, new FavoritesService(getOptions(app)), {
    methods: favoritesMethods as any,
    events: []
  })

  app.service(favoritesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(favoriteExternalResolver), schemaHooks.resolveResult(favoriteResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(favoriteQueryValidator), schemaHooks.resolveQuery(favoriteQueryResolver)],
      find: [authenticateIfExternal('jwt'), restrictToSelf],
      get: [authenticateIfExternal('jwt'), restrictToSelf],
      create: [
        authenticateIfExternal('jwt'),
        restrictToSelf,
        assertUniqueFavorite,
        schemaHooks.validateData(favoriteDataValidator),
        schemaHooks.resolveData(favoriteDataResolver),
        attachUserId
      ],
      patch: [
        authenticateIfExternal('jwt'),
        restrictToSelf,
        schemaHooks.validateData(favoritePatchValidator),
        schemaHooks.resolveData(favoritePatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), restrictToSelf]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [favoritesPath]: FavoritesService
  }
}
