"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationDocuments = exports.verificationDocumentsMethods = exports.verificationDocumentsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const verification_documents_class_1 = require("./verification-documents.class");
const verification_documents_schema_1 = require("./verification-documents.schema");
exports.verificationDocumentsPath = 'verification-documents';
exports.verificationDocumentsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const verificationDocuments = (app) => {
    app.use(exports.verificationDocumentsPath, new verification_documents_class_1.VerificationDocumentsService((0, verification_documents_class_1.getOptions)(app)), {
        methods: exports.verificationDocumentsMethods,
        events: []
    });
    app.service(exports.verificationDocumentsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(verification_documents_schema_1.verificationDocumentExternalResolver), schema_1.hooks.resolveResult(verification_documents_schema_1.verificationDocumentResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(verification_documents_schema_1.verificationDocumentQueryValidator), schema_1.hooks.resolveQuery(verification_documents_schema_1.verificationDocumentQueryResolver)],
            find: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('admin', 'landlord'),
                async (ctx) => {
                    // Landlords should only see property_manager documents
                    const roles = Array.isArray(ctx.params.user?.roles) ? ctx.params.user.roles : [];
                    if (!roles.includes('landlord') || roles.includes('admin'))
                        return ctx;
                    const requests = (await ctx.app.service('role-requests').find({ paginate: false, query: { role: 'property_manager' } }, { provider: undefined }));
                    const ids = (requests || []).map((r) => r._id?.toString()).filter(Boolean);
                    (0, merge_query_1.mergeQuery)(ctx, { roleRequestId: { $in: ids } });
                    return ctx;
                }
            ],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin', 'landlord')],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                schema_1.hooks.validateData(verification_documents_schema_1.verificationDocumentDataValidator),
                schema_1.hooks.resolveData(verification_documents_schema_1.verificationDocumentDataResolver)
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('admin'),
                schema_1.hooks.validateData(verification_documents_schema_1.verificationDocumentPatchValidator),
                schema_1.hooks.resolveData(verification_documents_schema_1.verificationDocumentPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        }
    });
};
exports.verificationDocuments = verificationDocuments;
//# sourceMappingURL=verification-documents.js.map