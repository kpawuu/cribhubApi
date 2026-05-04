// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from './declarations'
import { issueRefreshToken } from '@w3lcome/feathers-refresh-token'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

const checkIfUserVerified = () => {
  return async (context: HookContext) => {
    const result = context.result as any
    if (result?.user && result.user.isVerified === false) {
      throw new errors.Forbidden('Your account is not verified. Please contact support.')
    }
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  // Optional OAuth strategies (enable via config if needed)
  authentication.register('google', new OAuthStrategy())
  authentication.register('facebook', new OAuthStrategy())

  app.use('authentication', authentication)
  app.service('authentication').hooks({
    after: {
      create: [checkIfUserVerified(), issueRefreshToken() as any]
    }
  })

  app.configure(oauth())
}

