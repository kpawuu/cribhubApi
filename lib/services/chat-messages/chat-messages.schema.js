"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessageQueryResolver = exports.chatMessageQueryValidator = exports.chatMessageQuerySchema = exports.chatMessageQueryProperties = exports.chatMessagePatchResolver = exports.chatMessagePatchValidator = exports.chatMessagePatchSchema = exports.chatMessageDataResolver = exports.chatMessageDataValidator = exports.chatMessageDataSchema = exports.chatMessageExternalResolver = exports.chatMessageResolver = exports.chatMessageValidator = exports.chatMessageSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.chatMessageSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    /**
     * Modern thread reference. Always present on new messages. For legacy
     * inquiry-only messages, `threadId` is populated by a migration hook to
     * the thread auto-created from the inquiry.
     */
    threadId: typebox_1.Type.Optional(typebox_1.Type.String()),
    /** Legacy: inquiry the message belongs to. Still maintained for tenant→landlord chats. */
    inquiryId: typebox_1.Type.Optional(typebox_1.Type.String()),
    senderUserId: typebox_1.Type.String(),
    senderName: typebox_1.Type.Optional(typebox_1.Type.String()),
    senderRole: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal('tenant'),
        typebox_1.Type.Literal('landlord'),
        typebox_1.Type.Literal('agent'),
        typebox_1.Type.Literal('property_manager'),
        typebox_1.Type.Literal('admin')
    ])),
    body: typebox_1.Type.String(),
    /** Optional system message (e.g. "Landlord accepted your request") rendered as a chip. */
    system: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'ChatMessage', additionalProperties: false });
exports.chatMessageValidator = (0, typebox_1.getValidator)(exports.chatMessageSchema, validators_1.dataValidator);
exports.chatMessageResolver = (0, schema_1.resolve)({});
exports.chatMessageExternalResolver = (0, schema_1.resolve)({});
exports.chatMessageDataSchema = typebox_1.Type.Object({
    threadId: typebox_1.Type.Optional(typebox_1.Type.String()),
    inquiryId: typebox_1.Type.Optional(typebox_1.Type.String()),
    body: typebox_1.Type.String(),
    system: typebox_1.Type.Optional(typebox_1.Type.Boolean())
}, { $id: 'ChatMessageData', additionalProperties: false });
exports.chatMessageDataValidator = (0, typebox_1.getValidator)(exports.chatMessageDataSchema, validators_1.dataValidator);
exports.chatMessageDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.chatMessagePatchSchema = typebox_1.Type.Partial(typebox_1.Type.Object({ body: typebox_1.Type.Optional(typebox_1.Type.String()) }), { $id: 'ChatMessagePatch', additionalProperties: false });
exports.chatMessagePatchValidator = (0, typebox_1.getValidator)(exports.chatMessagePatchSchema, validators_1.dataValidator);
exports.chatMessagePatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.chatMessageQueryProperties = typebox_1.Type.Pick(exports.chatMessageSchema, [
    '_id',
    'threadId',
    'inquiryId',
    'senderUserId',
    'createdAt'
]);
exports.chatMessageQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.chatMessageQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.chatMessageQueryValidator = (0, typebox_1.getValidator)(exports.chatMessageQuerySchema, validators_1.queryValidator);
exports.chatMessageQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=chat-messages.schema.js.map