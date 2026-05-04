"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyManagerAssignments = exports.propertyManagerAssignmentsMethods = exports.propertyManagerAssignmentsPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const populate_roles_1 = require("../../hooks/populate-roles");
const require_role_1 = require("../../hooks/require-role");
const property_manager_assignments_class_1 = require("./property-manager-assignments.class");
const property_manager_assignments_schema_1 = require("./property-manager-assignments.schema");
exports.propertyManagerAssignmentsPath = 'property-manager-assignments';
exports.propertyManagerAssignmentsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const listFromFind = (res) => (Array.isArray(res) ? res : res?.data || []);
const userHasPmRole = async (app, userId) => {
    const res = (await app.service('user-roles').find({ paginate: false, query: { userId, role: 'property_manager' } }, { provider: undefined }));
    return listFromFind(res).length > 0;
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
    if (roles.includes('property_manager')) {
        (0, merge_query_1.mergeQuery)(context, { managerUserId: user._id.toString() });
        return context;
    }
    if (roles.includes('landlord')) {
        (0, merge_query_1.mergeQuery)(context, { landlordId: user._id.toString() });
        return context;
    }
    throw new errors_1.errors.Forbidden('You are not allowed to list property manager assignments.');
};
const ensureLandlordOrAdminCreates = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    if (!roles.includes('landlord'))
        throw new errors_1.errors.Forbidden('Only landlords or admins can assign property managers.');
    const propertyId = String(context.data?.propertyId || '');
    const prop = await context.app.service('properties').get(propertyId, { provider: undefined });
    if (String(prop.landlordId) !== String(user._id)) {
        throw new errors_1.errors.Forbidden('You can only assign managers to your own properties.');
    }
    return context;
};
const ensureManagerIsApprovedPm = async (context) => {
    const mid = String(context.data?.managerUserId || '').trim();
    if (!mid)
        throw new errors_1.errors.BadRequest('managerUserId is required');
    if (!(await userHasPmRole(context.app, mid))) {
        throw new errors_1.errors.BadRequest('That user is not an approved property manager (admin must approve their role first).');
    }
    return context;
};
const preventDuplicateAssignment = async (context) => {
    if (context.method !== 'create')
        return context;
    const d = context.data;
    const db = await context.app.get('mongodbClient');
    const dup = await db.collection('property_manager_assignments').findOne({
        propertyId: String(d.propertyId),
        managerUserId: String(d.managerUserId)
    });
    if (dup)
        throw new errors_1.errors.BadRequest('This property manager is already assigned to that property.');
    return context;
};
const loadRow = async (app, id) => {
    const db = await app.get('mongodbClient');
    return db.collection('property_manager_assignments').findOne({ _id: id });
};
const assertGetOrRemove = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    const row = await loadRow(context.app, String(context.id || ''));
    if (!row)
        throw new errors_1.errors.NotFound();
    const uid = user._id.toString();
    if (roles.includes('landlord') && String(row.landlordId) === uid)
        return context;
    if (roles.includes('property_manager') && String(row.managerUserId) === uid)
        return context;
    throw new errors_1.errors.Forbidden();
};
const propertyManagerAssignments = (app) => {
    app.use(exports.propertyManagerAssignmentsPath, new property_manager_assignments_class_1.PropertyManagerAssignmentsService((0, property_manager_assignments_class_1.getOptions)(app)), {
        methods: exports.propertyManagerAssignmentsMethods,
        events: []
    });
    app.service(exports.propertyManagerAssignmentsPath).hooks({
        around: {
            all: [
                schema_1.hooks.resolveExternal(property_manager_assignments_schema_1.propertyManagerAssignmentExternalResolver),
                schema_1.hooks.resolveResult(property_manager_assignments_schema_1.propertyManagerAssignmentResolver)
            ]
        },
        before: {
            all: [schema_1.hooks.validateQuery(property_manager_assignments_schema_1.propertyManagerAssignmentQueryValidator), schema_1.hooks.resolveQuery(property_manager_assignments_schema_1.propertyManagerAssignmentQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictFind],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, assertGetOrRemove],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                (0, require_role_1.requireRole)('landlord', 'admin'),
                ensureLandlordOrAdminCreates,
                schema_1.hooks.validateData(property_manager_assignments_schema_1.propertyManagerAssignmentDataValidator),
                schema_1.hooks.resolveData(property_manager_assignments_schema_1.propertyManagerAssignmentDataResolver),
                ensureManagerIsApprovedPm,
                preventDuplicateAssignment
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                (0, require_role_1.requireRole)('admin'),
                schema_1.hooks.validateData(property_manager_assignments_schema_1.propertyManagerAssignmentPatchValidator),
                schema_1.hooks.resolveData(property_manager_assignments_schema_1.propertyManagerAssignmentPatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, assertGetOrRemove, (0, require_role_1.requireRole)('landlord', 'admin', 'property_manager')]
        }
    });
};
exports.propertyManagerAssignments = propertyManagerAssignments;
//# sourceMappingURL=property-manager-assignments.js.map