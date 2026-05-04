"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legalDocuments = exports.legalDocumentsMethods = exports.legalDocumentsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const legal_documents_class_1 = require("./legal-documents.class");
const legal_documents_schema_1 = require("./legal-documents.schema");
exports.legalDocumentsPath = 'legal-documents';
exports.legalDocumentsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const attachUser = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    context.data.userId = user._id.toString();
    return context;
};
const legalDocuments = (app) => {
    app.use(exports.legalDocumentsPath, new legal_documents_class_1.LegalDocumentsService((0, legal_documents_class_1.getOptions)(app)), {
        methods: exports.legalDocumentsMethods,
        events: []
    });
    app.service(exports.legalDocumentsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(legal_documents_schema_1.legalDocumentExternalResolver), schema_1.hooks.resolveResult(legal_documents_schema_1.legalDocumentResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(legal_documents_schema_1.legalDocumentQueryValidator), schema_1.hooks.resolveQuery(legal_documents_schema_1.legalDocumentQueryResolver)],
            find: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                async (ctx) => {
                    const u = ctx.params.user;
                    (0, merge_query_1.mergeQuery)(ctx, { userId: u._id.toString() });
                }
            ],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                schema_1.hooks.validateData(legal_documents_schema_1.legalDocumentDataValidator),
                schema_1.hooks.resolveData(legal_documents_schema_1.legalDocumentDataResolver),
                attachUser
            ],
            patch: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), schema_1.hooks.validateData(legal_documents_schema_1.legalDocumentPatchValidator), schema_1.hooks.resolveData(legal_documents_schema_1.legalDocumentPatchResolver)],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')]
        }
    });
};
exports.legalDocuments = legalDocuments;
//# sourceMappingURL=legal-documents.js.map