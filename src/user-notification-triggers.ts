import type { Application, HookContext } from './declarations'
import { createUserNotification } from './utils/create-user-notification'

const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '')

async function landlordIdForUnit(app: Application, unitId: string): Promise<string | null> {
  try {
    const unit = await app.service('units').get(unitId, { provider: undefined } as any)
    const property = await app.service('properties').get((unit as any).propertyId, { provider: undefined } as any)
    return (property as any)?.landlordId ? String((property as any).landlordId) : null
  } catch {
    return null
  }
}

/**
 * Registers `after` hooks on domain services so each significant event creates
 * an in-app row in `user-notifications` for the affected user(s).
 */
export function registerUserNotificationTriggers(app: Application): void {
  app.service('inquiries').hooks({
    after: {
      create: [
        async (ctx: HookContext) => {
          const r = ctx.result as any
          if (!r) return ctx
          const pid = r.propertyId
          const title = 'New property inquiry'
          const body = r.name ? `From ${r.name}${r.email ? ` (${r.email})` : ''}` : 'A lead submitted an inquiry.'
          const link = pid ? `${appUrl()}/properties/${pid}` : undefined
          if (r.landlordId) {
            await createUserNotification(app, {
              userId: String(r.landlordId),
              eventKey: 'inquiry.created',
              category: 'inquiry',
              title,
              body,
              linkUrl: link,
              relatedService: 'inquiries',
              relatedId: String(r._id),
              metadata: { propertyId: pid }
            })
          }
          if (r.agentUserId && String(r.agentUserId) !== String(r.landlordId)) {
            await createUserNotification(app, {
              userId: String(r.agentUserId),
              eventKey: 'inquiry.created',
              category: 'inquiry',
              title: 'New inquiry (assigned to you)',
              body,
              linkUrl: link,
              relatedService: 'inquiries',
              relatedId: String(r._id),
              metadata: { propertyId: pid }
            })
          }
          return ctx
        }
      ]
    }
  })

  app.service('rental-applications').hooks({
    after: {
      create: [
        async (ctx: HookContext) => {
          const r = ctx.result as any
          if (!r?.unitId) return ctx
          const landlordId = await landlordIdForUnit(app, String(r.unitId))
          if (!landlordId) return ctx
          await createUserNotification(app, {
            userId: landlordId,
            eventKey: 'rental_application.created',
            category: 'application',
            title: 'New rental application',
            body: 'A tenant applied for one of your units.',
            linkUrl: `${appUrl()}/rental-applications/${r._id}`,
            relatedService: 'rental-applications',
            relatedId: String(r._id),
            metadata: { unitId: r.unitId }
          })
          return ctx
        }
      ],
      patch: [
        async (ctx: HookContext) => {
          const st = (ctx.data as any)?.status
          if (st !== 'approved' && st !== 'rejected') return ctx
          const r = ctx.result as any
          if (!r?.applicantId) return ctx
          await createUserNotification(app, {
            userId: String(r.applicantId),
            eventKey: `rental_application.${r.status}`,
            category: 'application',
            title: r.status === 'approved' ? 'Application approved' : 'Application update',
            body:
              r.status === 'approved'
                ? 'Your rental application was approved.'
                : 'Your rental application was not approved.',
            linkUrl: `${appUrl()}/rental-applications/${r._id}`,
            relatedService: 'rental-applications',
            relatedId: String(r._id)
          })
          return ctx
        }
      ]
    }
  })

  app.service('maintenance-requests').hooks({
    after: {
      create: [
        async (ctx: HookContext) => {
          const r = ctx.result as any
          if (!r?.unitId) return ctx
          const landlordId = await landlordIdForUnit(app, String(r.unitId))
          if (!landlordId) return ctx
          await createUserNotification(app, {
            userId: landlordId,
            eventKey: 'maintenance_request.created',
            category: 'maintenance',
            title: 'New maintenance request',
            body: r.title ? `“${r.title}”` : 'A tenant opened a maintenance request.',
            linkUrl: `${appUrl()}/maintenance-requests/${r._id}`,
            relatedService: 'maintenance-requests',
            relatedId: String(r._id),
            metadata: { unitId: r.unitId, tenantId: r.tenantId }
          })
          return ctx
        }
      ],
      patch: [
        async (ctx: HookContext) => {
          if (!(ctx.data as any)?.status) return ctx
          const r = ctx.result as any
          if (!r?.tenantId || !r?.status) return ctx
          await createUserNotification(app, {
            userId: String(r.tenantId),
            eventKey: 'maintenance_request.updated',
            category: 'maintenance',
            title: 'Maintenance request updated',
            body: `Status is now “${r.status}”.`,
            linkUrl: `${appUrl()}/maintenance-requests/${r._id}`,
            relatedService: 'maintenance-requests',
            relatedId: String(r._id)
          })
          return ctx
        }
      ]
    }
  })

  app.service('rental-contracts').hooks({
    after: {
      create: [
        async (ctx: HookContext) => {
          const r = ctx.result as any
          if (!r?.tenantId) return ctx
          await createUserNotification(app, {
            userId: String(r.tenantId),
            eventKey: 'rental_contract.created',
            category: 'contract',
            title: 'New rental contract',
            body: 'A contract was created for your tenancy.',
            linkUrl: `${appUrl()}/rental-contracts/${r._id}`,
            relatedService: 'rental-contracts',
            relatedId: String(r._id)
          })
          return ctx
        }
      ],
      patch: [
        async (ctx: HookContext) => {
          const d = ctx.data as any
          if (!d || typeof d !== 'object') return ctx
          const watch = ['status', 'documentUrl', 'tenantSignedAt', 'landlordSignedAt', 'content']
          if (!watch.some((k) => Object.prototype.hasOwnProperty.call(d, k))) return ctx
          const r = ctx.result as any
          const actor = ctx.params.user as any
          if (!r?.tenantId || !r?.landlordId || !actor?._id) return ctx
          const aid = actor._id.toString()
          const tenantId = String(r.tenantId)
          const landlordId = String(r.landlordId)
          if (aid === tenantId) {
            await createUserNotification(app, {
              userId: landlordId,
              eventKey: 'rental_contract.updated',
              category: 'contract',
              title: 'Contract updated',
              body: 'The tenant updated the rental contract.',
              linkUrl: `${appUrl()}/rental-contracts/${r._id}`,
              relatedService: 'rental-contracts',
              relatedId: String(r._id)
            })
          } else if (aid === landlordId) {
            await createUserNotification(app, {
              userId: tenantId,
              eventKey: 'rental_contract.updated',
              category: 'contract',
              title: 'Contract updated',
              body: 'Your landlord updated the rental contract.',
              linkUrl: `${appUrl()}/rental-contracts/${r._id}`,
              relatedService: 'rental-contracts',
              relatedId: String(r._id)
            })
          }
          return ctx
        }
      ]
    }
  })

  app.service('payments').hooks({
    after: {
      create: [
        async (ctx: HookContext) => {
          const r = ctx.result as any
          if (!r?._id || !r?.tenantId || !r?.landlordId) return ctx
          const base = {
            category: 'payment' as const,
            relatedService: 'payments',
            relatedId: String(r._id),
            linkUrl: `${appUrl()}/payments/${r._id}`,
            metadata: { unitId: r.unitId, status: r.status, amount: r.amount }
          }
          if (r.status === 'success') {
            await createUserNotification(app, {
              userId: String(r.tenantId),
              eventKey: 'payment.success',
              title: 'Payment recorded',
              body: r.amount != null ? `Amount: ${r.amount} ${r.currency || 'GHS'}` : 'A payment was recorded on your account.',
              ...base
            })
            await createUserNotification(app, {
              userId: String(r.landlordId),
              eventKey: 'payment.success',
              title: 'Rent payment received',
              body: r.amount != null ? `Amount: ${r.amount} ${r.currency || 'GHS'}` : 'A tenant payment was recorded.',
              ...base
            })
          } else {
            await createUserNotification(app, {
              userId: String(r.tenantId),
              eventKey: 'payment.recorded',
              title: 'Payment activity',
              body: `Status: ${r.status || 'pending'}`,
              ...base
            })
          }
          return ctx
        }
      ]
    }
  })

  // NOTE: role-request approved/rejected notifications are fired from
  // `src/services/role-requests/role-requests.ts` so they carry role-specific
  // welcome copy and deep-links. Do not add a duplicate trigger here.

  app.service('agent-assignments').hooks({
    after: {
      create: [
        async (ctx: HookContext) => {
          const r = ctx.result as any
          if (!r?.agentUserId) return ctx
          await createUserNotification(app, {
            userId: String(r.agentUserId),
            eventKey: 'agent_assignment.created',
            category: 'assignment',
            title: 'New property assignment',
            body: 'You were assigned as agent on a property.',
            linkUrl: r.propertyId ? `${appUrl()}/properties/${r.propertyId}` : undefined,
            relatedService: 'agent-assignments',
            relatedId: String(r._id),
            metadata: { propertyId: r.propertyId }
          })
          return ctx
        }
      ]
    }
  })

  app.service('communications').hooks({
    after: {
      create: [
        async (ctx: HookContext) => {
          const r = ctx.result as any
          if (!r?.landlordId) return ctx
          await createUserNotification(app, {
            userId: String(r.landlordId),
            eventKey: 'communication.created',
            category: 'communication',
            title: 'New inbound message',
            body: r.message ? String(r.message).slice(0, 200) : 'Someone contacted you about a listing.',
            linkUrl: `${appUrl()}/communications/${r._id}`,
            relatedService: 'communications',
            relatedId: String(r._id)
          })
          return ctx
        }
      ]
    }
  })

  app.service('virtual-viewing-requests').hooks({
    after: {
      create: [
        async (ctx: HookContext) => {
          const r = ctx.result as any
          if (!r?.unitId) return ctx
          const landlordId = await landlordIdForUnit(app, String(r.unitId))
          if (!landlordId) return ctx
          await createUserNotification(app, {
            userId: landlordId,
            eventKey: 'virtual_viewing.created',
            category: 'viewing',
            title: 'Virtual viewing request',
            body: r.name ? `${r.name} requested a virtual viewing.` : 'A virtual viewing was requested.',
            linkUrl: `${appUrl()}/virtual-viewing-requests/${r._id}`,
            relatedService: 'virtual-viewing-requests',
            relatedId: String(r._id),
            metadata: { unitId: r.unitId }
          })
          return ctx
        }
      ]
    }
  })

}
