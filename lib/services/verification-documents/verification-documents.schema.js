"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationDocumentQueryResolver = exports.verificationDocumentQueryValidator = exports.verificationDocumentQuerySchema = exports.verificationDocumentQueryProperties = exports.verificationDocumentPatchResolver = exports.verificationDocumentPatchValidator = exports.verificationDocumentPatchSchema = exports.verificationDocumentDataResolver = exports.verificationDocumentDataValidator = exports.verificationDocumentDataSchema = exports.verificationDocumentExternalResolver = exports.verificationDocumentResolver = exports.verificationDocumentValidator = exports.verificationDocumentSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
const resolveEntityFiles_1 = require("../../utils/resolveEntityFiles");
exports.verificationDocumentSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    roleRequestId: typebox_1.Type.String(),
    documentType: typebox_1.Type.String(),
    documentUrl: typebox_1.Type.String(),
    files: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Any())),
    uploadedAt: typebox_1.Type.String({ format: 'date-time' })
}, { $id: 'VerificationDocument', additionalProperties: false });
exports.verificationDocumentValidator = (0, typebox_1.getValidator)(exports.verificationDocumentSchema, validators_1.dataValidator);
exports.verificationDocumentResolver = (0, schema_1.resolve)({});
exports.verificationDocumentExternalResolver = (0, schema_1.resolve)({
    files: async (_value, doc, context) => {
        const id = doc?._id?.toString?.() ?? '';
        if (!id)
            return [];
        return await (0, resolveEntityFiles_1.resolveEntityFiles)(context.app, 'verification-documents', id);
    }
});
exports.verificationDocumentDataSchema = typebox_1.Type.Object({
    roleRequestId: typebox_1.Type.String(),
    documentType: typebox_1.Type.String(),
    documentUrl: typebox_1.Type.String()
}, { $id: 'VerificationDocumentData', additionalProperties: false });
exports.verificationDocumentDataValidator = (0, typebox_1.getValidator)(exports.verificationDocumentDataSchema, validators_1.dataValidator);
exports.verificationDocumentDataResolver = (0, schema_1.resolve)({
    uploadedAt: async () => new Date().toISOString()
});
exports.verificationDocumentPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.verificationDocumentSchema, ['_id', 'uploadedAt']), {
    $id: 'VerificationDocumentPatch'
});
exports.verificationDocumentPatchValidator = (0, typebox_1.getValidator)(exports.verificationDocumentPatchSchema, validators_1.dataValidator);
exports.verificationDocumentPatchResolver = (0, schema_1.resolve)({});
exports.verificationDocumentQueryProperties = typebox_1.Type.Pick(exports.verificationDocumentSchema, ['_id', 'roleRequestId', 'documentType']);
exports.verificationDocumentQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.verificationDocumentQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.verificationDocumentQueryValidator = (0, typebox_1.getValidator)(exports.verificationDocumentQuerySchema, validators_1.queryValidator);
exports.verificationDocumentQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=verification-documents.schema.js.map