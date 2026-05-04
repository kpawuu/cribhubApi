import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticate } from '@feathersjs/authentication'
import { authenticateIfJwtPresent } from '../../hooks/authenticate-if-jwt-present'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'
import { requireAgentAssignedToProperty } from '../../hooks/agent-assignment-access'
import { restrictPropertyManagerPropertiesFind, requirePmAssignedToProperty } from '../../hooks/pm-assignment-access'

import { PropertiesService, getOptions } from './properties.class'
import { expandListingQuery } from './expand-listing-query'
import {
  propertyResolver,
  propertyExternalResolver,
  propertyDataValidator,
  propertyDataResolver,
  propertyPatchValidator,
  propertyPatchResolver,
  propertyQueryValidator,
  propertyQueryResolver
} from './properties.schema'

export const propertiesPath = 'properties'
export const propertiesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const populateRolesIfAuthed = async (context: HookContext) => {
  const user = context.params.user as any
  if (!user?._id) return context
  return await populateRoles(context)
}

const attachLandlordId = async (context: HookContext) => {
  const user = context.params.user as any
  if (user?._id) {
    ;(context.data as any).landlordId = user._id.toString()
  }
  return context
}

const extractInclude = async (context: HookContext) => {
  // Feathers MongoDB adapter applies `params.query` as additional constraints on `get`.
  // We want `include=...` to affect only the response resolver, not the DB query.
  const q: any = context.params?.query || {}
  const include = q.include || q.$include
  const includes = String(include || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (includes.includes('units')) {
    ;(context.params as any).$includeUnits = true
  }
  if (includes.includes('agent')) {
    ;(context.params as any).$includeAgent = true
  }
  if (q.include !== undefined) delete q.include
  if (q.$include !== undefined) delete q.$include
  context.params.query = q
  return context
}

/** Portfolio list: `mine=true` → only this user's properties. Blocks querying another landlord's id. */
const restrictLandlordPropertyQueries = async (context: HookContext) => {
  if (context.method !== 'find' && context.method !== 'get') return context
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) return context
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('property_manager') && !roles.includes('landlord')) {
    if (context.method === 'find') {
      const q: Record<string, any> = { ...(context.params.query || {}) }
      if (q.mine === true || q.mine === 'true') delete q.mine
      context.params.query = q
    }
    return context
  }
  if (!roles.includes('landlord') || roles.includes('admin')) return context

  if (context.method === 'find') {
    const q: Record<string, any> = { ...(context.params.query || {}) }
    if (q.mine === true || q.mine === 'true') {
      delete q.mine
      q.landlordId = user._id.toString()
      context.params.query = q
      return context
    }
    if (q.landlordId != null && String(q.landlordId) !== String(user._id)) {
      throw new errors.Forbidden('You cannot list another landlord\'s properties.')
    }
    return context
  }

  // get — ownership enforced in restrictPropertyGet
  return context
}

/**
 * Public listing detail: tenants, agents, and PMs may GET like guests.
 * Landlord/admin unchanged. Assignment is enforced on patch and on units/property writes elsewhere.
 */
const restrictPropertyGet = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) return context
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin') || roles.includes('landlord')) return context

  return context
}

const ensureLandlordOwnsPropertyBeforePatch = async (ctx: HookContext) => {
  if (!ctx.params.provider) return ctx
  const roles: string[] = Array.isArray((ctx.params.user as any)?.roles) ? ((ctx.params.user as any).roles as string[]) : []
  if (roles.includes('admin')) return ctx
  if (roles.includes('property_manager') && !roles.includes('landlord')) {
    return await requirePmAssignedToProperty(String(ctx.id))(ctx)
  }
  if (roles.includes('agent')) return ctx
  if (!roles.includes('landlord')) return ctx

  const raw = String(ctx.id || '')
  const db = await ctx.app.get('mongodbClient')
  let prop: any = await db.collection('properties').findOne({ _id: raw as any })
  if (!prop && ObjectId.isValid(raw) && raw.length === 24) {
    prop = await db.collection('properties').findOne({ _id: new ObjectId(raw) })
  }
  if (!prop) throw new errors.NotFound()
  if (String(prop.landlordId) !== String((ctx.params.user as any)._id)) {
    throw new errors.Forbidden('You cannot edit this property.')
  }
  return ctx
}

export const properties = (app: Application) => {
  app.use(propertiesPath, new PropertiesService(getOptions(app)), {
    methods: propertiesMethods as any,
    events: []
  })

  app.service(propertiesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(propertyExternalResolver), schemaHooks.resolveResult(propertyResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(propertyQueryValidator), schemaHooks.resolveQuery(propertyQueryResolver)],
      // Catalog browse: same visibility for anonymous and authenticated clients; write access stays role-gated below.
      find: [
        authenticateIfJwtPresent(),
        expandListingQuery,
        populateRolesIfAuthed,
        restrictLandlordPropertyQueries,
        restrictPropertyManagerPropertiesFind,
        extractInclude
      ],
      get: [authenticateIfJwtPresent(), populateRolesIfAuthed, restrictPropertyGet, extractInclude],
      create: [
        authenticate('jwt'),
        requireRole('landlord', 'admin'),
        schemaHooks.validateData(propertyDataValidator),
        schemaHooks.resolveData(propertyDataResolver),
        attachLandlordId
      ],
      patch: [
        authenticate('jwt'),
        populateRoles,
        async (ctx: HookContext) => {
          const roles: string[] = Array.isArray((ctx.params.user as any)?.roles) ? ((ctx.params.user as any).roles as string[]) : []
          if (roles.includes('admin')) return ctx
          if (roles.includes('property_manager') && !roles.includes('landlord')) {
            return await requirePmAssignedToProperty(String(ctx.id))(ctx)
          }
          if (roles.includes('agent')) {
            const propertyId = String(ctx.id)
            return await requireAgentAssignedToProperty(propertyId)(ctx)
          }
          return await requireRole('landlord', 'admin')(ctx)
        },
        ensureLandlordOwnsPropertyBeforePatch,
        schemaHooks.validateData(propertyPatchValidator),
        schemaHooks.resolveData(propertyPatchResolver)
      ],
      remove: [authenticate('jwt'), populateRoles, ensureLandlordOwnsPropertyBeforePatch, requireRole('landlord', 'admin')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [propertiesPath]: PropertiesService
  }
}

