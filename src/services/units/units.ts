import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { authenticateIfJwtPresent } from '../../hooks/authenticate-if-jwt-present'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'
import { requireAgentAssignedToProperty, restrictUnitsToAssignedPropertiesForAgents } from '../../hooks/agent-assignment-access'
import { restrictUnitsToAssignedPropertiesForPm } from '../../hooks/pm-assignment-access'
import { ObjectId } from 'mongodb'

import { UnitsService, getOptions } from './units.class'
import {
  unitResolver,
  unitExternalResolver,
  unitDataValidator,
  unitDataResolver,
  unitPatchValidator,
  unitPatchResolver,
  unitQueryValidator,
  unitQueryResolver
} from './units.schema'

export const unitsPath = 'units'
export const unitsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const restrictFindToAllowed = async (context: HookContext) => {
  if (!context.params.provider) return context

  const user = context.params.user as any
  const roles: string[] = Array.isArray(user?.roles) ? user.roles : []

  if (!user?._id) {
    mergeQuery(context, { status: 'vacant' })
    return context
  }

  const isPriv =
    roles.includes('admin') || roles.includes('landlord') || roles.includes('property_manager') || roles.includes('agent')
  const isTenant = roles.includes('tenant')

  if (isTenant && !isPriv) {
    if ((context.params.query || {}).status !== 'vacant') {
      mergeQuery(context, { tenantId: user._id.toString() })
    }
  }
  return context
}

/** Allow unauthenticated GET only for vacant units (public listing detail / apply flow). */
const allowPublicVacantUnitGet = async (context: HookContext) => {
  if (!context.params.provider) return context
  if ((context.params.user as any)?._id) return context

  const raw = String(context.id || '')
  const db = await context.app.get('mongodbClient')
  const col = db.collection('units')
  let doc = await col.findOne({ _id: raw as any, status: 'vacant' })
  if (!doc && ObjectId.isValid(raw) && raw.length === 24) {
    doc = await col.findOne({ _id: new ObjectId(raw), status: 'vacant' })
  }
  if (!doc) {
    throw new errors.NotAuthenticated('Sign in to view this unit.')
  }
  return context
}

const ensureLandlordOwnsPropertyForUnitCreate = async (ctx: HookContext) => {
  if (!ctx.params.provider) return ctx
  const roles: string[] = Array.isArray((ctx.params.user as any)?.roles) ? ((ctx.params.user as any).roles as string[]) : []
  if (roles.includes('admin')) return ctx
  if (roles.includes('property_manager') && !roles.includes('landlord')) return ctx
  if (roles.includes('agent')) return ctx
  if (!roles.includes('landlord')) return ctx

  const pid = String((ctx.data as any)?.propertyId || '')
  if (!pid) throw new errors.BadRequest('propertyId is required')
  const property = await ctx.app.service('properties').get(pid, { provider: undefined } as any)
  if (String((property as any).landlordId) !== String((ctx.params.user as any)._id)) {
    throw new errors.Forbidden('You cannot add units to this property.')
  }
  return ctx
}

const ensureLandlordOwnsUnitBeforeWrite = async (ctx: HookContext) => {
  if (!ctx.params.provider) return ctx
  const roles: string[] = Array.isArray((ctx.params.user as any)?.roles) ? ((ctx.params.user as any).roles as string[]) : []
  if (roles.includes('admin')) return ctx
  if (roles.includes('property_manager') && !roles.includes('landlord')) return ctx
  if (roles.includes('agent')) return ctx
  if (!roles.includes('landlord')) return ctx

  const unit = await ctx.app.service('units').get(ctx.id as any, { provider: undefined } as any)
  const property = await ctx.app.service('properties').get((unit as any).propertyId, { provider: undefined } as any)
  if (String((property as any).landlordId) !== String((ctx.params.user as any)._id)) {
    throw new errors.Forbidden('You cannot modify this unit.')
  }
  return ctx
}

