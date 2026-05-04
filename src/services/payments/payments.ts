import { mergeQuery } from '../../hooks/merge-query'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import { randomUUID } from 'crypto'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'
import { unitIdsForAgent } from '../../hooks/portfolio-unit-ids'

import { PaymentsService, getOptions } from './payments.class'
import {
  paymentResolver,
  paymentExternalResolver,
  paymentDataValidator,
  paymentDataResolver,
  paymentPatchValidator,
  paymentPatchResolver,
  paymentQueryValidator,
  paymentQueryResolver
} from './payments.schema'

export const paymentsPath = 'payments'
export const paymentsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const restrictFind = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const uid = user._id.toString()

  if (roles.includes('admin')) return context

  if (roles.includes('property_manager')) {
    const db = await context.app.get('mongodbClient')
    const assigns = await db
      .collection('property_manager_assignments')
      .find({ managerUserId: uid })
      .project({ propertyId: 1 })
      .toArray()
    const pids = [...new Set(assigns.map((a: any) => String(a.propertyId)).filter(Boolean))]
    if (!pids.length) {
      mergeQuery(context, { landlordId: '__none__' })
      return context
    }
    const oids: unknown[] = pids.map((i) => (ObjectId.isValid(String(i)) && String(i).length === 24 ? new ObjectId(String(i)) : i))
    const props = await db.collection('properties').find({ _id: { $in: oids as any } }).project({ landlordId: 1 }).toArray()
    const lids = [...new Set(props.map((p: any) => String(p.landlordId)).filter(Boolean))]
    if (!lids.length) mergeQuery(context, { landlordId: '__none__' })
    else if (lids.length === 1) mergeQuery(context, { landlordId: lids[0] })
    else mergeQuery(context, { landlordId: { $in: lids } })
    return context
  }

  const ors: Record<string, unknown>[] = []
  if (roles.includes('tenant')) {
    ors.push({ tenantId: uid })
  }
  if (roles.includes('landlord')) {
    ors.push({ landlordId: uid })
  }
  if (roles.includes('agent')) {
    const agentUnitIds = await unitIdsForAgent(context.app, uid)
    if (agentUnitIds.length === 1) {
      ors.push({ unitId: agentUnitIds[0] })
    } else if (agentUnitIds.length > 1) {
      ors.push({ unitId: { $in: agentUnitIds } })
    }
  }

  if (ors.length === 0) {
    mergeQuery(context, { tenantId: '__none__' })
    return context
  }
  if (ors.length === 1) {
    mergeQuery(context, ors[0]!)
  } else {
    mergeQuery(context, { $or: ors })
  }
  return context
}

async function loadPaymentRow(context: HookContext) {
  const db = await context.app.get('mongodbClient')
  const col = db.collection('payments')
  const raw = String(context.id || '')
  let row: any = await col.findOne({ _id: raw as any })
  if (!row && ObjectId.isValid(raw) && raw.length === 24) {
    row = await col.findOne({ _id: new ObjectId(raw) })
  }
  return row
}

async function landlordIdsForPropertyManager(app: Application, managerUserId: string): Promise<string[]> {
  const db = await app.get('mongodbClient')
  const assigns = await db
    .collection('property_manager_assignments')
    .find({ managerUserId: String(managerUserId) })
    .project({ propertyId: 1 })
    .toArray()
  const pids = [...new Set(assigns.map((a: any) => String(a.propertyId)).filter(Boolean))]
  if (!pids.length) return []
  const oids: unknown[] = pids.map((i) => (ObjectId.isValid(String(i)) && String(i).length === 24 ? new ObjectId(String(i)) : i))
  const props = await db.collection('properties').find({ _id: { $in: oids as any } }).project({ landlordId: 1 }).toArray()
  return [...new Set(props.map((p: any) => String(p.landlordId)).filter(Boolean))]
}

