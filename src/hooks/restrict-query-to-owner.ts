import type { HookContext } from '../declarations'
import { errors } from '@feathersjs/errors'

/**
 * Restrict external queries to records owned by the current user unless they have one of the privileged roles.
 * Intended for services that store an explicit owner field (e.g. landlordId).
 */
export const restrictQueryToOwner = (ownerField: string, privilegedRoles: string[] = ['admin']) => {
  return async (context: HookContext) => {
    if (!context.params.provider) return context

    const user = context.params.user as any
    if (!user?._id) throw new errors.NotAuthenticated()

    // If user has privileged roles, skip restriction.
    if (Array.isArray(user.roles) && user.roles.some((r: string) => privilegedRoles.includes(r))) {
      return context
    }

    // Mutate in place so the non-enumerable VALIDATED flag from validateQuery is preserved.
    const query = context.params.query || (context.params.query = {} as Record<string, unknown>)
    ;(query as Record<string, unknown>)[ownerField] = user._id.toString()
    return context
  }
}

