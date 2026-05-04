"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNotifications = exports.userNotificationsMethods = exports.userNotificationsPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const populate_roles_1 = require("../../hooks/populate-roles");
const restrict_query_to_owner_1 = require("../../hooks/restrict-query-to-owner");
const emailMessage_1 = __importDefault(require("../../utils/emailMessage"));
const user_notifications_class_1 = require("./user-notifications.class");
const user_notifications_schema_1 = require("./user-notifications.schema");
exports.userNotificationsPath = 'user-notifications';
exports.userNotificationsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const collection = async (app) => {
    const db = await app.get('mongodbClient');
    return db.collection('user_notifications');
};
const idFilter = (raw) => {
    if (mongodb_1.ObjectId.isValid(raw) && String(new mongodb_1.ObjectId(raw)) === raw)
        return { _id: new mongodb_1.ObjectId(raw) };
    return { _id: raw };
};
const assertOwnUnlessAdmin = async (context, id) => {
    if (!context.params.provider)
        return;
    const roles = Array.isArray(context.params.user?.roles)
        ? context.params.user.roles
        : [];
    if (roles.includes('admin'))
        return;
    const userId = context.params.user?._id?.toString();
    if (!userId)
        throw new errors_1.errors.NotAuthenticated();
    const row = await (await collection(context.app)).findOne(idFilter(id));
    if (!row)
        throw new errors_1.errors.NotFound('Notification not found');
    if (row.userId !== userId)
        throw new errors_1.errors.Forbidden('You cannot access this notification.');
};
const blockExternalCreateUnlessAdmin = async (context) => {
    if (!context.params.provider)
        return context;
    const roles = Array.isArray(context.params.user?.roles)
        ? context.params.user.roles
        : [];
    if (!roles.includes('admin')) {
        throw new errors_1.errors.Forbidden('Only admins can create notifications directly.');
    }
    return context;
};
const smtpConfigured = () => Boolean(process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD);
const notificationEmailsGloballyDisabled = () => String(process.env.NOTIFICATION_EMAIL_DISABLED || '').toLowerCase() === 'true';
/**
 * Turns virtual list filters into Mongo clauses (and removes virtual keys) before the adapter runs.
 * Keeps mutations on the same `params.query` object reference so VALIDATED from validateQuery is preserved.
 */
const expandNotificationListFilters = async (context) => {
    if (context.method !== 'find')
        return context;
    const q = context.params.query;
    if (!q)
        return context;
    const uo = q.unreadOnly;
    const ro = q.readOnlyOnly;
    if (uo !== undefined)
        delete q.unreadOnly;
    if (ro !== undefined)
        delete q.readOnlyOnly;
    const uoOn = uo === true || uo === 'true';
    const roOn = ro === true || ro === 'true';
    if (!uoOn && !roOn)
        return context;
    if (!Array.isArray(q.$and))
        q.$and = [];
    if (uoOn) {
        q.$and.push({ $or: [{ readAt: { $exists: false } }, { readAt: null }] });
    }
    if (roOn) {
        q.$and.push({ readAt: { $exists: true, $ne: null } });
    }
    return context;
};
const mailFrom = () => {
    const appName = process.env.APP_NAME || 'RentFlow';
    return `"${appName}" <${process.env.MAIL_SENT_FROM || process.env.MAIL_USERNAME || 'no-reply@localhost'}>`;
};
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/**
 * After each persisted notification, email the recipient (same SMTP guard as auth mailer).
 * Failures are logged only so notification creation always succeeds.
 */