const restrictPaymentGet = async (context: HookContext) => {
  if (!context.params.provider) return context
  const user = context.params.user as any
  if (!user?._id) throw new errors.NotAuthenticated()
  const roles: string[] = Array.isArray(user.roles) ? user.roles : []
  const uid = user._id.toString()

  const row = await loadPaymentRow(context)
  if (!row) throw new errors.NotFound()

  if (roles.includes('admin')) return context
  if (roles.includes('tenant') && String(row.tenantId) === uid) return context
  if (roles.includes('landlord') && String(row.landlordId) === uid) return context

  if (roles.includes('property_manager')) {
    const lids = await landlordIdsForPropertyManager(context.app, uid)
    if (lids.includes(String(row.landlordId))) return context
  }

  if (roles.includes('agent')) {
    const agentUnitIds = await unitIdsForAgent(context.app, uid)
    if (agentUnitIds.includes(String(row.unitId))) return context
  }

  throw new errors.Forbidden('You cannot access this payment.')
}

/**
 * Paystack integration (initialize + verify).
 * Uses: `PAYSTACK_SECRET_KEY` and optional `PAYSTACK_CALLBACK_URL`.
 *
 * Payloads:
 * - create({ action: 'initialize', email, amount, currency?, unitId, landlordId })
 * - create({ action: 'verify', reference })
 */
/**
 * Find the active/signed rental contract for this unit+tenant and set lastPaidAt.
 * Uses an internal (provider-less) call so it bypasses external auth.
 */
const stampContractLastPaidAt = async (app: Application, unitId: string, tenantId: string, paidAt: string) => {
  try {
    const db = await app.get('mongodbClient')
    const contract = await db.collection('rental_contracts').findOne({
      unitId: String(unitId),
      tenantId: String(tenantId),
      status: { $in: ['active', 'signed'] }
    })
    if (!contract?._id) return
    await app.service('rental-contracts').patch(
      String(contract._id),
      { lastPaidAt: paidAt },
      { provider: undefined } as any
    )
  } catch (e) {
    console.error('[stampContractLastPaidAt] failed:', e)
  }
}

const handlePaystackActions = async (context: HookContext) => {
  const data: any = context.data
  if (!data?.action) return context

  if (data.action === 'initialize') {
    const key = process.env.PAYSTACK_SECRET_KEY
    if (!key) throw new errors.BadRequest('PAYSTACK_SECRET_KEY not set')

    const rawEmail: string = data.email || ''
    // Paystack rejects fake TLDs (.test, .local, etc). In dev/test, fall back
    // to a real-looking address so checkout can proceed.
    const isFakeEmail = /\.(test|local|example|invalid|localhost)$/i.test(rawEmail) || /[@.]example\./i.test(rawEmail)
    const email = isFakeEmail ? 'no-reply+paystack-test@cribhub.app' : rawEmail
    const amount = Number(data.amount)
    const currency = data.currency || 'GHS'
    const unitId = data.unitId
    const landlordId = data.landlordId
    const tenantId = (context.params.user as any)?._id?.toString()

    if (!email) throw new errors.BadRequest('email is required for payment')
    if (!unitId) throw new errors.BadRequest('unitId is required for payment')
    if (!landlordId) throw new errors.BadRequest('landlordId is required for payment')
    if (!tenantId) throw new errors.NotAuthenticated('Must be logged in to make a payment')
    if (!amount || amount <= 0) throw new errors.BadRequest('Payment amount must be greater than zero. Please ensure the rental contract has a valid monthly rent set.')

    // Paystack expects amount in kobo/pesewas (minor units)
    const amountMinor = Math.round(amount * 100)
    const reference = data.reference || randomUUID()
    const callback_url = process.env.PAYSTACK_CALLBACK_URL || data.callback_url

    const resp = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amountMinor,
        currency,
        reference,
        ...(callback_url ? { callback_url } : {}),
        metadata: {
          unit_id: unitId,
          tenant_id: tenantId,
          landlord_id: landlordId
        }
      })
    })
    const json = await resp.json()
    if (!resp.ok || json?.status === false) {
      const paystackMsg = json?.message || json?.data?.message || JSON.stringify(json)
      console.error('[Paystack initialize] failed:', paystackMsg, '| request:', { email, amountMinor, currency, unitId })
      throw new errors.BadRequest(`Paystack error: ${paystackMsg}`)
    }

    context.result = {
      reference,
      authorization_url: json.data?.authorization_url,
      access_code: json.data?.access_code
    }
    return context
  }

  if (data.action === 'verify') {
    const reference = data.reference
    if (!reference) throw new errors.BadRequest('reference is required')

    const key = process.env.PAYSTACK_SECRET_KEY
    if (!key) throw new errors.BadRequest('PAYSTACK_SECRET_KEY not set')

    const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
    const json = await resp.json()
    if (!resp.ok || json?.status === false) {
      throw new errors.BadRequest('Paystack verify failed', { paystack: json })
    }

    const dataObj = json.data || {}
    const meta = dataObj.metadata || {}
    const tenantId = meta.tenant_id
    const landlordId = meta.landlord_id
    const unitId = meta.unit_id
    const amountMinor = Number(dataObj.amount || 0)
    const amount = amountMinor / 100
    const currency = dataObj.currency || 'GHS'

    if (tenantId && landlordId && unitId) {
      const paidAt = dataObj.paid_at || new Date().toISOString()
      // Insert payment record (internal call)
      await context.app.service('payments').create(
        {
          tenantId,
          landlordId,
          unitId,
          amount,
          currency,
          reference,
          status: 'success',
          channel: dataObj.channel,
          paidAt,
          isManualEntry: false,
          metadata: dataObj
        } as any,
        { provider: undefined } as any
      )
      // Mark the active contract as paid
      await stampContractLastPaidAt(context.app, unitId, tenantId, paidAt)
    }

    context.result = { reference, status: 'success', verified: true, paystack: json.data }
    return context
  }

  return context
}

