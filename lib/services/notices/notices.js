"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notices = exports.noticesMethods = exports.noticesPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const restrict_query_to_owner_1 = require("../../hooks/restrict-query-to-owner");
const notices_class_1 = require("./notices.class");
const notices_schema_1 = require("./notices.schema");
exports.noticesPath = 'notices';
exports.noticesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const attachLandlordId = async (context) => {
    const user = context.params.user;
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const data = context.data;
    if (roles.includes('admin')) {
        const lid = data.landlordId != null ? String(data.landlordId).trim() : '';
        data.landlordId = lid || user?._id?.toString();
        return context;
    }
    if (roles.includes('property_manager')) {
        const lid = data.landlordId != null ? String(data.landlordId).trim() : '';
        if (!lid)
            throw new errors_1.errors.BadRequest('landlordId is required');
        data.landlordId = lid;
        return context;
    }
    data.landlordId = user?._id?.toString();
    return context;
};
const attachAuthorIfMissing = async (context) => {
    const user = context.params.user;
    if (!context.data.author) {
        ;
        context.data.author = user?.fullName || user?.email || user?._id?.toString() || 'system';
    }
    return context;
};
const sendSmsIfRequested = async (context) => {
    const notice = context.result;
    const recipients = notice?.smsRecipients;
    if (!Array.isArray(recipients) || recipients.length === 0)
        return context;
    // Only attempt SMS if api key is configured
    if (!process.env.MNOTIFY_API_KEY)
        return context;
    const msg = `${notice.title}\n\n${notice.content}`;
    try {
        await context.app.service('sms').create({
            recipient: recipients,
            message: msg
        }, { provider: undefined });
        await context.app.service('notices').patch(notice._id, { smsSent: true }, { provider: undefined });
    }
    catch {
        // do not fail notice creation if SMS fails
    }
    return context;
};
const notices = (app) => {
    app.use(exports.noticesPath, new notices_class_1.NoticesService((0, notices_class_1.getOptions)(app)), {
        methods: exports.noticesMethods,
        events: []
    });
    app.service(exports.noticesPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(notices_schema_1.noticeExternalResolver), schema_1.hooks.resolveResult(notices_schema_1.noticeResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(notices_schema_1.noticeQueryValidator), schema_1.hooks.resolveQuery(notices_schema_1.noticeQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, restrict_query_to_owner_1.restrictQueryToOwner)('landlordId', ['admin', 'property_manager'])],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager'),
                attachAuthorIfMissing,
                schema_1.hooks.validateData(notices_schema_1.noticeDataValidator),
                schema_1.hooks.resolveData(notices_schema_1.noticeDataResolver),
                attachLandlordId
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager'),
                schema_1.hooks.validateData(notices_schema_1.noticePatchValidator),
                schema_1.hooks.resolveData(notices_schema_1.noticePatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        },
        after: {
            create: [sendSmsIfRequested]
        }
    });
};
exports.notices = notices;
//# sourceMappingURL=notices.js.map