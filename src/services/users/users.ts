import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { mergeQuery } from '../../hooks/merge-query'
import type { Application, HookContext } from '../../declarations'
import { UsersService, getOptions } from './users.class'
import { addVerification, removeVerification } from 'feathers-authentication-management'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import {
  userResolver,
  userExternalResolver,
  userDataValidator,
  userDataResolver,
  userPatchValidator,
  userPatchResolver,
  userQueryValidator,
  userQueryResolver
} from './users.schema'
import { attachUserRolesForExternal } from './attach-user-roles-for-external'

export const usersPath = 'users'
export const usersMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const authManagementFieldNames = [
  'isVerified',
  'verifyToken',
  'verifyShortToken',
  'verifyExpires',
  'verifyChanges',
  'resetToken',
  'resetShortToken',
  'resetExpires',
  'resetAttempts'
] as const

const getRolesForRequest = async (context: HookContext): Promise<string[]> => {
  const user = context.params.user as any
  if (!user?._id) return []

  const embeddedRoles: string[] | undefined = Array.isArray(user.roles) ? user.roles : undefined
  if (embeddedRoles) return embeddedRoles

  const userId = user._id.toString()
  const res = (await context.app.service('user-roles').find(
    { paginate: false, query: { userId } } as any,
    { provider: undefined } as any
  )) as unknown as any[]

  return (res || []).map((r) => r.role).filter(Boolean)
}

const restrictUsersExternalAccess = async (context: HookContext): Promise<HookContext> => {
  // Only restrict external calls.
  if (!context.params.provider) return context

  const user = context.params.user as any
  const userId = user?._id?.toString?.()
  if (!userId) throw new errors.NotAuthenticated()

  const roles = await getRolesForRequest(context)
  const isAdmin = roles.includes('admin')
  if (isAdmin) return context

  // For `find`, we restrict query by _id.
  if (context.method === 'find') {
    mergeQuery(context, { _id: userId })
    return context
  }

  // For `get`/`patch`/`remove`, we restrict to the caller's user document.
  const targetId = context.id?.toString?.() || context.id
  if (String(targetId) !== String(userId)) {
    // patch/remove are still self-only; but `get` is allowed for any authenticated
    // user so contracts, chat, and other features can display names/emails.
    if (context.method !== 'get') {
      throw new errors.Forbidden('You are not allowed to access this resource.')
    }
  }

  return context
}

const stripAuthManagementFieldsFromExternalPatch = async (context: HookContext): Promise<HookContext> => {
  if (!context.params.provider) return context
  const data = context.data as any
  if (!data || typeof data !== 'object') return context

  // Prevent external users from patching auth-management-related verification/reset fields.
  for (const field of authManagementFieldNames) delete data[field]
  // Virtual relation fields (stored only on `user-roles`)
  delete data.roles
  delete data.userRoles
  return context
}

const autoVerifyIfEnabled = () => {
  return async (context: HookContext) => {
    if (process.env.AUTO_VERIFY_USERS !== 'true') return context
    const created = context.result as any
    const id = created?._id?.toString?.()
    if (!id) return context

    // Mark verified for local/dev convenience (still keeps auth-management flow available)
    const patched = await context.app.service('users').patch(id, { isVerified: true } as any, { provider: undefined } as any)
    context.result = patched as any
    return context
  }
}

const sendVerify = () => {
  return async (context: HookContext) => {
    if (process.env.AUTO_VERIFY_USERS === 'true') return context
    // Trigger verification notifier via auth-management
    const users = Array.isArray(context.result) ? (context.result as any[]) : [context.result as any]
    await Promise.all(
      users.map(async (user) => context.app.service('auth-management').create({ action: 'resendVerifySignup', value: { email: user.email } }))
    )
    return context
  }
}

const ensureDefaultTenantRole = async (context: HookContext) => {
  const created = context.result as any
  const userId = created?._id?.toString()
  if (!userId) return context

  // Always grant tenant role by default
  await context.app.service('user-roles').create({ userId, role: 'tenant' })

  // Optional role request (do not grant immediately)
  const requestedRole = (context.data as any)?.requestedRole
  if (requestedRole && requestedRole !== 'tenant') {
    await context.app.service('role-requests').create({
      userId,
      role: requestedRole,
      status: 'pending'
    })
  }

  return context
}

export const users = (app: Application) => {
  app.use(usersPath, new UsersService(getOptions(app)), {
    methods: usersMethods as any,
    events: []
  })

  app.service(usersPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(userExternalResolver), schemaHooks.resolveResult(userResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(userQueryValidator), schemaHooks.resolveQuery(userQueryResolver)],
      create: [
        schemaHooks.validateData(userDataValidator),
        schemaHooks.resolveData(userDataResolver),
        addVerification('auth-management')
      ],
      patch: [
        authenticateIfExternal('jwt'),
        stripAuthManagementFieldsFromExternalPatch,
        restrictUsersExternalAccess,
        schemaHooks.validateData(userPatchValidator),
        schemaHooks.resolveData(userPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), restrictUsersExternalAccess],

      // Restrict list/get to self unless admin.
      // Note: put after auth hook so `context.params.user` is set.
      find: [authenticateIfExternal('jwt'), restrictUsersExternalAccess],
      get: [authenticateIfExternal('jwt'), restrictUsersExternalAccess]
    },
    after: {
      find: [attachUserRolesForExternal],
      get: [
        attachUserRolesForExternal,
        // Strip private auth fields when an authenticated user reads another user's profile.
        async (context: HookContext) => {
          if (!context.params.provider) return context
          const requesterId = (context.params.user as any)?._id?.toString?.()
          const targetId = context.result?._id?.toString?.()
          const roles = await getRolesForRequest(context)
          if (String(requesterId) !== String(targetId) && !roles.includes('admin')) {
            const r = context.result as any
            delete r.resetToken
            delete r.resetExpires
            delete r.resetShortToken
            delete r.verifyToken
            delete r.verifyExpires
            delete r.verifyShortToken
            delete r.verifyChanges
            delete r.isVerified
          }
          return context
        }
      ],
      create: [sendVerify(), removeVerification(), autoVerifyIfEnabled(), ensureDefaultTenantRole, attachUserRolesForExternal],
      patch: [attachUserRolesForExternal]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [usersPath]: UsersService
  }
}

