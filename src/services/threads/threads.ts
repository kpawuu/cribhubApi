import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { populateRoles } from '../../hooks/populate-roles'
import { mergeQuery } from '../../hooks/merge-query'

import { ThreadsService, getOptions } from './threads.class'
import {
  threadResolver,
  threadExternalResolver,
  threadDataValidator,
  threadDataResolver,
  threadPatchValidator,
  threadPatchResolver,
  threadQueryValidator,
  threadQueryResolver
} from './threads.schema'

export const threadsPath = 'threads'
export const threadsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const restrictFindToParticipant = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context
  // Server-side restriction: must be a participant.
  mergeQuery(context, { participantIds: user._id.toString() })
  return context
}

const idQuery = (raw: string) => {
  if (ObjectId.isValid(raw) && String(new ObjectId(raw)) === raw) return { _id: new ObjectId(raw) }
  return { _id: raw as any }
}

const assertGetIsParticipant = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin')) return context
  const db = await context.app.get('mongodbClient')
  const row = await db.collection('threads').findOne(idQuery(String(context.id || '')))
  if (!row) throw new errors.NotFound()
  if (!Array.isArray(row.participantIds) || !row.participantIds.map(String).includes(String(user._id))) {
    throw new errors.Forbidden('You are not a participant in this thread.')
  }
  return context
}

const validateCreateParticipants = async (context: HookContext) => {
  const data = context.data as any
  if (!Array.isArray(data.participantIds) || data.participantIds.length < 2) {
    throw new errors.BadRequest('A thread requires at least 2 participants.')
  }
  const ids = (data.participantIds as string[]).map((x) => String(x).trim()).filter(Boolean)

  // Internal calls (server-side acceptance hooks, welcome-thread bots, etc.)
  // are trusted and do not need an authenticated user.
  if (!context.params.provider) {
    data.participantIds = [...new Set(ids)]
    return context
  }

  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const uid = user._id.toString()
  if (!ids.includes(uid)) {
    throw new errors.Forbidden('You must include yourself as a participant.')
  }
  data.participantIds = [...new Set(ids)]
  return context
}

const preventDuplicateThread = async (context: HookContext) => {
  if (context.method !== 'create') return context
  const d = context.data as any
  if (!d?.kind || !Array.isArray(d.participantIds)) return context
  // Dedup on (kind + sorted participantIds + subjectId).
  const sorted = [...d.participantIds].sort()
  const db = await context.app.get('mongodbClient')
  const sub = d.subject?.id || null
  const dup = await db.collection('threads').findOne({
    kind: d.kind,
    participantIds: { $size: sorted.length, $all: sorted },
    ...(sub ? { 'subject.id': sub } : {})
  } as any)
  if (dup) {
    context.result = dup as any
  }
  return context
}

export const threads = (app: Application) => {
  app.use(threadsPath, new ThreadsService(getOptions(app)), {
    methods: threadsMethods as any,
    events: []
  })

  app.service(threadsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(threadExternalResolver), schemaHooks.resolveResult(threadResolver)]
    },
    before: {
      all: [
        authenticateIfExternal('jwt'),
        populateRoles,
        schemaHooks.validateQuery(threadQueryValidator),
        schemaHooks.resolveQuery(threadQueryResolver)
      ],
      find: [restrictFindToParticipant],
      get: [assertGetIsParticipant],
      create: [
        validateCreateParticipants,
        schemaHooks.validateData(threadDataValidator),
        schemaHooks.resolveData(threadDataResolver),
        preventDuplicateThread
      ],
      patch: [
        assertGetIsParticipant,
        schemaHooks.validateData(threadPatchValidator),
        schemaHooks.resolveData(threadPatchResolver)
      ],
      remove: [assertGetIsParticipant]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [threadsPath]: ThreadsService
  }
}

/**
 * Internal helper to find-or-create a thread for a given subject/participants.
 * Safe to call from `after` hooks of listing-request services after assignment.
 */
export async function findOrCreateThread(
  app: Application,
  input: {
    kind: 'landlord-pm' | 'landlord-agent' | 'landlord-tenant'
    participantIds: string[]
    subject: { type: 'property' | 'unit' | 'inquiry' | 'none'; id?: string }
    propertyId?: string
    inquiryId?: string
    title?: string
    systemNote?: string
  }
): Promise<any> {
  const participantIds = [...new Set(input.participantIds.map((x) => String(x).trim()).filter(Boolean))]
  if (participantIds.length < 2) return null

  const db = await app.get('mongodbClient')
  const sub = input.subject.id || null
  const found = await db.collection('threads').findOne({
    kind: input.kind,
    participantIds: { $size: participantIds.length, $all: participantIds.sort() },
    ...(sub ? { 'subject.id': sub } : {})
  } as any)
  if (found) return found

  return await app.service('threads').create(
    {
      kind: input.kind,
      participantIds,
      subject: input.subject,
      propertyId: input.propertyId,
      inquiryId: input.inquiryId,
      title: input.title,
      systemNote: input.systemNote
    } as any,
    { provider: undefined } as any
  )
}
