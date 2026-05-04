"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackWebhook = exports.PaystackWebhookService = exports.paystackWebhookPath = void 0;
const errors_1 = require("@feathersjs/errors");
const crypto_1 = __importDefault(require("crypto"));
exports.paystackWebhookPath = 'paystack-webhook';
/**
 * Paystack webhook receiver.
 * - Public endpoint (no auth)
 * - Verifies `x-paystack-signature` using `PAYSTACK_SECRET_KEY`
 * - On charge.success, inserts a payment record (idempotent by reference)
 */
class PaystackWebhookService {
    async create(data, params) {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret)
            throw new errors_1.errors.BadRequest('PAYSTACK_SECRET_KEY not set');
        const headers = params?.headers ||
            params?.koa?.ctx?.feathers?.headers ||
            params?.koa?.ctx?.request?.headers ||
            params?.koa?.ctx?.req?.headers;
        const signature = (headers?.['x-paystack-signature'] || headers?.['X-Paystack-Signature']);
        if (!signature)
            throw new errors_1.errors.Forbidden('Missing x-paystack-signature');
        // `src/app.ts` stores raw request body in `ctx.feathers.rawBody`.
        const feathersRawBody = params?.rawBody || params?.koa?.ctx?.feathers?.rawBody;
        const unparsedSymbol = Symbol.for('unparsedBody');
        const rawFromUnparsedSymbol = params?.koa?.ctx?.request?.body?.[unparsedSymbol];
        const rawBody = feathersRawBody ?? rawFromUnparsedSymbol;
        if (!rawBody)
            throw new errors_1.errors.BadRequest('Missing rawBody for signature verification');
        const hash = crypto_1.default.createHmac('sha512', secret).update(rawBody.toString()).digest('hex');
        if (hash !== signature)
            throw new errors_1.errors.Forbidden('Invalid webhook signature');
        const event = data?.event;
        const payload = data?.data || {};
        if (event === 'charge.success') {
            const reference = payload.reference;
            const meta = payload.metadata || {};
            const tenantId = meta.tenant_id;
            const landlordId = meta.landlord_id;
            const unitId = meta.unit_id;
            const amount = Number(payload.amount || 0) / 100;
            const currency = payload.currency || 'GHS';
            if (reference && tenantId && landlordId && unitId) {
                // Idempotency: don't double insert if already present
                const existing = await params.app.service('payments').find({
                    paginate: false,
                    query: { reference }
                }, { provider: undefined });
                if (!Array.isArray(existing) || existing.length === 0) {
                    await params.app.service('payments').create({
                        tenantId,
                        landlordId,
                        unitId,
                        amount,
                        currency,
                        reference,
                        status: 'success',
                        channel: payload.channel,
                        paidAt: payload.paid_at,
                        isManualEntry: false,
                        metadata: payload
                    }, { provider: undefined });
                }
            }
        }
        return { received: true };
    }
}
exports.PaystackWebhookService = PaystackWebhookService;
const paystackWebhook = (app) => {
    app.use(exports.paystackWebhookPath, new PaystackWebhookService(), { methods: ['create'], events: [] });
    app.service(exports.paystackWebhookPath).hooks({
        before: {
            create: [
                async (context) => {
                    ;
                    context.params.app = context.app;
                    // Ensure `rawBody` is available on `params` for signature verification.
                    const feathersRawBody = context.params?.koa?.ctx?.feathers?.rawBody;
                    if (feathersRawBody && !context.params.rawBody) {
                        ;
                        context.params.rawBody = feathersRawBody;
                    }
                    return context;
                }
            ]
        }
    });
};
exports.paystackWebhook = paystackWebhook;
//# sourceMappingURL=paystack-webhook.js.map