import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { HookContext } from '../declarations'

export const getPmAssignedPropertyIds = async (context: HookContext, managerUserId: string): Promise<string[]> => {
  const res = (await context.app.service('property-manager-assignments').find(
    { paginate: false, query: { managerUserId } } as any,
    { provider: undefined } as any
  )) as any
  const list = Array.isArray(res) ? res : res?.data || []
  return list.map((a: any) => String(a.propertyId)).filter(Boolean)
}

const propertyObjectIds = (ids: string[]) => {
  const oids: unknown[] = []
  for (const id of ids) {
    try {
      oids.push(ObjectId.isValid(id) && String(id).length === 24 ? new ObjectId(id) : id)
    } catch {
      oids.push(id)
    }
  }
  return oids
}

/**
 * PM-only users (no landlord/admin): portfolio `find` is limited to assigned properties.
 * Public catalog browse (e.g. `/listings`) must not send `pmPortfolio`; same visibility as guests/tenants.
 * Landlord hub passes `pmPortfolio: true` so managers only see properties they manage.
 */
export const restrictPropertyManagerPropertiesFind = async (context: HookContext) => {
  if (context.method !== 'find' || !context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) return context
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (!roles.includes('property_manager') || roles.includes('admin') || roles.includes('landlord')) return context

  const q: Record<string, any> = { ...(context.params.query || {}) }
  const portfolio = q.pmPortfolio === true || q.pmPortfolio === 'true'
  delete q.pmPortfolio
  context.params.query = q

  if (!portfolio) return context

  const ids = await getPmAssignedPropertyIds(context, user._id.toString())
  const q2: Record<string, any> = { ...(context.params.query || {}) }
  if (!ids.length) {
    q2._id = { $in: [] }
  } else {
    q2._id = { $in: propertyObjectIds(ids) }
  }
  context.params.query = q2
  return context
}

export const requirePmAssignedToProperty = (propertyId: string) => {
  return async (context: HookContext) => {
    if (!context.params.provider) return context
    const user = context.params.user as any
    if (!user?._id) throw new errors.NotAuthenticated()

    const roles: string[] = Array.isArray(user.roles) ? user.roles : []
    if (roles.includes('admin') || roles.includes('landlord')) return context
    if (!roles.includes('property_manager')) throw new errors.Forbidden('You are not allowed to access this resource.')

    const res = (await context.app.service('property-manager-assignments').find(
      { paginate: false, query: { propertyId, managerUserId: user._id.toString() } } as any,
      { provider: undefined } as any
    )) as any
    const list = Array.isArray(res) ? res : res?.data || []
    if (!list.length) throw new errors.Forbidden('You are not assigned to manage this property.')
    return context
  }
}

export const restrictUnitsToAssignedPropertiesForPm = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) return context
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (!roles.includes('property_manager') || roles.includes('admin') || roles.includes('landlord')) return context

  const ids = await getPmAssignedPropertyIds(context, user._id.toString())
  const q: Record<string, any> = { ...(context.params.query || {}) }
  if (!ids.length) {
    q.propertyId = { $in: [] }
  } else {
    q.propertyId = { $in: ids }
  }
  context.params.query = q
  return context
}
