"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.files = exports.filesMethods = exports.filesPath = void 0;
const schema_1 = require("@feathersjs/schema");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const files_class_1 = require("./files.class");
const files_schema_1 = require("./files.schema");
exports.filesPath = 'files';
exports.filesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const files = (app) => {
    app.use(exports.filesPath, new files_class_1.FilesService((0, files_class_1.getOptions)(app)), {
        methods: exports.filesMethods,
        events: []
    });
    app.service(exports.filesPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(files_schema_1.filesExternalResolver), schema_1.hooks.resolveResult(files_schema_1.filesResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(files_schema_1.filesQueryValidator), schema_1.hooks.resolveQuery(files_schema_1.filesQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            create: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), schema_1.hooks.validateData(files_schema_1.filesDataValidator), schema_1.hooks.resolveData(files_schema_1.filesDataResolver)],
            patch: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), schema_1.hooks.validateData(files_schema_1.filesPatchValidator), schema_1.hooks.resolveData(files_schema_1.filesPatchResolver)],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')]
        }
    });
};
exports.files = files;
//# sourceMappingURL=files.js.map