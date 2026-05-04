import { authenticate } from '@feathersjs/authentication'
import type { HookContext } from '../declarations'

export const authenticateIfExternal = (...strategies: string[]) => {
  const chosen = strategies.length ? strategies : ['jwt']
  // Avoid TS tuple/spread typing issues by casting through unknown
  const authHook = authenticate(...(chosen as unknown as [string, ...string[]]))
  return async (context: HookContext) => {
    if (!context.params.provider) return context
    return authHook(context as any)
  }
}

