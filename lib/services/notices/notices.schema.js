"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticeQueryResolver = exports.noticeQueryValidator = exports.noticeQuerySchema = exports.noticeQueryProperties = exports.noticePatchResolver = exports.noticePatchValidator = exports.noticePatchSchema = exports.noticeDataResolver = exports.noticeDataValidator = exports.noticeDataSchema = exports.noticeExternalResolver = exports.noticeResolver = exports.noticeValidator = exports.noticeSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.noticeSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    landlordId: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    content: typebox_1.Type.String(),
    type: typebox_1.Type.Optional(typebox_1.Type.String()),
    author: typebox_1.Type.String(),
    isManualEntry: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    smsSent: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    smsRecipients: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'Notice', additionalProperties: false });
exports.noticeValidator = (0, typebox_1.getValidator)(exports.noticeSchema, validators_1.dataValidator);
exports.noticeResolver = (0, schema_1.resolve)({});
exports.noticeExternalResolver = (0, schema_1.resolve)({});
exports.noticeDataSchema = typebox_1.Type.Object({
    /** Required for `property_manager` (and optional for `admin`) when posting on behalf of a landlord. */
    landlordId: typebox_1.Type.Optional(typebox_1.Type.String()),
    title: typebox_1.Type.String(),
    content: typebox_1.Type.String(),
    type: typebox_1.Type.Optional(typebox_1.Type.String()),
    author: typebox_1.Type.String(),
    isManualEntry: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    smsRecipients: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String()))
}, { $id: 'NoticeData', additionalProperties: false });
exports.noticeDataValidator = (0, typebox_1.getValidator)(exports.noticeDataSchema, validators_1.dataValidator);
exports.noticeDataResolver = (0, schema_1.resolve)({
    smsSent: async () => false,
    isManualEntry: async (v) => v ?? false,
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.noticePatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.noticeSchema, ['_id', 'landlordId', 'createdAt']), { $id: 'NoticePatch' });
exports.noticePatchValidator = (0, typebox_1.getValidator)(exports.noticePatchSchema, validators_1.dataValidator);
exports.noticePatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.noticeQueryProperties = typebox_1.Type.Pick(exports.noticeSchema, [
    '_id',
    'landlordId',
    'type',
    'smsSent',
    'createdAt',
    'updatedAt'
]);
exports.noticeQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.noticeQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.noticeQueryValidator = (0, typebox_1.getValidator)(exports.noticeQuerySchema, validators_1.queryValidator);
exports.noticeQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=notices.schema.js.map