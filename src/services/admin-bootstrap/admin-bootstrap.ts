import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'

export const adminBootstrapPath = 'admin-bootstrap'

/**
 * One-off / dev bootstrap for admin accounts. Gated by `ADMIN_BOOTSTRAP_SECRET` (min 16 chars).
 * Not authenticated — protect with a strong secret and disable in production if you prefer DB-only ops.
 */
export class AdminBootstrapService {
  async create(data: any, params: any) {
    const expected = process.env.ADMIN_BOOTSTRAP_SECRET
    if (!expected || String(expected).length < 16) {
      throw new errors.Forbidden(
        'ADMIN_BOOTSTRAP_SECRET is not set or too short (min 16 characters). Set it in the API environment to enable this endpoint.'
      )
    }
    if (String(data?.secret ?? '') !== String(expected)) {
      throw new errors.Forbidden('Invalid bootstrap secret.')
    }

    const app = params.app as Application
    const email = String(data?.email ?? '')
      .trim()
      .toLowerCase()
    if (!email) throw new errors.BadRequest('email is required')

    const mode = String(data?.mode ?? '').toLowerCase()
    if (mode !== 'create' && mode !== 'promote') {
      throw new errors.BadRequest('mode must be "create" or "promote".')
    }

    const hasAdminRole = async (userId: string) => {
      const res = (await app.service('user-roles').find(
        { paginate: false, query: { userId, role: 'admin' } } as any,
        { provider: undefined } as any
      )) as any
      const list = Array.isArray(res) ? res : res?.data || []
      return list.length > 0
    }

    const grantAdmin = async (userId: string) => {
      if (await hasAdminRole(userId)) {
        return { ok: true, userId, email, mode, message: 'User already has admin role.' }
      }
      await app.service('user-roles').create({ userId, role: 'admin' } as any, { provider: undefined } as any)
      return { ok: true, userId, email, mode, message: 'Admin role granted.' }
    }

    if (mode === 'promote') {
      const usersRes = (await app.service('users').find(
        { paginate: false, query: { email } } as any,
        { provider: undefined } as any
      )) as any
      const ulist = Array.isArray(usersRes) ? usersRes : usersRes?.data || []
      const u = ulist[0]
      if (!u) throw new errors.NotFound('No user with that email.')

      const userId = u._id?.toString?.() ? u._id.toString() : String(u._id)
      await app.service('users').patch(userId, { isVerified: true } as any, { provider: undefined } as any)
      return await grantAdmin(userId)
    }

    // mode === 'create'
    const password = String(data?.password ?? '')
    const fullName = String(data?.fullName ?? '').trim()
    if (!fullName) throw new errors.BadRequest('fullName is required for mode "create".')
    if (password.length < 8) throw new errors.BadRequest('password must be at least 8 characters.')

    const existing = (await app.service('users').find(
      { paginate: false, query: { email } } as any,
      { provider: undefined } as any
    )) as any
    const elist = Array.isArray(existing) ? existing : existing?.data || []
    if (elist.length > 0) {
      throw new errors.BadRequest(
        'A user with this email already exists. Use mode "promote" with the same email to grant admin.'
      )
    }

    const created = (await app.service('users').create(
      {
        email,
        password,
        fullName,
        ...(typeof data?.phone === 'string' && data.phone.trim() ? { phone: data.phone.trim() } : {})
      } as any,
      { provider: undefined } as any
    )) as any

    const userId = created._id?.toString?.() ? created._id.toString() : String(created._id)

    await app.service('users').patch(userId, { isVerified: true } as any, { provider: undefined } as any)

    if (!(await hasAdminRole(userId))) {
      await app.service('user-roles').create({ userId, role: 'admin' } as any, { provider: undefined } as any)
    }

    return {
      ok: true,
      userId,
      email,
      mode,
      message:
        'Admin user ready: default tenant role (from signup hooks) plus admin. Sign in with email and password.',
      roles: ['tenant', 'admin']
    }
  }
}

export const adminBootstrap = (app: Application) => {
  app.use(adminBootstrapPath, new AdminBootstrapService() as any, { methods: ['create'], events: [] })

  app.service(adminBootstrapPath).hooks({
    before: {
      create: [
        async (context: HookContext) => {
          ;(context.params as any).app = context.app
          return context
        }
      ]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [adminBootstrapPath]: AdminBootstrapService
  }
}
