"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessages = exports.chatMessagesMethods = exports.chatMessagesPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const create_user_notification_1 = require("../../utils/create-user-notification");
const chat_messages_class_1 = require("./chat-messages.class");
const chat_messages_schema_1 = require("./chat-messages.schema");
exports.chatMessagesPath = 'chat-messages';
exports.chatMessagesMethods = ['find', 'get', 'create', 'patch', 'remove'];
/** Load the inquiry and verify the current user is a participant. */
async function getInquiryAndAssertParticipant(app, inquiryId, userId) {
    const inquiry = (await app.service('inquiries').get(inquiryId, {
        provider: undefined
    }));
    const isParticipant = inquiry.createdByUserId === userId ||
        inquiry.landlordId === userId ||
        inquiry.agentUserId === userId;
    return { inquiry, isParticipant };
}
/**
 * Before create: attach sender metadata and verify the user is a participant
 * in the target inquiry.
 */
const attachSenderInfo = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const uid = user._id.toString();
    const inquiryId = context.data.inquiryId;
    if (!inquiryId)
        throw new errors_1.errors.BadRequest('inquiryId is required');
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const { inquiry, isParticipant } = await getInquiryAndAssertParticipant(context.app, inquiryId, uid);
    if (!roles.includes('admin') && !isParticipant) {
        throw new errors_1.errors.Forbidden('You are not a participant in this conversation.');
    }
    ;
    context.data.senderUserId = uid;
    // Determine role label from roles array
    if (roles.includes('agent')) {
        ;
        context.data.senderRole = 'agent';
    }
    else if (roles.includes('property_manager')) {
        ;
        context.data.senderRole = 'property_manager';
    }
    else if (roles.includes('landlord') || roles.includes('admin')) {
        ;
        context.data.senderRole = 'landlord';
    }
    else {
        ;
        context.data.senderRole = 'tenant';
    }
    // Get display name from user record
    try {
        const userRecord = (await context.app.service('users').get(uid, {
            provider: undefined
        }));
        context.data.senderName = userRecord.fullName || user.email || 'User';
    }
    catch {
        ;
        context.data.senderName = user.email || 'User';
    }
    // Auto-advance inquiry status from 'new' to 'contacted' on first reply from
    // a landlord / agent side so the inbox reflects activity.
    if (inquiry.status === 'new' &&
        (context.data.senderRole === 'landlord' ||
            context.data.senderRole === 'agent' ||
            context.data.senderRole === 'property_manager')) {
        try {
            await context.app
                .service('inquiries')
                .patch(inquiryId, { status: 'contacted' }, { provider: undefined });
        }
        catch {
            /* non-fatal */
        }
    }
    return context;
};
/** Before find: user must supply `inquiryId` and must be a participant. */
const restrictFindToParticipant = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    const inquiryId = context.params.query?.inquiryId;
    if (!inquiryId)
        throw new errors_1.errors.BadRequest('inquiryId is required');
    const uid = user._id.toString();
    const { isParticipant } = await getInquiryAndAssertParticipant(context.app, inquiryId, uid);
    if (!isParticipant) {
        throw new errors_1.errors.Forbidden('You are not a participant in this conversation.');
    }
    return context;
};
const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '');
/**
 * After create: patch the parent inquiry with the latest message timestamp and
 * preview, then notify every other participant of the new message.
 */
const afterChatMessageCreated = async (context) => {
    const msg = context.result;
    if (!msg?.inquiryId)
        return context;
    const inquiryId = String(msg.inquiryId);
    const senderUserId = String(msg.senderUserId || '');
    // Patch inquiry with last-message metadata for thread sorting / preview
    try {
        await context.app.service('inquiries').patch(inquiryId, {
            lastMessageAt: msg.createdAt || new Date().toISOString(),
            lastMessagePreview: String(msg.body || '').slice(0, 120)
        }, { provider: undefined });
    }
    catch {
        /* non-fatal */
    }
    // Notify all OTHER participants
    let inquiry = null;
    try {
        inquiry = await context.app.service('inquiries').get(inquiryId, { provider: undefined });
    }
    catch {
        return context;
    }
    const participants = [];
    if (inquiry.createdByUserId && inquiry.createdByUserId !== senderUserId) {
        participants.push({ userId: inquiry.createdByUserId, label: 'tenant' });
    }
    if (inquiry.landlordId && inquiry.landlordId !== senderUserId) {
        participants.push({ userId: inquiry.landlordId, label: 'landlord' });
    }
    if (inquiry.agentUserId && inquiry.agentUserId !== senderUserId && inquiry.agentUserId !== inquiry.landlordId) {
        participants.push({ userId: inquiry.agentUserId, label: 'agent' });
    }
    const senderName = msg.senderName || 'Someone';
    const preview = String(msg.body || '').slice(0, 100);
    await Promise.allSettled(participants.map(({ userId }) => (0, create_user_notification_1.createUserNotification)(context.app, {
        userId,
        eventKey: 'chat_message.created',
        category: 'inquiry',
        title: `New message from ${senderName}`,
        body: preview,
        linkUrl: `${appUrl()}/messages`,
        relatedService: 'inquiries',
        relatedId: inquiryId,
        metadata: { inquiryId, senderUserId }
    })));
    return context;
};
const chatMessages = (app) => {
    app.use(exports.chatMessagesPath, new chat_messages_class_1.ChatMessagesService((0, chat_messages_class_1.getOptions)(app)), {
        methods: exports.chatMessagesMethods,
        events: []
    });
    app.service(exports.chatMessagesPath).hooks({
        around: {
            all: [
                schema_1.hooks.resolveExternal(chat_messages_schema_1.chatMessageExternalResolver),
                schema_1.hooks.resolveResult(chat_messages_schema_1.chatMessageResolver)
            ]
        },
        before: {
            all: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                schema_1.hooks.validateQuery(chat_messages_schema_1.chatMessageQueryValidator),
                schema_1.hooks.resolveQuery(chat_messages_schema_1.chatMessageQueryResolver)
            ],
            find: [restrictFindToParticipant],
            get: [],
            create: [
                schema_1.hooks.validateData(chat_messages_schema_1.chatMessageDataValidator),
                schema_1.hooks.resolveData(chat_messages_schema_1.chatMessageDataResolver),
                attachSenderInfo
            ],
            patch: [(0, require_role_1.requireRole)('admin')],
            remove: [(0, require_role_1.requireRole)('admin')]
        },
        after: {
            create: [afterChatMessageCreated]
        }
    });
};
exports.chatMessages = chatMessages;
//# sourceMappingURL=chat-messages.js.map