import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

export const roleRequestSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: Type.String(),
    role: Type.Union([Type.Literal('landlord'), Type.Literal('property_manager'), Type.Literal('agent')]),
    status: Type.Union([Type.Literal('pending'), Type.Literal('approved'), Type.Literal('rejected')]),
    /** Optional message / pitch from the applicant */
    message: Type.Optional(Type.String()),
    notes: Type.Optional(Type.String()),
    reviewedBy: Type.Optional(Type.String()),
    reviewedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    /** Virtual: basic applicant info (loaded via ?include=applicant). */
    applicant: Type.Optional(Type.Any()),
    /** Virtual: role-specific profile (loaded via ?include=profile). */
    profile: Type.Optional(Type.Any()),
    /** Virtual: verification documents tied to the applicant (loaded via ?include=documents). */
    documents: Type.Optional(Type.Array(Type.Any()))
  },
  { $id: 'RoleRequest', additionalProperties: false }
)

export type RoleRequest = Static<typeof roleRequestSchema>
export const roleRequestValidator = getValidator(roleRequestSchema, dataValidator)
export const roleRequestResolver = resolve<RoleRequest, HookContext>({})

async function shouldInclude(context: HookContext, key: string): Promise<boolean> {
  // Prefer the stripped/stashed location written by `stripQueryInclude`.
  // Fall back to query.$include for internal callers that bypass that hook.
  const inc = (context.params as any)?.$include ?? (context.params?.query as any)?.$include
  if (!inc) return false
  if (typeof inc === 'string') return inc.split(',').map((s) => s.trim()).includes(key)
  if (Array.isArray(inc)) return inc.includes(key)
  return false
}

export const roleRequestExternalResolver = resolve<RoleRequest, HookContext>({
  applicant: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'applicant'))) return undefined
    const uid = String((row as any).userId || '')
    if (!uid) return undefined
    try {
      const u = (await context.app.service('users').get(uid, { provider: undefined } as any)) as any
      return {
        _id: String(u._id),
        email: u.email,
        fullName: u.fullName,
        phone: u.phone,
        avatarUrl: u.avatarUrl,
        country: u.country,
        createdAt: u.createdAt,
        onboarding: u.onboarding || null
      }
    } catch {
      return null
    }
  }),
  profile: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'profile'))) return undefined
    const uid = String((row as any).userId || '')
    const role = (row as any).role as string
    if (!uid || !role) return undefined
    try {
      const path =
        role === 'agent' ? 'agent-profiles' :
        role === 'property_manager' ? 'property-manager-profiles' :
        null
      if (!path) return null
      const res = (await (context.app as any).service(path).find({
        query: { userId: uid, $limit: 1 },
        paginate: false,
        provider: undefined
      } as any)) as any
      const arr = Array.isArray(res) ? res : res?.data || []
      return arr[0] || null
    } catch {
      return null
    }
  }),
  documents: virtual(async (row, context) => {
    if (!(await shouldInclude(context, 'documents'))) return undefined
    const uid = String((row as any).userId || '')
    if (!uid) return []
    try {
      const res = (await context.app.service('verification-documents').find({
        query: { userId: uid, $limit: 50, $sort: { createdAt: -1 } },
        paginate: false,
        provider: undefined
      } as any)) as any
      return Array.isArray(res) ? res : res?.data || []
    } catch {
      return []
    }
  })
})

export const roleRequestDataSchema = Type.Object(
  {
    userId: Type.String(),
    role: Type.Union([Type.Literal('landlord'), Type.Literal('property_manager'), Type.Literal('agent')]),
    status: Type.Optional(Type.Literal('pending')),
    /** Optional message the applicant wants to include with their request */
    message: Type.Optional(Type.String({ maxLength: 2000 }))
  },
  { $id: 'RoleRequestData', additionalProperties: false }
)
export type RoleRequestData = Static<typeof roleRequestDataSchema>
export const roleRequestDataValidator = getValidator(roleRequestDataSchema, dataValidator)
export const roleRequestDataResolver = resolve<RoleRequest, HookContext>({
  status: async () => 'pending' as const,
  createdAt: async () => new Date().toISOString()
})

export const roleRequestPatchSchema = Type.Partial(Type.Omit(roleRequestSchema, ['_id', 'userId', 'role', 'createdAt']), {
  $id: 'RoleRequestPatch'
})
export type RoleRequestPatch = Static<typeof roleRequestPatchSchema>
export const roleRequestPatchValidator = getValidator(roleRequestPatchSchema, dataValidator)
export const roleRequestPatchResolver = resolve<RoleRequest, HookContext>({
  reviewedAt: async (_v, _r, context) => (context.data as any)?.status ? new Date().toISOString() : undefined
})

export const roleRequestQuerySchema = Type.Object({}, { $id: 'RoleRequestQuery', additionalProperties: true })
export type RoleRequestQuery = Static<typeof roleRequestQuerySchema>
export const roleRequestQueryValidator = getValidator(roleRequestQuerySchema, queryValidator)
export const roleRequestQueryResolver = resolve<RoleRequestQuery, HookContext>({})
