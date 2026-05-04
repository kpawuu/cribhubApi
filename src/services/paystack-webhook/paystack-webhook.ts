import type { Application, HookContext } from '../../declarations'
import { errors } from '@feathersjs/errors'
import crypto from 'crypto'

export const paystackWebhookPath = 'paystack-webhook'

/**
 * Paystack webhook receiver.
 * - Public endpoint (no auth)
 * - Verifies `x-paystack-signature` using `PAYSTACK_SECRET_KEY`
 * - On charge.success, inserts a payment record (idempotent by reference)
 */
export class PaystackWebhookService {
  async create(data: any, params: any) {
    const secret = process.env.PAYSTACK_SECRET_KEY
    if (!secret) throw new errors.BadRequest('PAYSTACK_SECRET_KEY not set')

    const headers =
      params?.headers ||
      params?.koa?.ctx?.feathers?.headers ||
      params?.koa?.ctx?.request?.headers ||
      (params?.koa?.ctx?.req as any)?.headers

    const signature = (headers?.['x-paystack-signature'] || headers?.['X-Paystack-Signature']) as string | undefined
    if (!signature) throw new errors.Forbidden('Missing x-paystack-signature')

    // `src/app.ts` stores raw request body in `ctx.feathers.rawBody`.
    const feathersRawBody = params?.rawBody || params?.koa?.ctx?.feathers?.rawBody
    const unparsedSymbol = Symbol.for('unparsedBody')
    const rawFromUnparsedSymbol = params?.koa?.ctx?.request?.body?.[unparsedSymbol]
    const rawBody = feathersRawBody ?? rawFromUnparsedSymbol

    if (!rawBody) throw new errors.BadRequest('Missing rawBody for signature verification')

    const hash = crypto.createHmac('sha512', secret).update(rawBody.toString()).digest('hex')
    if (hash !== signature) throw new errors.Forbidden('Invalid webhook signature')

    const event = data?.event
    const payload = data?.data || {}

    if (event === 'charge.success') {
      const reference = payload.reference
      const meta = payload.metadata || {}
      const tenantId = meta.tenant_id
      const landlordId = meta.landlord_id
      const unitId = meta.unit_id
      const amount = Number(payload.amount || 0) / 100
      const currency = payload.currency || 'GHS'

      if (reference && tenantId && landlordId && unitId) {
        // Idempotency: don't double insert if already present
        const existing = await params.app.service('payments').find({
          paginate: false,
          query: { reference }
        } as any, { provider: undefined } as any)

        if (!Array.isArray(existing) || existing.length === 0) {
          const paidAt = payload.paid_at || new Date().toISOString()
          await params.app.service('payments').create(
            {
              tenantId,
              landlordId,
              unitId,
              amount,
              currency,
              reference,
              status: 'success',
              channel: payload.channel,
              paidAt,
              isManualEntry: false,
              metadata: payload
            } as any,
            { provider: undefined } as any
          )
          // Mark the active contract as paid
          try {
            const db = await params.app.get('mongodbClient')
            const contract = await db.collection('rental_contracts').findOne({
              unitId: String(unitId),
              tenantId: String(tenantId),
              status: { $in: ['active', 'signed'] }
            })
            if (contract?._id) {
              await params.app.service('rental-contracts').patch(
                String(contract._id),
                { lastPaidAt: paidAt },
                { provider: undefined } as any
              )
            }
          } catch (e) {
            console.error('[webhook stampContractLastPaidAt] failed:', e)
          }
        }
      }
    }

    return { received: true }
  }
}

export const paystackWebhook = (app: Application) => {
  app.use(paystackWebhookPath, new PaystackWebhookService() as any, { methods: ['create'], events: [] })
  app.service(paystackWebhookPath).hooks({
    before: {
      create: [
        async (context: HookContext) => {
          ;(context.params as any).app = context.app
          // Ensure `rawBody` is available on `params` for signature verification.
          const feathersRawBody = (context.params as any)?.koa?.ctx?.feathers?.rawBody
          if (feathersRawBody && !(context.params as any).rawBody) {
            ;(context.params as any).rawBody = feathersRawBody
          }
          return context
        }
      ]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [paystackWebhookPath]: PaystackWebhookService
  }
}

