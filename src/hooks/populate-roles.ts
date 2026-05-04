import type { HookContext } from '../declarations'

/**
 * Ensures `context.params.user.roles` is populated from `user-roles` service.
 * Use this in services that make role decisions without calling `requireRole(...)`.
 */
export const populateRoles = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) return context
  if (Array.isArray(user.roles)) return context

  const res = (await context.app.service('user-roles').find(
    { paginate: false, query: { userId: user._id.toString() } } as any,
    { provider: undefined } as any
  )) as any

  const list = Array.isArray(res) ? res : res?.data || []
  user.roles = list.map((r: any) => r.role)
  return context
}

