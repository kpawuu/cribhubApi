"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.virtualViewingRequests = exports.virtualViewingRequestsMethods = exports.virtualViewingRequestsPath = void 0;
const schema_1 = require("@feathersjs/schema");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const virtual_viewing_requests_class_1 = require("./virtual-viewing-requests.class");
const virtual_viewing_requests_schema_1 = require("./virtual-viewing-requests.schema");
exports.virtualViewingRequestsPath = 'virtual-viewing-requests';
exports.virtualViewingRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const virtualViewingRequests = (app) => {
    app.use(exports.virtualViewingRequestsPath, new virtual_viewing_requests_class_1.VirtualViewingRequestsService((0, virtual_viewing_requests_class_1.getOptions)(app)), {
        methods: exports.virtualViewingRequestsMethods,
        events: []
    });
    app.service(exports.virtualViewingRequestsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(virtual_viewing_requests_schema_1.virtualViewingRequestExternalResolver), schema_1.hooks.resolveResult(virtual_viewing_requests_schema_1.virtualViewingRequestResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(virtual_viewing_requests_schema_1.virtualViewingRequestQueryValidator), schema_1.hooks.resolveQuery(virtual_viewing_requests_schema_1.virtualViewingRequestQueryResolver)],
            // public create supported
            create: [schema_1.hooks.validateData(virtual_viewing_requests_schema_1.virtualViewingRequestDataValidator), schema_1.hooks.resolveData(virtual_viewing_requests_schema_1.virtualViewingRequestDataResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('landlord', 'property_manager', 'admin')],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('landlord', 'property_manager', 'admin')],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'property_manager', 'admin'),
                schema_1.hooks.validateData(virtual_viewing_requests_schema_1.virtualViewingRequestPatchValidator),
                schema_1.hooks.resolveData(virtual_viewing_requests_schema_1.virtualViewingRequestPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        }
    });
};
exports.virtualViewingRequests = virtualViewingRequests;
//# sourceMappingURL=virtual-viewing-requests.js.map