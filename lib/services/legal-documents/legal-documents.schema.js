"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legalDocumentQueryResolver = exports.legalDocumentQueryValidator = exports.legalDocumentQuerySchema = exports.legalDocumentQueryProperties = exports.legalDocumentPatchResolver = exports.legalDocumentPatchValidator = exports.legalDocumentPatchSchema = exports.legalDocumentDataResolver = exports.legalDocumentDataValidator = exports.legalDocumentDataSchema = exports.legalDocumentExternalResolver = exports.legalDocumentResolver = exports.legalDocumentValidator = exports.legalDocumentSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.legalDocumentSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    userId: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    documentType: typebox_1.Type.String(),
    jurisdiction: typebox_1.Type.Optional(typebox_1.Type.String()),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('draft'), typebox_1.Type.Literal('final')])),
    content: typebox_1.Type.String(),
    metadata: typebox_1.Type.Optional(typebox_1.Type.Any()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'LegalDocument', additionalProperties: false });
exports.legalDocumentValidator = (0, typebox_1.getValidator)(exports.legalDocumentSchema, validators_1.dataValidator);
exports.legalDocumentResolver = (0, schema_1.resolve)({});
exports.legalDocumentExternalResolver = (0, schema_1.resolve)({});
exports.legalDocumentDataSchema = typebox_1.Type.Object({
    title: typebox_1.Type.String(),
    documentType: typebox_1.Type.String(),
    jurisdiction: typebox_1.Type.Optional(typebox_1.Type.String()),
    content: typebox_1.Type.String(),
    metadata: typebox_1.Type.Optional(typebox_1.Type.Any())
}, { $id: 'LegalDocumentData', additionalProperties: false });
exports.legalDocumentDataValidator = (0, typebox_1.getValidator)(exports.legalDocumentDataSchema, validators_1.dataValidator);
exports.legalDocumentDataResolver = (0, schema_1.resolve)({
    status: async () => 'draft',
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.legalDocumentPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.legalDocumentSchema, ['_id', 'userId', 'createdAt']), {
    $id: 'LegalDocumentPatch'
});
exports.legalDocumentPatchValidator = (0, typebox_1.getValidator)(exports.legalDocumentPatchSchema, validators_1.dataValidator);
exports.legalDocumentPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.legalDocumentQueryProperties = typebox_1.Type.Pick(exports.legalDocumentSchema, ['_id', 'userId', 'status', 'documentType', 'createdAt', 'updatedAt']);
exports.legalDocumentQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.legalDocumentQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.legalDocumentQueryValidator = (0, typebox_1.getValidator)(exports.legalDocumentQuerySchema, validators_1.queryValidator);
exports.legalDocumentQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=legal-documents.schema.js.map