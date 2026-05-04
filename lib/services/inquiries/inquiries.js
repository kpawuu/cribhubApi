"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiries = exports.inquiriesMethods = exports.inquiriesPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const inquiries_class_1 = require("./inquiries.class");
const inquiries_schema_1 = require("./inquiries.schema");
const notify_inquiry_created_1 = require("../../utils/notify-inquiry-created");
exports.inquiriesPath = 'inquiries';
exports.inquiriesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const attachRouting = async (context) => {
    const data = context.data || {};
    const propertyId = data.propertyId;
    if (!propertyId)
        throw new errors_1.errors.BadRequest('propertyId is required');
    const property = await context.app.service('properties').get(propertyId, { provider: undefined });
    context.data.landlordId = property.landlordId;
    // If property has an assigned agent, route to them
    const assignments = (await context.app.service('agent-assignments').find({ paginate: false, query: { propertyId } }, { provider: undefined }));
    const list = Array.isArray(assignments) ? assignments : assignments?.data || [];
    const assigned = list[0];
    if (assigned?.agentUserId) {
        ;
        context.data.agentUserId = assigned.agentUserId;
    }
    const u = context.params.user;
    if (u?._id) {
        ;
        context.data.createdByUserId = u._id.toString();
    }
    return context;
};
const restrictFind = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    // agents see their routed inquiries
    if (roles.includes('agent')) {
        (0, merge_query_1.mergeQuery)(context, { agentUserId: user._id.toString() });
        return context;
    }
    // landlords / property managers see inquiries for their portfolio (same landlordId scope as properties)
    if (roles.includes('landlord') || roles.includes('property_manager')) {
        (0, merge_query_1.mergeQuery)(context, { landlordId: user._id.toString() });
        return context;
    }
    // tenants can see what they created (if authenticated)
    (0, merge_query_1.mergeQuery)(context, { createdByUserId: user._id.toString() });
    return context;
};
const inquiries = (app) => {
    app.use(exports.inquiriesPath, new inquiries_class_1.InquiriesService((0, inquiries_class_1.getOptions)(app)), {
        methods: exports.inquiriesMethods,
        events: []
    });
    app.service(exports.inquiriesPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(inquiries_schema_1.inquiryExternalResolver), schema_1.hooks.resolveResult(inquiries_schema_1.inquiryResolver)]
        },
        after: {
            create: [
                async (context) => {
                    if (context.result)
                        await (0, notify_inquiry_created_1.notifyInquiryCreated)(context.app, context.result);
                    return context;
                }
            ]
        },
        before: {
            all: [schema_1.hooks.validateQuery(inquiries_schema_1.inquiryQueryValidator), schema_1.hooks.resolveQuery(inquiries_schema_1.inquiryQueryResolver)],
            // Leads are public-ish: allow unauthenticated create (from marketing/details page)
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictFind],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles],
            create: [schema_1.hooks.validateData(inquiries_schema_1.inquiryDataValidator), schema_1.hooks.resolveData(inquiries_schema_1.inquiryDataResolver), attachRouting],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                (0, require_role_1.requireRole)('agent', 'landlord', 'property_manager', 'admin'),
                schema_1.hooks.validateData(inquiries_schema_1.inquiryPatchValidator),
                schema_1.hooks.resolveData(inquiries_schema_1.inquiryPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        }
    });
};
exports.inquiries = inquiries;
//# sourceMappingURL=inquiries.js.map