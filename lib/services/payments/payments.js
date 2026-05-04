"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payments = exports.paymentsMethods = exports.paymentsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const crypto_1 = require("crypto");
const mongodb_1 = require("mongodb");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const payments_class_1 = require("./payments.class");
const payments_schema_1 = require("./payments.schema");
exports.paymentsPath = 'payments';
exports.paymentsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const restrictFind = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    if (roles.includes('property_manager')) {
        const db = await context.app.get('mongodbClient');
        const assigns = await db
            .collection('property_manager_assignments')
            .find({ managerUserId: user._id.toString() })
            .project({ propertyId: 1 })
            .toArray();
        const pids = [...new Set(assigns.map((a) => String(a.propertyId)).filter(Boolean))];
        if (!pids.length) {
            (0, merge_query_1.mergeQuery)(context, { landlordId: '__none__' });
            return context;
        }
        const oids = pids.map((i) => (mongodb_1.ObjectId.isValid(String(i)) && String(i).length === 24 ? new mongodb_1.ObjectId(String(i)) : i));
        const props = await db.collection('properties').find({ _id: { $in: oids } }).project({ landlordId: 1 }).toArray();
        const lids = [...new Set(props.map((p) => String(p.landlordId)).filter(Boolean))];
        if (!lids.length)
            (0, merge_query_1.mergeQuery)(context, { landlordId: '__none__' });
        else if (lids.length === 1)
            (0, merge_query_1.mergeQuery)(context, { landlordId: lids[0] });
        else
            (0, merge_query_1.mergeQuery)(context, { landlordId: { $in: lids } });
        return context;
    }
    if (roles.includes('tenant') && !roles.includes('admin')) {
        (0, merge_query_1.mergeQuery)(context, { tenantId: user._id.toString() });
    }
    if (roles.includes('landlord') && !roles.includes('admin')) {
        (0, merge_query_1.mergeQuery)(context, { landlordId: user._id.toString() });
    }
    return context;
};
/**
 * Paystack integration (initialize + verify).
 * Uses: `PAYSTACK_SECRET_KEY` and optional `PAYSTACK_CALLBACK_URL`.
 *
 * Payloads:
 * - create({ action: 'initialize', email, amount, currency?, unitId, landlordId })
 * - create({ action: 'verify', reference })
 */
const handlePaystackActions = async (context) => {
    const data = context.data;
    if (!data?.action)
        return context;
    if (data.action === 'initialize') {
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key)
            throw new errors_1.errors.BadRequest('PAYSTACK_SECRET_KEY not set');
        const email = data.email;
        const amount = data.amount;
        const currency = data.currency || 'GHS';
        const unitId = data.unitId;
        const landlordId = data.landlordId;
        const tenantId = context.params.user?._id?.toString();
        if (!email || !amount || !unitId || !landlordId || !tenantId) {
            throw new errors_1.errors.BadRequest('email, amount, unitId, landlordId are required');
        }
        // Paystack expects amount in kobo/pesewas (minor units)
        const amountMinor = Math.round(Number(amount) * 100);
        const reference = data.reference || (0, crypto_1.randomUUID)();
        const callback_url = process.env.PAYSTACK_CALLBACK_URL || data.callback_url;
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
        });
        const json = await resp.json();
        if (!resp.ok || json?.status === false) {
            throw new errors_1.errors.BadRequest('Paystack initialize failed', { paystack: json });
        }
        context.result = {
            reference,
            authorization_url: json.data?.authorization_url,
            access_code: json.data?.access_code
        };
        return context;
    }
    if (data.action === 'verify') {
        const reference = data.reference;
        if (!reference)
            throw new errors_1.errors.BadRequest('reference is required');
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key)
            throw new errors_1.errors.BadRequest('PAYSTACK_SECRET_KEY not set');
        const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: {
                Authorization: `Bearer ${key}`
            }
        });
        const json = await resp.json();
        if (!resp.ok || json?.status === false) {
            throw new errors_1.errors.BadRequest('Paystack verify failed', { paystack: json });
        }
        const dataObj = json.data || {};
        const meta = dataObj.metadata || {};
        const tenantId = meta.tenant_id;
        const landlordId = meta.landlord_id;
        const unitId = meta.unit_id;
        const amountMinor = Number(dataObj.amount || 0);
        const amount = amountMinor / 100;
        const currency = dataObj.currency || 'GHS';
        if (tenantId && landlordId && unitId) {
            // Insert payment record (internal call)
            await context.app.service('payments').create({
                tenantId,
                landlordId,
                unitId,
                amount,
                currency,
                reference,
                status: 'success',
                channel: dataObj.channel,
                paidAt: dataObj.paid_at,
                isManualEntry: false,
                metadata: dataObj
            }, { provider: undefined });
        }
        context.result = { reference, status: 'success', verified: true, paystack: json.data };
        return context;
    }
    return context;
};
const attachLandlordOnManualEntry = async (context) => {
    const user = context.params.user;
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const data = context.data;
    if (roles.includes('property_manager')) {
        const lid = data.landlordId != null ? String(data.landlordId).trim() : '';
        if (!lid)
            throw new errors_1.errors.BadRequest('landlordId is required for manual payment entries.');
        data.landlordId = lid;
    }
    else if (roles.includes('admin')) {
        const lid = data.landlordId != null ? String(data.landlordId).trim() : '';
        data.landlordId = lid || user?._id?.toString();
    }
    else if (user?._id) {
        data.landlordId = user._id.toString();
    }
    data.reference = data.reference || `manual_${(0, crypto_1.randomUUID)()}`;
    return context;
};
const payments = (app) => {
    app.use(exports.paymentsPath, new payments_class_1.PaymentsService((0, payments_class_1.getOptions)(app)), {
        methods: exports.paymentsMethods,
        events: []
    });
    app.service(exports.paymentsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(payments_schema_1.paymentExternalResolver), schema_1.hooks.resolveResult(payments_schema_1.paymentResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(payments_schema_1.paymentQueryValidator), schema_1.hooks.resolveQuery(payments_schema_1.paymentQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), restrictFind],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                // Action-based (initialize/verify) should bypass manual-entry pipeline.
                async (ctx) => {
                    if (!ctx.data?.action)
                        return ctx;
                    await (0, require_role_1.requireRole)('tenant', 'admin', 'landlord', 'property_manager')(ctx);
                    await handlePaystackActions(ctx);
                    return ctx;
                },
                async (ctx) => {
                    if (ctx.data?.action)
                        return ctx;
                    return await (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager')(ctx);
                },
                async (ctx) => {
                    if (ctx.data?.action)
                        return ctx;
                    return await schema_1.hooks.validateData(payments_schema_1.paymentDataValidator)(ctx);
                },
                async (ctx) => {
                    if (ctx.data?.action)
                        return ctx;
                    return await schema_1.hooks.resolveData(payments_schema_1.paymentDataResolver)(ctx);
                },
                async (ctx) => {
                    if (ctx.data?.action)
                        return ctx;
                    return await attachLandlordOnManualEntry(ctx);
                }
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager'),
                schema_1.hooks.validateData(payments_schema_1.paymentPatchValidator),
                schema_1.hooks.resolveData(payments_schema_1.paymentPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        }
    });
};
exports.payments = payments;
//# sourceMappingURL=payments.js.map