import { errors } from '@feathersjs/errors'
import type { HookContext } from '../declarations'
import { ObjectId } from 'mongodb'
import { getPmAssignedPropertyIds } from './pm-assignment-access'

const getAssignedPropertyIds = async (context: HookContext, agentUserId: string): Promise<string[]> => {
  const res = (await context.app.service('agent-assignments').find(
    { paginate: false, query: { agentUserId } } as any,
    { provider: undefined } as any
  )) as any
  const list = Array.isArray(res) ? res : res?.data || []
  return list.map((a: any) => a.propertyId).filter(Boolean)
}

export const restrictPropertiesToAssignedForAgents = () => {
  return async (context: HookContext) => {
    if (!context.params.provider) return context
    const user = context.params.user as any
    if (!user?._id) return context

    const roles: string[] = Array.isArray(user.roles) ? user.roles : []
    if (roles.includes('admin')) return context

    if (roles.includes('property_manager') && !roles.includes('landlord')) {
      const ids = await getPmAssignedPropertyIds(context, user._id.toString())
      context.params.query = {
        ...(context.params.query || {}),
        _id: { $in: ids.map((id) => new ObjectId(id)) }
      }
      return context
    }

    if (roles.includes('agent')) {
      const ids = await getAssignedPropertyIds(context, user._id.toString())
      context.params.query = {
        ...(context.params.query || {}),
        _id: { $in: ids.map((id) => new ObjectId(id)) }
      }
      return context
    }

    // landlord default restriction is handled elsewhere
    return context
  }
}

export const requireAgentAssignedToProperty = (propertyId: string) => {
  return async (context: HookContext) => {
    if (!context.params.provider) return context
    const user = context.params.user as any
    if (!user?._id) throw new errors.NotAuthenticated()

    const roles: string[] = Array.isArray(user.roles) ? user.roles : []
    if (roles.includes('admin') || roles.includes('landlord')) return context

    if (roles.includes('property_manager')) {
      const res = (await context.app.service('property-manager-assignments').find(
        { paginate: false, query: { propertyId, managerUserId: user._id.toString() } } as any,
        { provider: undefined } as any
      )) as any
      const list = Array.isArray(res) ? res : res?.data || []
      if (!list.length) throw new errors.Forbidden('You are not assigned to manage this property.')
      return context
    }

    if (!roles.includes('agent')) throw new errors.Forbidden('You are not allowed to access this resource.')

    const res = (await context.app.service('agent-assignments').find(
      { paginate: false, query: { propertyId, agentUserId: user._id.toString() } } as any,
      { provider: undefined } as any
    )) as any
    const list = Array.isArray(res) ? res : res?.data || []
    if (!list.length) throw new errors.Forbidden('You are not assigned to this property.')
    return context
  }
}

export const restrictUnitsToAssignedPropertiesForAgents = () => {
  return async (context: HookContext) => {
    if (!context.params.provider) return context
    const user = context.params.user as any
    if (!user?._id) return context

    const roles: string[] = Array.isArray(user.roles) ? user.roles : []
    if (roles.includes('admin') || roles.includes('landlord')) return context

    if (roles.includes('property_manager') && !roles.includes('landlord')) {
      const ids = await getPmAssignedPropertyIds(context, user._id.toString())
      context.params.query = { ...(context.params.query || {}), propertyId: { $in: ids } }
      return context
    }

    if (roles.includes('agent')) {
      const ids = await getAssignedPropertyIds(context, user._id.toString())
      context.params.query = { ...(context.params.query || {}), propertyId: { $in: ids } }
    }

    return context
  }
}

