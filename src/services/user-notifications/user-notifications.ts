import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { populateRoles } from '../../hooks/populate-roles'
import { restrictQueryToOwner } from '../../hooks/restrict-query-to-owner'
import emailMessage from '../../utils/emailMessage'
import { renderEmailParts, renderSmsBody } from '../../utils/notification-templates'
import { UserNotificationsService, getOptions } from './user-notifications.class'
import {
  userNotificationResolver,
  userNotificationExternalResolver,
  userNotificationDataValidator,
  userNotificationDataResolver,
  userNotificationPatchValidator,
  userNotificationPatchResolver,
  userNotificationQueryValidator,
  userNotificationQueryResolver
} from './user-notifications.schema'

export const userNotificationsPath = 'user-notifications'
export const userNotificationsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const collection = async (app: Application) => {
  const db = await app.get('mongodbClient')
  return db.collection('user_notifications')
}

const idFilter = (raw: string) => {
  if (ObjectId.isValid(raw) && String(new ObjectId(raw)) === raw) return { _id: new ObjectId(raw) }
  return { _id: raw as any }
}

const assertOwnUnlessAdmin = async (context: HookContext, id: string) => {
  if (!context.params.provider) return
  const roles: string[] = Array.isArray((context.params.user as any)?.roles)
    ? ((context.params.user as any).roles as string[])
    : []
  if (roles.includes('admin')) return
  const userId = (context.params.user as any)?._id?.toString()
  if (!userId) throw new errors.NotAuthenticated()
  const row = await (await collection(context.app)).findOne(idFilter(id))
  if (!row) throw new errors.NotFound('Notification not found')
  if (row.userId !== userId) throw new errors.Forbidden('You cannot access this notification.')
}

const blockExternalCreateUnlessAdmin = async (context: HookContext) => {
  if (!context.params.provider) return context
  const roles: string[] = Array.isArray((context.params.user as any)?.roles)
    ? ((context.params.user as any).roles as string[])
    : []
  if (!roles.includes('admin')) {
    throw new errors.Forbidden('Only admins can create notifications directly.')
  }
  return context
}

const smtpConfigured = () =>
  Boolean(process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD)

const smsConfigured = () => Boolean(process.env.MNOTIFY_API_KEY)

const notificationEmailsGloballyDisabled = () =>
  String(process.env.NOTIFICATION_EMAIL_DISABLED || '').toLowerCase() === 'true'

const notificationSmsGloballyDisabled = () =>
  String(process.env.NOTIFICATION_SMS_DISABLED || '').toLowerCase() === 'true'

const normalizePhone = (raw: string | undefined | null): string | null => {
  if (!raw) return null
  const cleaned = String(raw).replace(/[\s()-]/g, '')
  if (!/^\+?\d{7,15}$/.test(cleaned)) return null
  return cleaned.startsWith('+') ? cleaned : cleaned
}

/**
 * Turns virtual list filters into Mongo clauses (and removes virtual keys) before the adapter runs.
 * Keeps mutations on the same `params.query` object reference so VALIDATED from validateQuery is preserved.
 */
const expandNotificationListFilters = async (context: HookContext) => {
  if (context.method !== 'find') return context
  const q = context.params.query as Record<string, any> | undefined
  if (!q) return context

  const uo = q.unreadOnly
  const ro = q.readOnlyOnly
  if (uo !== undefined) delete q.unreadOnly
  if (ro !== undefined) delete q.readOnlyOnly

  const uoOn = uo === true || uo === 'true'
  const roOn = ro === true || ro === 'true'
  if (!uoOn && !roOn) return context

  if (!Array.isArray(q.$and)) q.$and = []
  if (uoOn) {
    q.$and.push({ $or: [{ readAt: { $exists: false } }, { readAt: null }] })
  }
  if (roOn) {
    q.$and.push({ readAt: { $exists: true, $ne: null } })
  }
  return context
}

const mailFrom = () => {
  const appName = process.env.APP_NAME || 'RentFlow'
  return `"${appName}" <${process.env.MAIL_SENT_FROM || process.env.MAIL_USERNAME || 'no-reply@localhost'}>`
}

/**
 * After each persisted notification, email the recipient (when configured)
 * using the template registry. Failures are logged only so notification
 * creation always succeeds.
 */
