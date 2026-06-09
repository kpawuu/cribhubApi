"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessages = exports.chatMessagesMethods = exports.chatMessagesPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const create_user_notification_1 = require("../../utils/create-user-notification");
const threads_1 = require("../threads/threads");
const chat_messages_class_1 = require("./chat-messages.class");
const chat_messages_schema_1 = require("./chat-messages.schema");
exports.chatMessagesPath = 'chat-messages';
exports.chatMessagesMethods = ['find', 'get', 'create', 'patch', 'remove'];
/** Load the inquiry and verify the current user is a participant. */
async function getInquiryAndAssertParticipant(app, inquiryId, userId) {
    const inquiry = (await app.service('inquiries').get(inquiryId, { provider: undefined }));
    const isParticipant = inquiry.createdByUserId === userId || inquiry.landlordId === userId || inquiry.agentUserId === userId;
    return { inquiry, isParticipant };
}
async function getThreadAndAssertParticipant(app, threadId, userId) {
    const db = await app.get('mongodbClient');
    const filter = mongodb_1.ObjectId.isValid(threadId) && threadId.length === 24 ? { _id: new mongodb_1.ObjectId(threadId) } : { _id: threadId };
    const thread = await db.collection('threads').findOne(filter);
    if (!thread)
        throw new errors_1.errors.NotFound('Thread not found');
    const isParticipant = Array.isArray(thread.participantIds) && thread.participantIds.map(String).includes(String(userId));
    return { thread, isParticipant };
}
/**
 * Auto-create or re-use a thread when a message has only an `inquiryId`
 * (legacy callers). Ensures every message has a threadId going forward.
 */
