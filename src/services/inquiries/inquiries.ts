import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'

import { InquiriesService, getOptions } from './inquiries.class'
import {
  inquiryResolver,
  inquiryExternalResolver,
  inquiryDataValidator,
  inquiryDataResolver,
  inquiryPatchValidator,
  inquiryPatchResolver,
  inquiryQueryValidator,
  inquiryQueryResolver
} from './inquiries.schema'
import { notifyInquiryCreated } from '../../utils/notify-inquiry-created'

export const inquiriesPath = 'inquiries'
export const inquiriesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const attachRouting = async (context: HookContext) => {
  const data: any = context.data || {}
  const propertyId = data.propertyId
  if (!propertyId) throw new errors.BadRequest('propertyId is required')

  const property = await context.app.service('properties').get(propertyId, { provider: undefined } as any)
  ;(context.data as any).landlordId = (property as any).landlordId

  // If property has an assigned agent, route to them
  const assignments = (await context.app.service('agent-assignments').find(
    { paginate: false, query: { propertyId } } as any,
    { provider: undefined } as any
  )) as any
  const list = Array.isArray(assignments) ? assignments : assignments?.data || []
  const assigned = list[0]
  if (assigned?.agentUserId) {
    ;(context.data as any).agentUserId = assigned.agentUserId
  }

  const u = context.params.user as any
  if (u?._id) {
    ;(context.data as any).createdByUserId = u._id.toString()
  }
  return context
}

const restrictFind = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []

  if (roles.includes('admin')) return context

  // agents see their routed inquiries
  if (roles.includes('agent')) {
    mergeQuery(context, { agentUserId: user._id.toString() })
    return context
  }

  // landlords / property managers see inquiries for their portfolio (same landlordId scope as properties)
  if (roles.includes('landlord') || roles.includes('property_manager')) {
    mergeQuery(context, { landlordId: user._id.toString() })
    return context
  }

  // tenants can see what they created (if authenticated)
  mergeQuery(context, { createdByUserId: user._id.toString() })
  return context
}

export const inquiries = (app: Application) => {
  app.use(inquiriesPath, new InquiriesService(getOptions(app)), {
    methods: inquiriesMethods as any,
    events: []
  })

  app.service(inquiriesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(inquiryExternalResolver), schemaHooks.resolveResult(inquiryResolver)]
    },
    after: {
      create: [
        async (context: HookContext) => {
          if (context.result) await notifyInquiryCreated(context.app, context.result as any)
          return context
        }
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(inquiryQueryValidator), schemaHooks.resolveQuery(inquiryQueryResolver)],
      // Leads are public-ish: allow unauthenticated create (from marketing/details page)
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      get: [authenticateIfExternal('jwt'), populateRoles],
      create: [schemaHooks.validateData(inquiryDataValidator), schemaHooks.resolveData(inquiryDataResolver), attachRouting],
      patch: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('agent', 'landlord', 'property_manager', 'admin'),
        schemaHooks.validateData(inquiryPatchValidator),
        schemaHooks.resolveData(inquiryPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [inquiriesPath]: InquiriesService
  }
}

