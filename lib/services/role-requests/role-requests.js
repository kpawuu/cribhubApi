"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRequests = exports.roleRequestsMethods = exports.roleRequestsPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
const populate_roles_1 = require("../../hooks/populate-roles");
const create_user_notification_1 = require("../../utils/create-user-notification");
const role_requests_class_1 = require("./role-requests.class");
const role_requests_schema_1 = require("./role-requests.schema");
exports.roleRequestsPath = 'role-requests';
exports.roleRequestsMethods = ['find', 'get', 'create', 'patch', 'remove'];
// ── Helpers ──────────────────────────────────────────────────────────────────
/** Fetch the IDs of all users with the admin role. */
async function getAdminUserIds(app) {
    try {
        const rows = await app.service('user-roles').find({
            paginate: false,
            query: { role: 'admin' }
        }, { provider: undefined });
        return (rows || []).map((r) => r.userId?.toString()).filter(Boolean);
    }
    catch {
        return [];
    }
}
const ROLE_LABEL = {
    landlord: 'Landlord',
    property_manager: 'Property Manager',
    agent: 'Agent'
};
// ── Hooks ─────────────────────────────────────────────────────────────────────
/**
 * find/get: admin sees all; authenticated users see only their own requests.
 */
const restrictFindToSelfOrAdmin = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context; // admin sees everything
    // Non-admin: restrict to own requests
    const userId = user._id.toString();
    context.params.query = { ...(context.params.query || {}), userId };
    return context;
};
/**
 * create: only allow the authenticated user to create a request for themselves.
 */
const restrictCreateToSelf = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    if (context.data.userId !== user._id.toString()) {
        throw new errors_1.errors.Forbidden('Cannot create role request for another user.');
    }
    return context;
};
/**
 * Prevent duplicate pending requests for the same role from the same user.
 */
const preventDuplicateRequest = async (context) => {
    if (!context.params.provider)
        return context;
    const { userId, role } = context.data;
    const existing = await context.app.service('role-requests').find({
        paginate: false,
        query: { userId, role, status: 'pending' }
    }, { provider: undefined });
    if (existing?.length > 0) {
        throw new errors_1.errors.Conflict(`You already have a pending ${ROLE_LABEL[role] || role} request.`);
    }
    return context;
};
/**
 * after.create: grant role, notify user, and notify admins.
 */
const afterRoleRequestCreated = async (context) => {
    const rr = context.result;
    if (!rr)
        return context;
    const userName = context.params.user?.fullName || context.params.user?.email || 'A user';
    const roleLabel = ROLE_LABEL[rr.role] || rr.role;
    // Notify all admins about the new request
    const adminIds = await getAdminUserIds(context.app);
    await Promise.all(adminIds.map((adminId) => (0, create_user_notification_1.createUserNotification)(context.app, {
        userId: adminId,
        eventKey: 'role_request.created',
        category: 'roles',
        title: `New ${roleLabel} request`,
        body: `${userName} has requested the ${roleLabel} role and is awaiting your review.`,
        linkUrl: '/verification/role-requests',
        relatedService: 'role-requests',
        relatedId: String(rr._id)
    })));
    return context;
};
/**
 * after.patch: grant role on approval; notify the user in both cases.
 */
const afterRoleRequestPatched = async (context) => {
    const patched = context.result;
    if (!patched?.status)
        return context;
    // Grant the role when approved
    if (patched.status === 'approved') {
        await context.app.service('user-roles').create({ userId: patched.userId, role: patched.role }, { provider: undefined });
    }
    const roleLabel = ROLE_LABEL[patched.role] || patched.role;
    if (patched.status === 'approved') {
        await (0, create_user_notification_1.createUserNotification)(context.app, {
            userId: patched.userId,
            eventKey: 'role_request.approved',
            category: 'roles',
            title: `${roleLabel} role approved! 🎉`,
            body: `Your request for the ${roleLabel} role has been approved. You now have full access to ${roleLabel.toLowerCase()} features.`,
            linkUrl: '/dashboard',
            relatedService: 'role-requests',
            relatedId: String(patched._id)
        });
    }
    else if (patched.status === 'rejected') {
        await (0, create_user_notification_1.createUserNotification)(context.app, {
            userId: patched.userId,
            eventKey: 'role_request.rejected',
            category: 'roles',
            title: `${roleLabel} request not approved`,
            body: patched.notes
                ? `Your ${roleLabel} request was not approved. Admin note: "${patched.notes}"`
                : `Your request for the ${roleLabel} role was not approved. Contact support if you believe this is an error.`,
            linkUrl: '/dashboard',
            relatedService: 'role-requests',
            relatedId: String(patched._id)
        });
    }
    return context;
};
// ── Service registration ──────────────────────────────────────────────────────
const roleRequests = (app) => {
    app.use(exports.roleRequestsPath, new role_requests_class_1.RoleRequestsService((0, role_requests_class_1.getOptions)(app)), {
        methods: exports.roleRequestsMethods,
        events: []
    });
    app.service(exports.roleRequestsPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(role_requests_schema_1.roleRequestExternalResolver), schema_1.hooks.resolveResult(role_requests_schema_1.roleRequestResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(role_requests_schema_1.roleRequestQueryValidator), schema_1.hooks.resolveQuery(role_requests_schema_1.roleRequestQueryResolver)],
            // Users can see their own requests; admins see all
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictFindToSelfOrAdmin],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles, restrictFindToSelfOrAdmin],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                restrictCreateToSelf,
                preventDuplicateRequest,
                schema_1.hooks.validateData(role_requests_schema_1.roleRequestDataValidator),
                schema_1.hooks.resolveData(role_requests_schema_1.roleRequestDataResolver)
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                (0, require_role_1.requireRole)('admin'),
                schema_1.hooks.validateData(role_requests_schema_1.roleRequestPatchValidator),
                schema_1.hooks.resolveData(role_requests_schema_1.roleRequestPatchResolver),
                async (ctx) => {
                    const u = ctx.params.user;
                    ctx.data.reviewedBy = u?._id?.toString();
                }
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin')]
        },
        after: {
            create: [afterRoleRequestCreated],
            patch: [afterRoleRequestPatched]
        }
    });
};
exports.roleRequests = roleRequests;
//# sourceMappingURL=role-requests.js.map