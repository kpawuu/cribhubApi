import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import moment from 'moment'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { RefreshTokensService } from './refresh-tokens.class'
import { userSchema } from '../users/users.schema'

export const refreshTokensSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: Type.String(),
    refreshToken: Type.String(),
    isValid: Type.Optional(Type.Boolean()),
    deviceId: Type.Optional(Type.String()),
    dateCreated: Type.String({ format: 'date-time' }),
    dateUpdated: Type.Optional(Type.String({ format: 'date-time' })),
    user: Type.Ref(userSchema)
  },
  { $id: 'RefreshTokens', additionalProperties: false }
)

export type RefreshTokens = Static<typeof refreshTokensSchema>
export const refreshTokensValidator = getValidator(refreshTokensSchema, dataValidator)
export const refreshTokensResolver = resolve<RefreshTokens, HookContext<RefreshTokensService>>({
  user: virtual(async (token, context) => {
    return context.app.service('users').get(token.userId)
  })
})

export const refreshTokensExternalResolver = resolve<RefreshTokens, HookContext<RefreshTokensService>>({})

export const refreshTokensDataSchema = Type.Pick(refreshTokensSchema, ['userId', 'isValid', 'refreshToken'], {
  $id: 'RefreshTokensData'
})
export type RefreshTokensData = Static<typeof refreshTokensDataSchema>
export const refreshTokensDataValidator = getValidator(refreshTokensDataSchema, dataValidator)
export const refreshTokensDataResolver = resolve<RefreshTokens, HookContext<RefreshTokensService>>({
  dateCreated: async () => moment().toISOString()
})

export const refreshTokensPatchSchema = Type.Partial(refreshTokensSchema, { $id: 'RefreshTokensPatch' })
export type RefreshTokensPatch = Static<typeof refreshTokensPatchSchema>
export const refreshTokensPatchValidator = getValidator(refreshTokensPatchSchema, dataValidator)
export const refreshTokensPatchResolver = resolve<RefreshTokens, HookContext<RefreshTokensService>>({
  dateUpdated: async () => moment().toISOString()
})

export const refreshTokensQueryProperties = Type.Pick(refreshTokensSchema, ['_id', 'userId', 'isValid', 'refreshToken'])
export const refreshTokensQuerySchema = Type.Intersect(
  [querySyntax(refreshTokensQueryProperties), Type.Object({}, { additionalProperties: false })],
  { additionalProperties: false }
)
export type RefreshTokensQuery = Static<typeof refreshTokensQuerySchema>
export const refreshTokensQueryValidator = getValidator(refreshTokensQuerySchema, queryValidator)
export const refreshTokensQueryResolver = resolve<RefreshTokensQuery, HookContext<RefreshTokensService>>({})

