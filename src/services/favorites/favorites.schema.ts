import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const favoriteSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: Type.String(),
    propertyId: Type.String(),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'Favorite', additionalProperties: false }
)

export type Favorite = Static<typeof favoriteSchema>
export const favoriteValidator = getValidator(favoriteSchema, dataValidator)
export const favoriteResolver = resolve<Favorite, HookContext>({})
export const favoriteExternalResolver = resolve<Favorite, HookContext>({})

export const favoriteDataSchema = Type.Object(
  {
    propertyId: Type.String()
  },
  { $id: 'FavoriteData', additionalProperties: false }
)

export type FavoriteData = Static<typeof favoriteDataSchema>
export const favoriteDataValidator = getValidator(favoriteDataSchema, dataValidator)
export const favoriteDataResolver = resolve<Favorite, HookContext>({
  createdAt: async () => new Date().toISOString()
})

export const favoritePatchSchema = Type.Partial(Type.Omit(favoriteSchema, ['_id', 'userId', 'propertyId', 'createdAt']), {
  $id: 'FavoritePatch'
})
export type FavoritePatch = Static<typeof favoritePatchSchema>
export const favoritePatchValidator = getValidator(favoritePatchSchema, dataValidator)
export const favoritePatchResolver = resolve<Favorite, HookContext>({})

export const favoriteQueryProperties = Type.Pick(favoriteSchema, ['_id', 'userId', 'propertyId', 'createdAt'])
export const favoriteQuerySchema = Type.Intersect(
  [querySyntax(favoriteQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type FavoriteQuery = Static<typeof favoriteQuerySchema>
export const favoriteQueryValidator = getValidator(favoriteQuerySchema, queryValidator)
export const favoriteQueryResolver = resolve<FavoriteQuery, HookContext>({})
