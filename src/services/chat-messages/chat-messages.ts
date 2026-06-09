import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'
import { createUserNotification } from '../../utils/create-user-notification'
import { findOrCreateThread } from '../threads/threads'

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
  const inquiry = (await app.service('inquiries').get(inquiryId, { provider: undefined } as any)) as any
  const isParticipant =
    inquiry.createdByUserId === userId || inquiry.landlordId === userId || inquiry.agentUserId === userId
  return { inquiry, isParticipant }
}

async function getThreadAndAssertParticipant(app: Application, threadId: string, userId: string) {
  const db = await app.get('mongodbClient')
  const filter = ObjectId.isValid(threadId) && threadId.length === 24 ? { _id: new ObjectId(threadId) } : { _id: threadId as any }
  const thread = await db.collection('threads').findOne(filter as any)
  if (!thread) throw new errors.NotFound('Thread not found')
  const isParticipant = Array.isArray(thread.participantIds) && thread.participantIds.map(String).includes(String(userId))
  return { thread, isParticipant }
}

/**
 * Auto-create or re-use a thread when a message has only an `inquiryId`
 * (legacy callers). Ensures every message has a threadId going forward.
 */
async function ensureThreadForLegacyInquiry(app: Application, inquiryId: string): Promise<string | null> {
  try {
    const inquiry = (await app.service('inquiries').get(inquiryId, { provider: undefined } as any)) as any
    const participants = [inquiry.createdByUserId, inquiry.landlordId, inquiry.agentUserId]
      .filter(Boolean)
      .map(String)
    if (participants.length < 2) return null

    const property = inquiry.propertyId
      ? await app
          .service('properties')
          .get(inquiry.propertyId, { provider: undefined } as any)
          .catch(() => null)
      : null

    const t = await findOrCreateThread(app, {
      kind: inquiry.agentUserId ? 'landlord-agent' : 'landlord-tenant',
      participantIds: participants,
      subject: { type: 'inquiry', id: String(inquiryId) },
      propertyId: inquiry.propertyId ? String(inquiry.propertyId) : undefined,
      inquiryId: String(inquiryId),
      title: (property as any)?.name || 'Inquiry conversation'
    })
    return t?._id ? String(t._id) : null
  } catch {
    return null
  }
}

const attachSenderInfo = async (context: HookContext) => {
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const uid = user._id.toString()
  const d = context.data as any
  if (!d.threadId && !d.inquiryId) throw new errors.BadRequest('threadId or inquiryId is required')

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []

  // Resolve / verify the conversation
  if (d.threadId) {
    const { isParticipant } = await getThreadAndAssertParticipant(context.app, String(d.threadId), uid)
    if (!roles.includes('admin') && !isParticipant) {
      throw new errors.Forbidden('You are not a participant in this conversation.')
    }
  } else if (d.inquiryId) {
    const { inquiry, isParticipant } = await getInquiryAndAssertParticipant(context.app, String(d.inquiryId), uid)
    if (!roles.includes('admin') && !isParticipant) {
      throw new errors.Forbidden('You are not a participant in this conversation.')
    }
    // Back-fill threadId so future renderers can use threads natively.
    const newThreadId = await ensureThreadForLegacyInquiry(context.app, String(d.inquiryId))
    if (newThreadId) d.threadId = newThreadId

    // Inquiry status auto-advance (existing behaviour)
    const newSenderRole =
      roles.includes('agent') ? 'agent'
      : roles.includes('property_manager') ? 'property_manager'
      : roles.includes('landlord') || roles.includes('admin') ? 'landlord'
      : 'tenant'
    if (inquiry.status === 'new' && (newSenderRole === 'landlord' || newSenderRole === 'agent' || newSenderRole === 'property_manager')) {
      try {
        await context.app.service('inquiries').patch(String(d.inquiryId), { status: 'contacted' }, { provider: undefined } as any)
      } catch {}
    }
  }

  d.senderUserId = uid

  if (roles.includes('agent')) d.senderRole = 'agent'
  else if (roles.includes('property_manager')) d.senderRole = 'property_manager'
  else if (roles.includes('landlord') || roles.includes('admin')) d.senderRole = 'landlord'
  else d.senderRole = 'tenant'

  try {
    const userRecord = (await context.app.service('users').get(uid, { provider: undefined } as any)) as any
    d.senderName = userRecord.fullName || user.email || 'User'
  } catch {
    d.senderName = user.email || 'User'
  }

  return context
}