const emailRecipientOnNotificationCreated = async (context: HookContext) => {
  const n = context.result as any
  if (!n?.userId || !n?.title) return context
  if ((context.params as any).skipNotificationEmail) return context
  if (notificationEmailsGloballyDisabled()) return context
  if (!smtpConfigured()) return context

  try {
    const recipient = await context.app.service('users').get(n.userId, { provider: undefined } as any)
    const to = (recipient as any)?.email
    if (!to) return context
    if ((recipient as any)?.emailNotifications === false) return context

    const parts = renderEmailParts(
      {
        userId: String(n.userId),
        eventKey: String(n.eventKey || ''),
        category: String(n.category || ''),
        title: String(n.title),
        body: n.body ? String(n.body) : undefined,
        linkUrl: n.linkUrl ? String(n.linkUrl) : undefined,
        relatedService: n.relatedService ? String(n.relatedService) : undefined,
        relatedId: n.relatedId ? String(n.relatedId) : undefined,
        metadata: (n.metadata || null) as any
      },
      String((recipient as any).fullName || 'there')
    )

    const html = await emailMessage(parts.innerHtml, parts.ctaUrl, parts.ctaLabel)

    const textLines = [
      `Hi ${String((recipient as any).fullName || 'there')},`,
      '',
      parts.heading,
      n.body ? String(n.body) : '',
      parts.ctaUrl ? `\nOpen: ${parts.ctaUrl}` : ''
    ].filter((line, i, arr) => !(line === '' && (arr[i - 1] === '' || i === 0)))

    await context.app.service('mailer').create(
      {
        from: mailFrom(),
        to,
        subject: String(parts.subject).slice(0, 160),
        html,
        text: textLines.join('\n')
      },
      { provider: undefined } as any
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[user-notifications] Email to recipient failed', e)
  }

  return context
}

/**
 * After each persisted notification, send a transactional SMS to the recipient
 * when their phone is on file and SMS is enabled.
 */
const smsRecipientOnNotificationCreated = async (context: HookContext) => {
  const n = context.result as any
  if (!n?.userId || !n?.title) return context
  if ((context.params as any).skipNotificationSms) return context
  if (notificationSmsGloballyDisabled()) return context
  if (!smsConfigured()) return context

  try {
    const recipient = await context.app.service('users').get(n.userId, { provider: undefined } as any)
    const r = recipient as any
    if (r?.smsNotifications === false) return context
    const phone = normalizePhone(r?.phone)
    if (!phone) return context

    const text = renderSmsBody({
      userId: String(n.userId),
      eventKey: String(n.eventKey || ''),
      category: String(n.category || ''),
      title: String(n.title),
      body: n.body ? String(n.body) : undefined,
      linkUrl: n.linkUrl ? String(n.linkUrl) : undefined,
      metadata: (n.metadata || null) as any
    })
    if (!text) return context

    await context.app.service('sms').create(
      { recipient: [phone], message: text },
      { provider: undefined } as any
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[user-notifications] SMS to recipient failed', e)
  }
  return context
}

const restrictPatchToReadOnly = async (context: HookContext) => {
  if (!context.params.provider) return context
  const roles: string[] = Array.isArray((context.params.user as any)?.roles)
    ? ((context.params.user as any).roles as string[])
    : []
  if (roles.includes('admin')) return context
  const raw = (context.data as any)?.readAt
  context.data = { readAt: raw !== undefined ? raw : new Date().toISOString() }
  return context
}

export const userNotifications = (app: Application) => {
  app.use(userNotificationsPath, new UserNotificationsService(getOptions(app)), {
    methods: userNotificationsMethods as any,
    events: []
  })

  app.service(userNotificationsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(userNotificationExternalResolver),
        schemaHooks.resolveResult(userNotificationResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(userNotificationQueryValidator), schemaHooks.resolveQuery(userNotificationQueryResolver)],
      find: [authenticateIfExternal('jwt'), populateRoles, expandNotificationListFilters, restrictQueryToOwner('userId', ['admin'])],
      get: [
        authenticateIfExternal('jwt'),
        populateRoles,
        async (ctx: HookContext) => {
          await assertOwnUnlessAdmin(ctx, String(ctx.id))
          return ctx
        }
      ],
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        blockExternalCreateUnlessAdmin,
        schemaHooks.validateData(userNotificationDataValidator),
        schemaHooks.resolveData(userNotificationDataResolver)
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        async (ctx: HookContext) => {
          await assertOwnUnlessAdmin(ctx, String(ctx.id))
          return ctx
        },
        restrictPatchToReadOnly,
        schemaHooks.validateData(userNotificationPatchValidator),
        schemaHooks.resolveData(userNotificationPatchResolver)
      ],
      remove: [
        authenticateIfExternal('jwt'),
        populateRoles,
        async (ctx: HookContext) => {
          const roles: string[] = Array.isArray((ctx.params.user as any)?.roles)
            ? ((ctx.params.user as any).roles as string[])
            : []
          if (roles.includes('admin')) return ctx
          await assertOwnUnlessAdmin(ctx, String(ctx.id))
          return ctx
        }
      ]
    },
    after: {
      create: [emailRecipientOnNotificationCreated, smsRecipientOnNotificationCreated]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [userNotificationsPath]: UserNotificationsService
  }
}
