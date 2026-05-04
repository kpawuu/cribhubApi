"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.DeleteAccountService = exports.deleteAccountPath = void 0;
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const bcryptjs_1 = require("bcryptjs");
exports.deleteAccountPath = 'delete-account';
class DeleteAccountService {
    async create(data, params) {
        const user = params.user;
        if (!user?._id)
            throw new errors_1.errors.NotAuthenticated();
        const password = data?.password;
        if (!password)
            throw new errors_1.errors.BadRequest('password is required');
        // Load full user record with password (internal)
        const fullUser = await params.app.service('users').get(user._id, { provider: undefined });
        const hashed = fullUser.password;
        if (!hashed)
            throw new errors_1.errors.BadRequest('No password set for user');
        const ok = await (0, bcryptjs_1.compare)(password, hashed);
        if (!ok)
            throw new errors_1.errors.Forbidden('Invalid password');
        const userId = user._id.toString();
        // Cascade delete across collections (best-effort, internal)
        const removeMany = async (service, query) => {
            try {
                await params.app.service(service).remove(null, { query, paginate: false, provider: undefined });
            }
            catch {
                // ignore
            }
        };
        await removeMany('refresh-tokens', { userId });
        await removeMany('user-roles', { userId });
        // Delete verification documents only for the user's role requests.
        // (Previous implementation used `{}` which deletes the entire `verification_documents` collection.)
        const roleRequests = (await params.app.service('role-requests').find({ paginate: false, query: { userId } }, { provider: undefined }));
        const roleRequestIds = (roleRequests || []).map((r) => r._id?.toString?.() || r._id).filter(Boolean);
        await removeMany('verification-documents', { roleRequestId: { $in: roleRequestIds } });
        await removeMany('role-requests', { userId });
        await removeMany('payments', { tenantId: userId });
        await removeMany('payments', { landlordId: userId });
        await removeMany('maintenance-requests', { tenantId: userId });
        await removeMany('communications', { landlordId: userId });
        await removeMany('notices', { landlordId: userId });
        await removeMany('exchange-rates', { landlordId: userId });
        await removeMany('legal-documents', { userId });
        await removeMany('rental-contracts', { tenantId: userId });
        await removeMany('rental-contracts', { landlordId: userId });
        await removeMany('rental-applications', { applicantId: userId });
        // Properties/units owned
        await removeMany('properties', { landlordId: userId });
        // Finally remove the user itself
        await params.app.service('users').remove(user._id, { provider: undefined });
        return { status: 'deleted' };
    }
}
exports.DeleteAccountService = DeleteAccountService;
const deleteAccount = (app) => {
    app.use(exports.deleteAccountPath, new DeleteAccountService(), { methods: ['create'], events: [] });
    app.service(exports.deleteAccountPath).hooks({
        before: {
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                async (context) => {
                    ;
                    context.params.app = context.app;
                    return context;
                }
            ]
        }
    });
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=delete-account.js.map