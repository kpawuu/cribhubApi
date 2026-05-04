import type { Application, HookContext } from '../../declarations'
import { errors } from '@feathersjs/errors'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { compare } from 'bcryptjs'

export const deleteAccountPath = 'delete-account'

export class DeleteAccountService {
  async create(data: any, params: any) {
    const user = params.user as any
    if (!user?._id) throw new errors.NotAuthenticated()

    const password = data?.password
    if (!password) throw new errors.BadRequest('password is required')

    // Load full user record with password (internal)
    const fullUser = await params.app.service('users').get(user._id, { provider: undefined } as any)
    const hashed = (fullUser as any).password
    if (!hashed) throw new errors.BadRequest('No password set for user')

    const ok = await compare(password, hashed)
    if (!ok) throw new errors.Forbidden('Invalid password')

    const userId = user._id.toString()

    // Cascade delete across collections (best-effort, internal)
    const removeMany = async (service: string, query: any) => {
      try {
        await params.app.service(service).remove(null, { query, paginate: false, provider: undefined } as any)
      } catch {
        // ignore
      }
    }

    await removeMany('refresh-tokens', { userId })
    await removeMany('user-roles', { userId })

    // Delete verification documents only for the user's role requests.
    // (Previous implementation used `{}` which deletes the entire `verification_documents` collection.)
    const roleRequests = (await params.app.service('role-requests').find(
      { paginate: false, query: { userId } } as any,
      { provider: undefined } as any
    )) as unknown as any[]
    const roleRequestIds = (roleRequests || []).map((r) => r._id?.toString?.() || r._id).filter(Boolean)
    await removeMany('verification-documents', { roleRequestId: { $in: roleRequestIds } })

    await removeMany('role-requests', { userId })

    await removeMany('payments', { tenantId: userId })
    await removeMany('payments', { landlordId: userId })
    await removeMany('maintenance-requests', { tenantId: userId })
    await removeMany('communications', { landlordId: userId })
    await removeMany('notices', { landlordId: userId })
    await removeMany('exchange-rates', { landlordId: userId })
    await removeMany('legal-documents', { userId })
    await removeMany('rental-contracts', { tenantId: userId })
    await removeMany('rental-contracts', { landlordId: userId })
    await removeMany('rental-applications', { applicantId: userId })

    // Properties/units owned
    await removeMany('properties', { landlordId: userId })

    // Finally remove the user itself
    await params.app.service('users').remove(user._id, { provider: undefined } as any)

    return { status: 'deleted' }
  }
}

export const deleteAccount = (app: Application) => {
  app.use(deleteAccountPath, new DeleteAccountService() as any, { methods: ['create'], events: [] })

  app.service(deleteAccountPath).hooks({
    before: {
      create: [
        authenticateIfExternal('jwt'),
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
    [deleteAccountPath]: DeleteAccountService
  }
}

