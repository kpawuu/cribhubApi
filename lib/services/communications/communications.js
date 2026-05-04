"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communications = exports.communicationsMethods = exports.communicationsPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const restrict_query_to_owner_1 = require("../../hooks/restrict-query-to-owner");
const communications_class_1 = require("./communications.class");
const communications_schema_1 = require("./communications.schema");
exports.communicationsPath = 'communications';
exports.communicationsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const attachLandlordId = async (context) => {
    const user = context.params.user;
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const data = context.data;
    if (roles.includes('admin')) {
        const lid = data.landlordId != null ? String(data.landlordId).trim() : '';
        data.landlordId = lid || user?._id?.toString();
        return context;
    }
    if (roles.includes('property_manager')) {
        const lid = data.landlordId != null ? String(data.landlordId).trim() : '';
        if (!lid)
            throw new errors_1.errors.BadRequest('landlordId is required');
        data.landlordId = lid;
        return context;
    }
    data.landlordId = user?._id?.toString();
    return context;
};
const communications = (app) => {
    app.use(exports.communicationsPath, new communications_class_1.CommunicationsService((0, communications_class_1.getOptions)(app)), {
        methods: exports.communicationsMethods,
        events: []
    });
    app.service(exports.communicationsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(communications_schema_1.communicationExternalResolver), schema_1.hooks.resolveResult(communications_schema_1.communicationResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(communications_schema_1.communicationQueryValidator), schema_1.hooks.resolveQuery(communications_schema_1.communicationQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, restrict_query_to_owner_1.restrictQueryToOwner)('landlordId', ['admin', 'property_manager'])],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt')],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager'),
                schema_1.hooks.validateData(communications_schema_1.communicationDataValidator),
                schema_1.hooks.resolveData(communications_schema_1.communicationDataResolver),
                attachLandlordId
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager'),
                schema_1.hooks.validateData(communications_schema_1.communicationPatchValidator),
                schema_1.hooks.resolveData(communications_schema_1.communicationPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        }
    });
};
exports.communications = communications;
//# sourceMappingURL=communications.js.map