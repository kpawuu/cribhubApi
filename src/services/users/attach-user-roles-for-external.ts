import type { HookContext } from '../../declarations'

function toRelation(row: any) {
  return {
    _id: row?._id != null ? String(row._id) : undefined,
    userId: String(row.userId),
    role: row.role,
    createdAt: row.createdAt != null ? String(row.createdAt) : undefined
  }
}

/**
 * Batches `user-roles` for all users in the response and attaches `userRoles` + `roles`
 * (external clients only). Avoids N+1 queries on `users.find`.
 */
export const attachUserRolesForExternal = async (context: HookContext) => {
  if (!context.params.provider) return context

  const collectUsers = (): any[] => {
    const r = context.result as any
    if (context.method === 'find') {
      if (Array.isArray(r)) return r
      if (r?.data && Array.isArray(r.data)) return r.data
      return []
    }
    if (r && typeof r === 'object' && r._id != null) return [r]
    return []
  }

  const users = collectUsers()
  if (!users.length) return context

  const ids = [...new Set(users.map((u: any) => u?._id?.toString?.()).filter(Boolean))]
  if (!ids.length) return context

  const res = (await context.app.service('user-roles').find(
    {
      paginate: false,
      query: ids.length === 1 ? { userId: ids[0] } : { userId: { $in: ids } }
    } as any,
    { provider: undefined } as any
  )) as any

  const rows = Array.isArray(res) ? res : res?.data || []
  const byUser = new Map<string, any[]>()
  for (const row of rows) {
    const uid = String(row.userId)
    if (!byUser.has(uid)) byUser.set(uid, [])
    byUser.get(uid)!.push(toRelation(row))
  }

  for (const u of users) {
    const id = u?._id?.toString?.()
    if (!id) continue
    const rel = byUser.get(id) || []
    u.userRoles = rel
    u.roles = rel.map((x: any) => x.role)
  }

  return context
}
