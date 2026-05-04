"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNotificationQueryResolver = exports.userNotificationQueryValidator = exports.userNotificationQuerySchema = exports.userNotificationQueryProperties = exports.userNotificationPatchResolver = exports.userNotificationPatchValidator = exports.userNotificationPatchSchema = exports.userNotificationDataResolver = exports.userNotificationDataValidator = exports.userNotificationDataSchema = exports.userNotificationExternalResolver = exports.userNotificationResolver = exports.userNotificationValidator = exports.userNotificationSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.userNotificationSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    userId: typebox_1.Type.String(),
    eventKey: typebox_1.Type.String(),
    category: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    body: typebox_1.Type.Optional(typebox_1.Type.String()),
    readAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    linkUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    relatedService: typebox_1.Type.Optional(typebox_1.Type.String()),
    relatedId: typebox_1.Type.Optional(typebox_1.Type.String()),
    metadata: typebox_1.Type.Optional(typebox_1.Type.Any()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'UserNotification', additionalProperties: false });
exports.userNotificationValidator = (0, typebox_1.getValidator)(exports.userNotificationSchema, validators_1.dataValidator);
exports.userNotificationResolver = (0, schema_1.resolve)({});
exports.userNotificationExternalResolver = (0, schema_1.resolve)({});
/** Admin / internal only */
exports.userNotificationDataSchema = typebox_1.Type.Object({
    userId: typebox_1.Type.String(),
    eventKey: typebox_1.Type.String(),
    category: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    body: typebox_1.Type.Optional(typebox_1.Type.String()),
    linkUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    relatedService: typebox_1.Type.Optional(typebox_1.Type.String()),
    relatedId: typebox_1.Type.Optional(typebox_1.Type.String()),
    metadata: typebox_1.Type.Optional(typebox_1.Type.Any())
}, { $id: 'UserNotificationData', additionalProperties: false });
exports.userNotificationDataValidator = (0, typebox_1.getValidator)(exports.userNotificationDataSchema, validators_1.dataValidator);
exports.userNotificationDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.userNotificationPatchSchema = typebox_1.Type.Object({
    readAt: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String({ format: 'date-time' }), typebox_1.Type.Null()]))
}, { $id: 'UserNotificationPatch', additionalProperties: false });
exports.userNotificationPatchValidator = (0, typebox_1.getValidator)(exports.userNotificationPatchSchema, validators_1.dataValidator);
exports.userNotificationPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.userNotificationQueryProperties = typebox_1.Type.Intersect([
    typebox_1.Type.Pick(exports.userNotificationSchema, ['_id', 'userId', 'eventKey', 'category', 'createdAt', 'updatedAt']),
    typebox_1.Type.Object({
        readAt: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String({ format: 'date-time' }), typebox_1.Type.Null()])),
        /** Virtual: expanded server-side into a Mongo `$and` clause for unread rows. */
        unreadOnly: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Boolean(), typebox_1.Type.Literal('true'), typebox_1.Type.Literal('false')])),
        /** Virtual: expanded server-side for rows that have been marked read. */
        readOnlyOnly: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Boolean(), typebox_1.Type.Literal('true'), typebox_1.Type.Literal('false')]))
    }, { additionalProperties: true })
], { additionalProperties: true });
exports.userNotificationQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.userNotificationQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.userNotificationQueryValidator = (0, typebox_1.getValidator)(exports.userNotificationQuerySchema, validators_1.queryValidator);
exports.userNotificationQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=user-notifications.schema.js.map