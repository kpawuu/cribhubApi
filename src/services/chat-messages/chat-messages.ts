import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'
import { createUserNotification } from '../../utils/create-user-notification'

import { ChatMessagesService, getOptions } from './chat-messages.class'
import {
  chatMessageResolver,
  chatMessageExternalResolver,
  chatMessageDataValidator,
  chatMessageDataResolver,
  chatMessagePatchValidator,
  chatMessagePatchResolver,
  chatMessageQueryValidator,
  chatMessageQueryResolver
} from './chat-messages.schema'

export const chatMessagesPath = 'chat-messages'
export const chatMessagesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

/** Load the inquiry and verify the current user is a participant. */
async function getInquiryAndAssertParticipant(app: Application, inquiryId: string, userId: string) {
  const inquiry = (await app.service('inquiries').get(inquiryId, {
    provider: undefined
  } as any)) as any

  const isParticipant =
    inquiry.createdByUserId === userId ||
    inquiry.landlordId === userId ||
    inquiry.agentUserId === userId

  return { inquiry, isParticipant }
}

/**
 * Before create: attach sender metadata and verify the user is a participant
 * in the target inquiry.
 */
const attachSenderInfo = async (context: HookContext) => {
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const uid = user._id.toString()
  const inquiryId = (context.data as any).inquiryId
  if (!inquiryId) throw new errors.BadRequest('inquiryId is required')

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const { inquiry, isParticipant } = await getInquiryAndAssertParticipant(context.app, inquiryId, uid)

  if (!roles.includes('admin') && !isParticipant) {
    throw new errors.Forbidden('You are not a participant in this conversation.')
  }

  ;(context.data as any).senderUserId = uid

  // Determine role label from roles array
  if (roles.includes('agent')) {
    ;(context.data as any).senderRole = 'agent'
  } else if (roles.includes('property_manager')) {
    ;(context.data as any).senderRole = 'property_manager'
  } else if (roles.includes('landlord') || roles.includes('admin')) {
    ;(context.data as any).senderRole = 'landlord'
  } else {
    ;(context.data as any).senderRole = 'tenant'
  }

  // Get display name from user record
  try {
    const userRecord = (await context.app.service('users').get(uid, {
      provider: undefined
    } as any)) as any
    ;(context.data as any).senderName = userRecord.fullName || user.email || 'User'
  } catch {
    ;(context.data as any).senderName = user.email || 'User'
  }

  // Auto-advance inquiry status from 'new' to 'contacted' on first reply from
  // a landlord / agent side so the inbox reflects activity.
  if (
    inquiry.status === 'new' &&
    ((context.data as any).senderRole === 'landlord' ||
      (context.data as any).senderRole === 'agent' ||
      (context.data as any).senderRole === 'property_manager')
  ) {
    try {
      await context.app
        .service('inquiries')
        .patch(inquiryId, { status: 'contacted' }, { provider: undefined } as any)
    } catch {
      /* non-fatal */
    }
  }

  return context
}

/** Before find: user must supply `inquiryId` and must be a participant. */
const restrictFindToParticipant = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  const inquiryId = context.params.query?.inquiryId
  if (!inquiryId) throw new errors.BadRequest('inquiryId is required')

  const uid = user._id.toString()
  const { isParticipant } = await getInquiryAndAssertParticipant(context.app, inquiryId, uid)

  if (!isParticipant) {
    throw new errors.Forbidden('You are not a participant in this conversation.')
  }

  return context
}

const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '')

/**
 * After create: patch the parent inquiry with the latest message timestamp and
 * preview, then notify every other participant of the new message.
 */
const afterChatMessageCreated = async (context: HookContext) => {
  const msg = context.result as any
  if (!msg?.inquiryId) return context

  const inquiryId = String(msg.inquiryId)
  const senderUserId = String(msg.senderUserId || '')

  // Patch inquiry with last-message metadata for thread sorting / preview
  try {
    await context.app.service('inquiries').patch(
      inquiryId,
      {
        lastMessageAt: msg.createdAt || new Date().toISOString(),
        lastMessagePreview: String(msg.body || '').slice(0, 120)
      } as any,
      { provider: undefined } as any
    )
  } catch {
    /* non-fatal */
  }

  // Notify all OTHER participants
  let inquiry: any = null
  try {
    inquiry = await context.app.service('inquiries').get(inquiryId, { provider: undefined } as any)
  } catch {
    return context
  }

  const participants: Array<{ userId: string; label: string }> = []
  if (inquiry.createdByUserId && inquiry.createdByUserId !== senderUserId) {
    participants.push({ userId: inquiry.createdByUserId, label: 'tenant' })
  }
  if (inquiry.landlordId && inquiry.landlordId !== senderUserId) {
    participants.push({ userId: inquiry.landlordId, label: 'landlord' })
  }
  if (inquiry.agentUserId && inquiry.agentUserId !== senderUserId && inquiry.agentUserId !== inquiry.landlordId) {
    participants.push({ userId: inquiry.agentUserId, label: 'agent' })
  }

  const senderName = msg.senderName || 'Someone'
  const preview = String(msg.body || '').slice(0, 100)

  await Promise.allSettled(
    participants.map(({ userId }) =>
      createUserNotification(context.app, {
        userId,
        eventKey: 'chat_message.created',
        category: 'inquiry',
        title: `New message from ${senderName}`,
        body: preview,
        linkUrl: `${appUrl()}/messages`,
        relatedService: 'inquiries',
        relatedId: inquiryId,
        metadata: { inquiryId, senderUserId }
      })
    )
  )

  return context
}

export const chatMessages = (app: Application) => {
  app.use(chatMessagesPath, new ChatMessagesService(getOptions(app)), {
    methods: chatMessagesMethods as any,
    events: []
  })

  app.service(chatMessagesPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(chatMessageExternalResolver),
        schemaHooks.resolveResult(chatMessageResolver)
      ]
    },
    before: {
      all: [
        authenticateIfExternal('jwt'),
        populateRoles,
        schemaHooks.validateQuery(chatMessageQueryValidator),
        schemaHooks.resolveQuery(chatMessageQueryResolver)
      ],
      find: [restrictFindToParticipant],
      get: [],
      create: [
        schemaHooks.validateData(chatMessageDataValidator),
        schemaHooks.resolveData(chatMessageDataResolver),
        attachSenderInfo
      ],
      patch: [requireRole('admin')],
      remove: [requireRole('admin')]
    },
    after: {
      create: [afterChatMessageCreated]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [chatMessagesPath]: ChatMessagesService
  }
}
