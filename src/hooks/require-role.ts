import { errors } from '@feathersjs/errors'
import type { HookContext } from '../declarations'

export const requireRole = (...allowedRoles: string[]) => {
  return async (context: HookContext) => {
    // Internal service calls (provider undefined) are trusted server-side calls.
    // Allow them to proceed without role gating so cross-service hooks can patch/update records.
    if (!context.params.provider) return context

    const user = context.params.user as any
    if (!user?._id) {
      throw new errors.NotAuthenticated()
    }

    // Prefer roles embedded on user (if present), otherwise query user-roles service
    const embeddedRoles: string[] | undefined = Array.isArray(user.roles) ? user.roles : undefined

    // IMPORTANT: use an internal call (no provider) so service hooks don't require auth
    const roles =
      embeddedRoles ||
      (((await context.app.service('user-roles').find(
        {
          paginate: false,
          query: { userId: user._id.toString() }
        } as any,
        { provider: undefined } as any
      )) as unknown as any[])?.map((r) => r.role) as string[])

    // Cache roles on params.user for downstream hooks
    ;(user.roles as any) = roles

    const ok = roles?.some((r) => allowedRoles.includes(r))
    if (!ok) {
      throw new errors.Forbidden('You are not allowed to access this resource.')
    }
    return context
  }
}