const emailRecipientOnNotificationCreated = async (context) => {
    const n = context.result;
    if (!n?.userId || !n?.title)
        return context;
    if (context.params.skipNotificationEmail)
        return context;
    if (notificationEmailsGloballyDisabled())
        return context;
    if (!smtpConfigured())
        return context;
    try {
        const recipient = await context.app.service('users').get(n.userId, { provider: undefined });
        const to = recipient?.email;
        if (!to)
            return context;
        if (recipient?.emailNotifications === false)
            return context;
        const appName = process.env.APP_NAME || 'RentFlow';
        const safeTitle = escapeHtml(String(n.title));
        const safeBody = n.body ? escapeHtml(String(n.body)).replace(/\n/g, '<br/>') : '';
        const inner = [
            `Hello ${escapeHtml(String(recipient.fullName || 'there'))},`,
            ``,
            `<b>${safeTitle}</b>`,
            safeBody ? `<p style="margin-top:12px;">${safeBody}</p>` : ''
        ].join('');
        const html = await (0, emailMessage_1.default)(inner, n.linkUrl ? String(n.linkUrl) : undefined);
        const textLines = [
            `Hello ${String(recipient.fullName || 'there')},`,
            '',
            String(n.title),
            n.body ? String(n.body) : '',
            n.linkUrl ? `\nOpen: ${String(n.linkUrl)}` : ''
        ].filter((line, i, arr) => !(line === '' && (arr[i - 1] === '' || i === 0)));
        await context.app.service('mailer').create({
            from: mailFrom(),
            to,
            subject: `${appName}: ${String(n.title).slice(0, 120)}`,
            html,
            text: textLines.join('\n')
        }, { provider: undefined });
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[user-notifications] Email to recipient failed', e);
    }
    return context;
};
const restrictPatchToReadOnly = async (context) => {
    if (!context.params.provider)
        return context;
    const roles = Array.isArray(context.params.user?.roles)
        ? context.params.user.roles
        : [];
    if (roles.includes('admin'))
        return context;
    const raw = context.data?.readAt;
    context.data = { readAt: raw !== undefined ? raw : new Date().toISOString() };
    return context;
};
const userNotifications = (app) => {
    app.use(exports.userNotificationsPath, new user_notifications_class_1.UserNotificationsService((0, user_notifications_class_1.getOptions)(app)), {
        methods: exports.userNotificationsMethods,
        events: []
    });
    app.service(exports.userNotificationsPath).hooks({
        around: {
            all: [
                schema_1.hooks.resolveExternal(user_notifications_schema_1.userNotificationExternalResolver),
                schema_1.hooks.resolveResult(user_notifications_schema_1.userNotificationResolver)
            ]
        },
        before: {
            all: [schema_1.hooks.validateQuery(user_notifications_schema_1.userNotificationQueryValidator), schema_1.hooks.resolveQuery(user_notifications_schema_1.userNotificationQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, expandNotificationListFilters, (0, restrict_query_to_owner_1.restrictQueryToOwner)('userId', ['admin'])],
            get: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                async (ctx) => {
                    await assertOwnUnlessAdmin(ctx, String(ctx.id));
                    return ctx;
                }
            ],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                blockExternalCreateUnlessAdmin,
                schema_1.hooks.validateData(user_notifications_schema_1.userNotificationDataValidator),
                schema_1.hooks.resolveData(user_notifications_schema_1.userNotificationDataResolver)
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                async (ctx) => {
                    await assertOwnUnlessAdmin(ctx, String(ctx.id));
                    return ctx;
                },
                restrictPatchToReadOnly,
                schema_1.hooks.validateData(user_notifications_schema_1.userNotificationPatchValidator),
                schema_1.hooks.resolveData(user_notifications_schema_1.userNotificationPatchResolver)
            ],
            remove: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                async (ctx) => {
                    const roles = Array.isArray(ctx.params.user?.roles)
                        ? ctx.params.user.roles
                        : [];
                    if (roles.includes('admin'))
                        return ctx;
                    await assertOwnUnlessAdmin(ctx, String(ctx.id));
                    return ctx;
                }
            ]
        },
        after: {
            create: [emailRecipientOnNotificationCreated]
        }
    });
};
exports.userNotifications = userNotifications;
//# sourceMappingURL=user-notifications.js.map