const restrictGetUnitAccess = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) return context

  const raw = String(context.id || '')
  const db = await context.app.get('mongodbClient')
  const col = db.collection('units')
  let unit: any = await col.findOne({ _id: raw as any })
  if (!unit && ObjectId.isValid(raw) && raw.length === 24) {
    unit = await col.findOne({ _id: new ObjectId(raw) })
  }
  if (!unit) throw new errors.NotFound('Unit not found')

  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('admin') || roles.includes('landlord')) return context

  if (roles.includes('property_manager') && !roles.includes('landlord')) {
    return await requireAgentAssignedToProperty(String(unit.propertyId))(context)
  }

  if (roles.includes('agent')) {
    return await requireAgentAssignedToProperty(String(unit.propertyId))(context)
  }
  if (roles.includes('tenant')) {
    if (unit.status === 'vacant') return context
    if (String(unit.tenantId || '') === String(user._id)) return context
    throw new errors.Forbidden('You cannot view this unit.')
  }
  throw new errors.Forbidden('You cannot view this unit.')
}

export const units = (app: Application) => {
  app.use(unitsPath, new UnitsService(getOptions(app)), {
    methods: unitsMethods as any,
    events: []
  })

  app.service(unitsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(unitExternalResolver), schemaHooks.resolveResult(unitResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(unitQueryValidator), schemaHooks.resolveQuery(unitQueryResolver)],
      find: [
        authenticateIfJwtPresent(),
        populateRoles,
        restrictFindToAllowed,
        restrictUnitsToAssignedPropertiesForAgents(),
        restrictUnitsToAssignedPropertiesForPm
      ],
      get: [authenticateIfJwtPresent(), populateRoles, allowPublicVacantUnitGet, restrictGetUnitAccess],
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        async (ctx: HookContext) => {
          const roles: string[] = Array.isArray((ctx.params.user as any)?.roles) ? ((ctx.params.user as any).roles as string[]) : []
          if (roles.includes('admin')) return ctx
          if (roles.includes('property_manager') && !roles.includes('landlord')) {
            const propertyId = (ctx.data as any)?.propertyId
            if (!propertyId) throw new errors.BadRequest('propertyId is required')
            return await requireAgentAssignedToProperty(String(propertyId))(ctx)
          }
          if (roles.includes('agent')) {
            const propertyId = (ctx.data as any)?.propertyId
            if (!propertyId) throw new errors.BadRequest('propertyId is required')
            return await requireAgentAssignedToProperty(String(propertyId))(ctx)
          }
          return await requireRole('landlord', 'admin')(ctx)
        },
        ensureLandlordOwnsPropertyForUnitCreate,
        schemaHooks.validateData(unitDataValidator),
        schemaHooks.resolveData(unitDataResolver)
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        async (ctx: HookContext) => {
          const roles: string[] = Array.isArray((ctx.params.user as any)?.roles) ? ((ctx.params.user as any).roles as string[]) : []
          if (roles.includes('admin')) return ctx
          if (roles.includes('property_manager') && !roles.includes('landlord')) {
            const unit = await ctx.app.service('units').get(ctx.id as any, { provider: undefined } as any)
            return await requireAgentAssignedToProperty(String((unit as any).propertyId))(ctx)
          }
          if (roles.includes('agent')) {
            const unit = await ctx.app.service('units').get(ctx.id as any, { provider: undefined } as any)
            const propertyId = (unit as any).propertyId
            return await requireAgentAssignedToProperty(String(propertyId))(ctx)
          }
          return await requireRole('landlord', 'admin')(ctx)
        },
        ensureLandlordOwnsUnitBeforeWrite,
        schemaHooks.validateData(unitPatchValidator),
        schemaHooks.resolveData(unitPatchResolver)
      ],
      remove: [
        authenticateIfExternal('jwt'),
        populateRoles,
        async (ctx: HookContext) => {
          const roles: string[] = Array.isArray((ctx.params.user as any)?.roles) ? ((ctx.params.user as any).roles as string[]) : []
          if (roles.includes('admin')) return ctx
          if (roles.includes('property_manager') && !roles.includes('landlord')) {
            const unit = await ctx.app.service('units').get(ctx.id as any, { provider: undefined } as any)
            return await requireAgentAssignedToProperty(String((unit as any).propertyId))(ctx)
          }
          return await requireRole('landlord', 'admin')(ctx)
        },
        ensureLandlordOwnsUnitBeforeWrite
      ]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [unitsPath]: UnitsService
  }
}