async function ensureThreadForLegacyInquiry(app, inquiryId) {
    try {
        const inquiry = (await app.service('inquiries').get(inquiryId, { provider: undefined }));
        const participants = [inquiry.createdByUserId, inquiry.landlordId, inquiry.agentUserId]
            .filter(Boolean)
            .map(String);
        if (participants.length < 2)
            return null;
        const property = inquiry.propertyId
            ? await app
                .service('properties')
                .get(inquiry.propertyId, { provider: undefined })
                .catch(() => null)
            : null;
        const t = await (0, threads_1.findOrCreateThread)(app, {
            kind: inquiry.agentUserId ? 'landlord-agent' : 'landlord-tenant',
            participantIds: participants,
            subject: { type: 'inquiry', id: String(inquiryId) },
            propertyId: inquiry.propertyId ? String(inquiry.propertyId) : undefined,
            inquiryId: String(inquiryId),
            title: property?.name || 'Inquiry conversation'
        });
        return t?._id ? String(t._id) : null;
    }
    catch {
        return null;
    }
}
const attachSenderInfo = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const uid = user._id.toString();
    const d = context.data;
    if (!d.threadId && !d.inquiryId)
        throw new errors_1.errors.BadRequest('threadId or inquiryId is required');
    const roles = Array.isArray(user.roles) ? user.roles : [];
    // Resolve / verify the conversation
    if (d.threadId) {
        const { isParticipant } = await getThreadAndAssertParticipant(context.app, String(d.threadId), uid);
        if (!roles.includes('admin') && !isParticipant) {
            throw new errors_1.errors.Forbidden('You are not a participant in this conversation.');
        }
    }
    else if (d.inquiryId) {
        const { inquiry, isParticipant } = await getInquiryAndAssertParticipant(context.app, String(d.inquiryId), uid);
        if (!roles.includes('admin') && !isParticipant) {
            throw new errors_1.errors.Forbidden('You are not a participant in this conversation.');
        }
        // Back-fill threadId so future renderers can use threads natively.
        const newThreadId = await ensureThreadForLegacyInquiry(context.app, String(d.inquiryId));
        if (newThreadId)
            d.threadId = newThreadId;
        // Inquiry status auto-advance (existing behaviour)
        const newSenderRole = roles.includes('agent') ? 'agent'
            : roles.includes('property_manager') ? 'property_manager'
                : roles.includes('landlord') || roles.includes('admin') ? 'landlord'
                    : 'tenant';
        if (inquiry.status === 'new' && (newSenderRole === 'landlord' || newSenderRole === 'agent' || newSenderRole === 'property_manager')) {
            try {
                await context.app.service('inquiries').patch(String(d.inquiryId), { status: 'contacted' }, { provider: undefined });
            }
            catch { }
        }
    }
    d.senderUserId = uid;
    if (roles.includes('agent'))
        d.senderRole = 'agent';
    else if (roles.includes('property_manager'))
        d.senderRole = 'property_manager';
    else if (roles.includes('landlord') || roles.includes('admin'))
        d.senderRole = 'landlord';
    else
        d.senderRole = 'tenant';
    try {
        const userRecord = (await context.app.service('users').get(uid, { provider: undefined }));
        d.senderName = userRecord.fullName || user.email || 'User';
    }
    catch {
        d.senderName = user.email || 'User';
    }
    return context;
};
/** Before find: require threadId OR inquiryId and participant access. */
const restrictFindToParticipant = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    const q = (context.params.query || {});
    const threadId = q.threadId;
    const inquiryId = q.inquiryId;
    if (!threadId && !inquiryId)
        throw new errors_1.errors.BadRequest('threadId or inquiryId is required');
    const uid = user._id.toString();
    if (threadId) {
        const { isParticipant } = await getThreadAndAssertParticipant(context.app, String(threadId), uid);
        if (!isParticipant)
            throw new errors_1.errors.Forbidden('You are not a participant in this conversation.');
    }
    else {
        const { isParticipant } = await getInquiryAndAssertParticipant(context.app, String(inquiryId), uid);
        if (!isParticipant)
            throw new errors_1.errors.Forbidden('You are not a participant in this conversation.');
    }
    return context;
};
const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '');
const afterChatMessageCreated = async (context) => {
    const msg = context.result;
    const senderUserId = String(msg.senderUserId || '');
    // Always derive a threadId path going forward.
    let threadDoc = null;
    if (msg.threadId) {
        try {
            const db = await context.app.get('mongodbClient');
            const filter = mongodb_1.ObjectId.isValid(String(msg.threadId)) && String(msg.threadId).length === 24
                ? { _id: new mongodb_1.ObjectId(String(msg.threadId)) }
                : { _id: msg.threadId };
            threadDoc = await db.collection('threads').findOne(filter);
            if (threadDoc) {
                await context.app.service('threads').patch(String(threadDoc._id), {
                    lastMessageAt: msg.createdAt || new Date().toISOString(),
                    lastMessagePreview: String(msg.body || '').slice(0, 120),
                    lastMessageBy: senderUserId
                }, { provider: undefined });
            }
        }
        catch { }
    }
    // Maintain inquiry preview metadata for legacy threads.
    if (msg.inquiryId) {
        try {
            await context.app.service('inquiries').patch(String(msg.inquiryId), {
                lastMessageAt: msg.createdAt || new Date().toISOString(),
                lastMessagePreview: String(msg.body || '').slice(0, 120)
            }, { provider: undefined });
        }
        catch { }
    }
    // Notify other participants
    const participants = [];
    if (threadDoc?.participantIds) {
        for (const uid of threadDoc.participantIds)
            if (String(uid) !== senderUserId)
                participants.push(String(uid));
    }
    else if (msg.inquiryId) {
        try {
            const inquiry = (await context.app.service('inquiries').get(String(msg.inquiryId), { provider: undefined }));
            if (inquiry.createdByUserId && inquiry.createdByUserId !== senderUserId)
                participants.push(inquiry.createdByUserId);
            if (inquiry.landlordId && inquiry.landlordId !== senderUserId && !participants.includes(inquiry.landlordId)) {
                participants.push(inquiry.landlordId);
            }
            if (inquiry.agentUserId &&
                inquiry.agentUserId !== senderUserId &&
                !participants.includes(inquiry.agentUserId)) {
                participants.push(inquiry.agentUserId);
            }
        }
        catch { }
    }
    const senderName = msg.senderName || 'Someone';
    const preview = String(msg.body || '').slice(0, 100);
    const link = msg.threadId
        ? `${appUrl()}/messages?threadId=${msg.threadId}`
        : msg.inquiryId
            ? `${appUrl()}/messages?inquiryId=${msg.inquiryId}`
            : `${appUrl()}/messages`;
    await Promise.allSettled([...new Set(participants)].map((userId) => (0, create_user_notification_1.createUserNotification)(context.app, {
        userId,
        eventKey: 'chat_message.created',
        category: 'inquiry',
        title: `New message from ${senderName}`,
        body: preview,
        linkUrl: link,
        relatedService: msg.threadId ? 'threads' : 'inquiries',
        relatedId: String(msg.threadId || msg.inquiryId || ''),
        metadata: { threadId: msg.threadId, inquiryId: msg.inquiryId, senderUserId }
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
            all: [schema_1.hooks.resolveExternal(chat_messages_schema_1.chatMessageExternalResolver), schema_1.hooks.resolveResult(chat_messages_schema_1.chatMessageResolver)]
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