"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminBootstrap = exports.AdminBootstrapService = exports.adminBootstrapPath = void 0;
const errors_1 = require("@feathersjs/errors");
exports.adminBootstrapPath = 'admin-bootstrap';
/**
 * One-off / dev bootstrap for admin accounts. Gated by `ADMIN_BOOTSTRAP_SECRET` (min 16 chars).
 * Not authenticated — protect with a strong secret and disable in production if you prefer DB-only ops.
 */
class AdminBootstrapService {
    async create(data, params) {
        const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
        if (!expected || String(expected).length < 16) {
            throw new errors_1.errors.Forbidden('ADMIN_BOOTSTRAP_SECRET is not set or too short (min 16 characters). Set it in the API environment to enable this endpoint.');
        }
        if (String(data?.secret ?? '') !== String(expected)) {
            throw new errors_1.errors.Forbidden('Invalid bootstrap secret.');
        }
        const app = params.app;
        const email = String(data?.email ?? '')
            .trim()
            .toLowerCase();
        if (!email)
            throw new errors_1.errors.BadRequest('email is required');
        const mode = String(data?.mode ?? '').toLowerCase();
        if (mode !== 'create' && mode !== 'promote') {
            throw new errors_1.errors.BadRequest('mode must be "create" or "promote".');
        }
        const hasAdminRole = async (userId) => {
            const res = (await app.service('user-roles').find({ paginate: false, query: { userId, role: 'admin' } }, { provider: undefined }));
            const list = Array.isArray(res) ? res : res?.data || [];
            return list.length > 0;
        };
        const grantAdmin = async (userId) => {
            if (await hasAdminRole(userId)) {
                return { ok: true, userId, email, mode, message: 'User already has admin role.' };
            }
            await app.service('user-roles').create({ userId, role: 'admin' }, { provider: undefined });
            return { ok: true, userId, email, mode, message: 'Admin role granted.' };
        };
        if (mode === 'promote') {
            const usersRes = (await app.service('users').find({ paginate: false, query: { email } }, { provider: undefined }));
            const ulist = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];
            const u = ulist[0];
            if (!u)
                throw new errors_1.errors.NotFound('No user with that email.');
            const userId = u._id?.toString?.() ? u._id.toString() : String(u._id);
            await app.service('users').patch(userId, { isVerified: true }, { provider: undefined });
            return await grantAdmin(userId);
        }
        // mode === 'create'
        const password = String(data?.password ?? '');
        const fullName = String(data?.fullName ?? '').trim();
        if (!fullName)
            throw new errors_1.errors.BadRequest('fullName is required for mode "create".');
        if (password.length < 8)
            throw new errors_1.errors.BadRequest('password must be at least 8 characters.');
        const existing = (await app.service('users').find({ paginate: false, query: { email } }, { provider: undefined }));
        const elist = Array.isArray(existing) ? existing : existing?.data || [];
        if (elist.length > 0) {
            throw new errors_1.errors.BadRequest('A user with this email already exists. Use mode "promote" with the same email to grant admin.');
        }
        const created = (await app.service('users').create({
            email,
            password,
            fullName,
            ...(typeof data?.phone === 'string' && data.phone.trim() ? { phone: data.phone.trim() } : {})
        }, { provider: undefined }));
        const userId = created._id?.toString?.() ? created._id.toString() : String(created._id);
        await app.service('users').patch(userId, { isVerified: true }, { provider: undefined });
        if (!(await hasAdminRole(userId))) {
            await app.service('user-roles').create({ userId, role: 'admin' }, { provider: undefined });
        }
        return {
            ok: true,
            userId,
            email,
            mode,
            message: 'Admin user ready: default tenant role (from signup hooks) plus admin. Sign in with email and password.',
            roles: ['tenant', 'admin']
        };
    }
}
exports.AdminBootstrapService = AdminBootstrapService;
const adminBootstrap = (app) => {
    app.use(exports.adminBootstrapPath, new AdminBootstrapService(), { methods: ['create'], events: [] });
    app.service(exports.adminBootstrapPath).hooks({
        before: {
            create: [
                async (context) => {
                    ;
                    context.params.app = context.app;
                    return context;
                }
            ]
        }
    });
};
exports.adminBootstrap = adminBootstrap;
//# sourceMappingURL=admin-bootstrap.js.map