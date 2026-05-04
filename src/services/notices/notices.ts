import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { restrictQueryToOwner } from '../../hooks/restrict-query-to-owner'

import { NoticesService, getOptions } from './notices.class'
import {
  noticeResolver,
  noticeExternalResolver,
  noticeDataValidator,
  noticeDataResolver,
  noticePatchValidator,
  noticePatchResolver,
  noticeQueryValidator,
  noticeQueryResolver
} from './notices.schema'

export const noticesPath = 'notices'
export const noticesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const attachLandlordId = async (context: HookContext) => {
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
  const data = context.data as any
  if (roles.includes('admin')) {
    const lid = data.landlordId != null ? String(data.landlordId).trim() : ''
    data.landlordId = lid || user?._id?.toString()
    return context
  }
  if (roles.includes('property_manager')) {
    const lid = data.landlordId != null ? String(data.landlordId).trim() : ''
    if (!lid) throw new errors.BadRequest('landlordId is required')
    data.landlordId = lid
    return context
  }
  data.landlordId = user?._id?.toString()
  return context
}

const attachAuthorIfMissing = async (context: HookContext) => {
  const user = context.params.user as any
  if (!(context.data as any).author) {
    ;(context.data as any).author = user?.fullName || user?.email || user?._id?.toString() || 'system'
  }
  return context
}

const sendSmsIfRequested = async (context: HookContext) => {
  const notice = context.result as any
  const recipients: string[] | undefined = notice?.smsRecipients
  if (!Array.isArray(recipients) || recipients.length === 0) return context

  // Only attempt SMS if api key is configured
  if (!process.env.MNOTIFY_API_KEY) return context

  const msg = `${notice.title}\n\n${notice.content}`
  try {
    await context.app.service('sms').create(
      {
        recipient: recipients,
        message: msg
      },
      { provider: undefined } as any
    )
    await context.app.service('notices').patch(notice._id, { smsSent: true }, { provider: undefined } as any)
  } catch {
    // do not fail notice creation if SMS fails
  }
  return context
}

export const notices = (app: Application) => {
  app.use(noticesPath, new NoticesService(getOptions(app)), {
    methods: noticesMethods as any,
    events: []
  })

  app.service(noticesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(noticeExternalResolver), schemaHooks.resolveResult(noticeResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(noticeQueryValidator), schemaHooks.resolveQuery(noticeQueryResolver)],
      find: [authenticateIfExternal('jwt'), restrictQueryToOwner('landlordId', ['admin', 'property_manager'])],
      get: [authenticateIfExternal('jwt')],
      create: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin', 'property_manager'),
        attachAuthorIfMissing,
        schemaHooks.validateData(noticeDataValidator),
        schemaHooks.resolveData(noticeDataResolver),
        attachLandlordId
      ],
      patch: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin', 'property_manager'),
        schemaHooks.validateData(noticePatchValidator),
        schemaHooks.resolveData(noticePatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    }
    ,
    after: {
      create: [sendSmsIfRequested]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [noticesPath]: NoticesService
  }
}

