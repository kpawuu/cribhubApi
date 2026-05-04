import { authenticate } from '@feathersjs/authentication'
import type { HookContext } from '../declarations'

/** For external calls: run JWT auth only when Authorization is present (allows anonymous catalog reads). */
export const authenticateIfJwtPresent = () => {
  const authHook = authenticate('jwt')
  return async (context: HookContext) => {
    if (!context.params.provider) return context

    const headers: any =
      (context.params as any)?.headers ||
      (context.params as any)?.koa?.ctx?.headers ||
      (context.params as any)?.koa?.ctx?.request?.headers ||
      (context.params as any)?.koa?.ctx?.req?.headers

    const authorization = headers?.authorization || headers?.Authorization
    if (!authorization) return context

    return authHook(context as any)
  }
}
