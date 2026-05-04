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
const populate_roles_1 = require("../../hooks/populate-roles");
const portfolio_unit_ids_1 = require("../../hooks/portfolio-unit-ids");
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
    const uid = user._id.toString();
    if (roles.includes('admin'))
        return context;
    if (roles.includes('property_manager')) {
        const db = await context.app.get('mongodbClient');
        const assigns = await db
            .collection('property_manager_assignments')
            .find({ managerUserId: uid })
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
    const ors = [];
    if (roles.includes('tenant')) {
        ors.push({ tenantId: uid });
    }
    if (roles.includes('landlord')) {
        ors.push({ landlordId: uid });
    }
    if (roles.includes('agent')) {
        const agentUnitIds = await (0, portfolio_unit_ids_1.unitIdsForAgent)(context.app, uid);
        if (agentUnitIds.length === 1) {
            ors.push({ unitId: agentUnitIds[0] });
        }
        else if (agentUnitIds.length > 1) {
            ors.push({ unitId: { $in: agentUnitIds } });
        }
    }
    if (ors.length === 0) {
        (0, merge_query_1.mergeQuery)(context, { tenantId: '__none__' });
        return context;
    }
    if (ors.length === 1) {
        (0, merge_query_1.mergeQuery)(context, ors[0]);
    }
    else {
        (0, merge_query_1.mergeQuery)(context, { $or: ors });
    }
    return context;
};
async function loadPaymentRow(context) {
    const db = await context.app.get('mongodbClient');
    const col = db.collection('payments');
    const raw = String(context.id || '');
    let row = await col.findOne({ _id: raw });
    if (!row && mongodb_1.ObjectId.isValid(raw) && raw.length === 24) {
        row = await col.findOne({ _id: new mongodb_1.ObjectId(raw) });
    }
    return row;
}
async function landlordIdsForPropertyManager(app, managerUserId) {
    const db = await app.get('mongodbClient');
    const assigns = await db
        .collection('property_manager_assignments')
        .find({ managerUserId: String(managerUserId) })
        .project({ propertyId: 1 })
        .toArray();
    const pids = [...new Set(assigns.map((a) => String(a.propertyId)).filter(Boolean))];
    if (!pids.length)
        return [];
    const oids = pids.map((i) => (mongodb_1.ObjectId.isValid(String(i)) && String(i).length === 24 ? new mongodb_1.ObjectId(String(i)) : i));
    const props = await db.collection('properties').find({ _id: { $in: oids } }).project({ landlordId: 1 }).toArray();
    return [...new Set(props.map((p) => String(p.landlordId)).filter(Boolean))];
}
const restrictPaymentGet = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const uid = user._id.toString();
    const row = await loadPaymentRow(context);
    if (!row)
        throw new errors_1.errors.NotFound();
    if (roles.includes('admin'))
        return context;
    if (roles.includes('tenant') && String(row.tenantId) === uid)
        return context;
    if (roles.includes('landlord') && String(row.landlordId) === uid)
        return context;
    if (roles.includes('property_manager')) {
        const lids = await landlordIdsForPropertyManager(context.app, uid);
        if (lids.includes(String(row.landlordId)))
            return context;
    }
    if (roles.includes('agent')) {
        const agentUnitIds = await (0, portfolio_unit_ids_1.unitIdsForAgent)(context.app, uid);
        if (agentUnitIds.includes(String(row.unitId)))
            return context;
    }
    throw new errors_1.errors.Forbidden('You cannot access this payment.');
};
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
const stampContractLastPaidAt = async (app, unitId, tenantId, paidAt) => {
    try {
        const db = await app.get('mongodbClient');
        const contract = await db.collection('rental_contracts').findOne({
            unitId: String(unitId),
            tenantId: String(tenantId),
            status: { $in: ['active', 'signed'] }
        });
        if (!contract?._id)
            return;
        await app.service('rental-contracts').patch(String(contract._id), { lastPaidAt: paidAt }, { provider: undefined });
    }
    catch (e) {
        console.error('[stampContractLastPaidAt] failed:', e);
    }
};
const handlePaystackActions = async (context) => {
    const data = context.data;
    if (!data?.action)
        return context;
    if (data.action === 'initialize') {
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key)
            throw new errors_1.errors.BadRequest('PAYSTACK_SECRET_KEY not set');
        const rawEmail = data.email || '';
        // Paystack rejects fake TLDs (.test, .local, etc). In dev/test, fall back
        // to a real-looking address so checkout can proceed.
        const isFakeEmail = /\.(test|local|example|invalid|localhost)$/i.test(rawEmail) || /[@.]example\./i.test(rawEmail);
        const email = isFakeEmail ? 'no-reply+paystack-test@cribhub.app' : rawEmail;
        const amount = Number(data.amount);
        const currency = data.currency || 'GHS';
        const unitId = data.unitId;
        const landlordId = data.landlordId;
        const tenantId = context.params.user?._id?.toString();
        if (!email)
            throw new errors_1.errors.BadRequest('email is required for payment');
        if (!unitId)
            throw new errors_1.errors.BadRequest('unitId is required for payment');
        if (!landlordId)
            throw new errors_1.errors.BadRequest('landlordId is required for payment');
        if (!tenantId)
            throw new errors_1.errors.NotAuthenticated('Must be logged in to make a payment');
        if (!amount || amount <= 0)
            throw new errors_1.errors.BadRequest('Payment amount must be greater than zero. Please ensure the rental contract has a valid monthly rent set.');
        // Paystack expects amount in kobo/pesewas (minor units)
        const amountMinor = Math.round(amount * 100);
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
            const paystackMsg = json?.message || json?.data?.message || JSON.stringify(json);
            console.error('[Paystack initialize] failed:', paystackMsg, '| request:', { email, amountMinor, currency, unitId });
            throw new errors_1.errors.BadRequest(`Paystack error: ${paystackMsg}`);
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
            const paidAt = dataObj.paid_at || new Date().toISOString();
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
                paidAt,
                isManualEntry: false,
                metadata: dataObj
            }, { provider: undefined });
            // Mark the active contract as paid
            await stampContractLastPaidAt(context.app, unitId, tenantId, paidAt);
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
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictFind],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictPaymentGet],
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
                // Internal calls (provider === undefined) are trusted — skip role check,
                // data validation, and manual-entry logic entirely.
                async (ctx) => {
                    if (ctx.data?.action || !ctx.params.provider)
                        return ctx;
                    return await (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager')(ctx);
                },
                async (ctx) => {
                    if (ctx.data?.action || !ctx.params.provider)
                        return ctx;
                    return await schema_1.hooks.validateData(payments_schema_1.paymentDataValidator)(ctx);
                },
                async (ctx) => {
                    if (ctx.data?.action || !ctx.params.provider)
                        return ctx;
                    return await schema_1.hooks.resolveData(payments_schema_1.paymentDataResolver)(ctx);
                },
                async (ctx) => {
                    if (ctx.data?.action || !ctx.params.provider)
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