"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesQueryResolver = exports.filesQueryValidator = exports.filesQuerySchema = exports.filesQueryProperties = exports.filesPatchResolver = exports.filesPatchValidator = exports.filesPatchSchema = exports.filesDataResolver = exports.filesDataValidator = exports.filesDataSchema = exports.filesExternalResolver = exports.filesResolver = exports.filesValidator = exports.filesSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.filesSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    entityId: typebox_1.Type.String(),
    entityType: typebox_1.Type.String(),
    fileName: typebox_1.Type.String(),
    fileType: typebox_1.Type.String(),
    fileSize: typebox_1.Type.Optional(typebox_1.Type.Number()),
    fileUrl: typebox_1.Type.String(),
    fileHash: typebox_1.Type.Optional(typebox_1.Type.String()),
    fileExtension: typebox_1.Type.Optional(typebox_1.Type.String()),
    tags: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    metadata: typebox_1.Type.Optional(typebox_1.Type.Any()),
    createdAt: typebox_1.Type.String({ format: 'date-time' })
}, { $id: 'FileRecord', additionalProperties: false });
exports.filesValidator = (0, typebox_1.getValidator)(exports.filesSchema, validators_1.dataValidator);
exports.filesResolver = (0, schema_1.resolve)({});
exports.filesExternalResolver = (0, schema_1.resolve)({});
exports.filesDataSchema = typebox_1.Type.Pick(exports.filesSchema, ['entityId', 'entityType', 'fileName', 'fileType', 'fileSize', 'fileUrl', 'fileHash', 'fileExtension', 'tags', 'metadata'], {
    $id: 'FileRecordData'
});
exports.filesDataValidator = (0, typebox_1.getValidator)(exports.filesDataSchema, validators_1.dataValidator);
exports.filesDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString()
});
exports.filesPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.filesSchema, ['_id', 'createdAt']), { $id: 'FileRecordPatch' });
exports.filesPatchValidator = (0, typebox_1.getValidator)(exports.filesPatchSchema, validators_1.dataValidator);
exports.filesPatchResolver = (0, schema_1.resolve)({});
exports.filesQueryProperties = typebox_1.Type.Pick(exports.filesSchema, ['_id', 'entityId', 'entityType']);
exports.filesQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.filesQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], {
    additionalProperties: true
});
exports.filesQueryValidator = (0, typebox_1.getValidator)(exports.filesQuerySchema, validators_1.queryValidator);
exports.filesQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=files.schema.js.map