/** Before find: require threadId OR inquiryId and participant access. */
const restrictFindToParticipant = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context

  const q = (context.params.query || {}) as any
  const threadId = q.threadId
  const inquiryId = q.inquiryId
  if (!threadId && !inquiryId) throw new errors.BadRequest('threadId or inquiryId is required')

  const uid = user._id.toString()
  if (threadId) {
    const { isParticipant } = await getThreadAndAssertParticipant(context.app, String(threadId), uid)
    if (!isParticipant) throw new errors.Forbidden('You are not a participant in this conversation.')
  } else {
    const { isParticipant } = await getInquiryAndAssertParticipant(context.app, String(inquiryId), uid)
    if (!isParticipant) throw new errors.Forbidden('You are not a participant in this conversation.')
  }
  return context
}

const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '')

const afterChatMessageCreated = async (context: HookContext) => {
  const msg = context.result as any
  const senderUserId = String(msg.senderUserId || '')

  // Always derive a threadId path going forward.
  let threadDoc: any = null
  if (msg.threadId) {
    try {
      const db = await context.app.get('mongodbClient')
      const filter =
        ObjectId.isValid(String(msg.threadId)) && String(msg.threadId).length === 24
          ? { _id: new ObjectId(String(msg.threadId)) }
          : { _id: msg.threadId as any }
      threadDoc = await db.collection('threads').findOne(filter as any)
      if (threadDoc) {
        await context.app.service('threads').patch(
          String(threadDoc._id),
          {
            lastMessageAt: msg.createdAt || new Date().toISOString(),
            lastMessagePreview: String(msg.body || '').slice(0, 120),
            lastMessageBy: senderUserId
          },
          { provider: undefined } as any
        )
      }
    } catch {}
  }

  // Maintain inquiry preview metadata for legacy threads.
  if (msg.inquiryId) {
    try {
      await context.app.service('inquiries').patch(
        String(msg.inquiryId),
        {
          lastMessageAt: msg.createdAt || new Date().toISOString(),
          lastMessagePreview: String(msg.body || '').slice(0, 120)
        } as any,
        { provider: undefined } as any
      )
    } catch {}
  }

  // Notify other participants
  const participants: string[] = []
  if (threadDoc?.participantIds) {
    for (const uid of threadDoc.participantIds) if (String(uid) !== senderUserId) participants.push(String(uid))
  } else if (msg.inquiryId) {
    try {
      const inquiry = (await context.app.service('inquiries').get(String(msg.inquiryId), { provider: undefined } as any)) as any
      if (inquiry.createdByUserId && inquiry.createdByUserId !== senderUserId) participants.push(inquiry.createdByUserId)
      if (inquiry.landlordId && inquiry.landlordId !== senderUserId && !participants.includes(inquiry.landlordId)) {
        participants.push(inquiry.landlordId)
      }
      if (
        inquiry.agentUserId &&
        inquiry.agentUserId !== senderUserId &&
        !participants.includes(inquiry.agentUserId)
      ) {
        participants.push(inquiry.agentUserId)
      }
    } catch {}
  }

  const senderName = msg.senderName || 'Someone'
  const preview = String(msg.body || '').slice(0, 100)
  const link = msg.threadId
    ? `${appUrl()}/messages?threadId=${msg.threadId}`
    : msg.inquiryId
      ? `${appUrl()}/messages?inquiryId=${msg.inquiryId}`
      : `${appUrl()}/messages`

  await Promise.allSettled(
    [...new Set(participants)].map((userId) =>
      createUserNotification(context.app, {
        userId,
        eventKey: 'chat_message.created',
        category: 'inquiry',
        title: `New message from ${senderName}`,
        body: preview,
        linkUrl: link,
        relatedService: msg.threadId ? 'threads' : 'inquiries',
        relatedId: String(msg.threadId || msg.inquiryId || ''),
        metadata: { threadId: msg.threadId, inquiryId: msg.inquiryId, senderUserId }
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
      all: [schemaHooks.resolveExternal(chatMessageExternalResolver), schemaHooks.resolveResult(chatMessageResolver)]
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