const attachLandlordOnManualEntry = async (context: HookContext) => {
  const user = context.params.user as any
  const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
  const data = context.data as any
  if (roles.includes('property_manager')) {
    const lid = data.landlordId != null ? String(data.landlordId).trim() : ''
    if (!lid) throw new errors.BadRequest('landlordId is required for manual payment entries.')
    data.landlordId = lid
  } else if (roles.includes('admin')) {
    const lid = data.landlordId != null ? String(data.landlordId).trim() : ''
    data.landlordId = lid || user?._id?.toString()
  } else if (user?._id) {
    data.landlordId = user._id.toString()
  }
  data.reference = data.reference || `manual_${randomUUID()}`
  return context
}

export const payments = (app: Application) => {
  app.use(paymentsPath, new PaymentsService(getOptions(app)), {
    methods: paymentsMethods as any,
    events: []
  })

  app.service(paymentsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(paymentExternalResolver), schemaHooks.resolveResult(paymentResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(paymentQueryValidator), schemaHooks.resolveQuery(paymentQueryResolver)],
      find: [authenticateIfExternal('jwt'), populateRoles, restrictFind],
      get: [authenticateIfExternal('jwt'), populateRoles, restrictPaymentGet],
      create: [
        authenticateIfExternal('jwt'),
        // Action-based (initialize/verify) should bypass manual-entry pipeline.
        async (ctx: HookContext) => {
          if (!(ctx.data as any)?.action) return ctx
          await requireRole('tenant', 'admin', 'landlord', 'property_manager')(ctx)
          await handlePaystackActions(ctx)
          return ctx
        },
        // Internal calls (provider === undefined) are trusted — skip role check,
        // data validation, and manual-entry logic entirely.
        async (ctx: HookContext) => {
          if ((ctx.data as any)?.action || !ctx.params.provider) return ctx
          return await requireRole('landlord', 'admin', 'property_manager')(ctx)
        },
        async (ctx: HookContext) => {
          if ((ctx.data as any)?.action || !ctx.params.provider) return ctx
          return await (schemaHooks.validateData(paymentDataValidator) as any)(ctx)
        },
        async (ctx: HookContext) => {
          if ((ctx.data as any)?.action || !ctx.params.provider) return ctx
          return await (schemaHooks.resolveData(paymentDataResolver) as any)(ctx)
        },
        async (ctx: HookContext) => {
          if ((ctx.data as any)?.action || !ctx.params.provider) return ctx
          return await attachLandlordOnManualEntry(ctx)
        }
      ],
      patch: [
        authenticateIfExternal('jwt'),
        requireRole('landlord', 'admin', 'property_manager'),
        schemaHooks.validateData(paymentPatchValidator),
        schemaHooks.resolveData(paymentPatchResolver)
      ],
      remove: [authenticateIfExternal('jwt'), requireRole('admin')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [paymentsPath]: PaymentsService
  }
}

