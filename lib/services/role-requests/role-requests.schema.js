"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRequestQueryResolver = exports.roleRequestQueryValidator = exports.roleRequestQuerySchema = exports.roleRequestPatchResolver = exports.roleRequestPatchValidator = exports.roleRequestPatchSchema = exports.roleRequestDataResolver = exports.roleRequestDataValidator = exports.roleRequestDataSchema = exports.roleRequestExternalResolver = exports.roleRequestResolver = exports.roleRequestValidator = exports.roleRequestSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.roleRequestSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    userId: typebox_1.Type.String(),
    role: typebox_1.Type.Union([typebox_1.Type.Literal('landlord'), typebox_1.Type.Literal('property_manager'), typebox_1.Type.Literal('agent')]),
    status: typebox_1.Type.Union([typebox_1.Type.Literal('pending'), typebox_1.Type.Literal('approved'), typebox_1.Type.Literal('rejected')]),
    /** Optional message / pitch from the applicant */
    message: typebox_1.Type.Optional(typebox_1.Type.String()),
    notes: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    reviewedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    /** Virtual: basic applicant info (loaded via ?include=applicant). */
    applicant: typebox_1.Type.Optional(typebox_1.Type.Any()),
    /** Virtual: role-specific profile (loaded via ?include=profile). */
    profile: typebox_1.Type.Optional(typebox_1.Type.Any()),
    /** Virtual: verification documents tied to the applicant (loaded via ?include=documents). */
    documents: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Any()))
}, { $id: 'RoleRequest', additionalProperties: false });
exports.roleRequestValidator = (0, typebox_1.getValidator)(exports.roleRequestSchema, validators_1.dataValidator);
exports.roleRequestResolver = (0, schema_1.resolve)({});
async function shouldInclude(context, key) {
    // Prefer the stripped/stashed location written by `stripQueryInclude`.
    // Fall back to query.$include for internal callers that bypass that hook.
    const inc = context.params?.$include ?? context.params?.query?.$include;
    if (!inc)
        return false;
    if (typeof inc === 'string')
        return inc.split(',').map((s) => s.trim()).includes(key);
    if (Array.isArray(inc))
        return inc.includes(key);
    return false;
}
exports.roleRequestExternalResolver = (0, schema_1.resolve)({
    applicant: (0, schema_1.virtual)(async (row, context) => {
        if (!(await shouldInclude(context, 'applicant')))
            return undefined;
        const uid = String(row.userId || '');
        if (!uid)
            return undefined;
        try {
            const u = (await context.app.service('users').get(uid, { provider: undefined }));
            return {
                _id: String(u._id),
                email: u.email,
                fullName: u.fullName,
                phone: u.phone,
                avatarUrl: u.avatarUrl,
                country: u.country,
                createdAt: u.createdAt,
                onboarding: u.onboarding || null
            };
        }
        catch {
            return null;
        }
    }),
    profile: (0, schema_1.virtual)(async (row, context) => {
        if (!(await shouldInclude(context, 'profile')))
            return undefined;
        const uid = String(row.userId || '');
        const role = row.role;
        if (!uid || !role)
            return undefined;
        try {
            const path = role === 'agent' ? 'agent-profiles' :
                role === 'property_manager' ? 'property-manager-profiles' :
                    null;
            if (!path)
                return null;
            const res = (await context.app.service(path).find({
                query: { userId: uid, $limit: 1 },
                paginate: false,
                provider: undefined
            }));
            const arr = Array.isArray(res) ? res : res?.data || [];
            return arr[0] || null;
        }
        catch {
            return null;
        }
    }),
    documents: (0, schema_1.virtual)(async (row, context) => {
        if (!(await shouldInclude(context, 'documents')))
            return undefined;
        const uid = String(row.userId || '');
        if (!uid)
            return [];
        try {
            const res = (await context.app.service('verification-documents').find({
                query: { userId: uid, $limit: 50, $sort: { createdAt: -1 } },
                paginate: false,
                provider: undefined
            }));
            return Array.isArray(res) ? res : res?.data || [];
        }
        catch {
            return [];
        }
    })
});
exports.roleRequestDataSchema = typebox_1.Type.Object({
    userId: typebox_1.Type.String(),
    role: typebox_1.Type.Union([typebox_1.Type.Literal('landlord'), typebox_1.Type.Literal('property_manager'), typebox_1.Type.Literal('agent')]),
    status: typebox_1.Type.Optional(typebox_1.Type.Literal('pending')),
    /** Optional message the applicant wants to include with their request */
    message: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 2000 }))
}, { $id: 'RoleRequestData', additionalProperties: false });
exports.roleRequestDataValidator = (0, typebox_1.getValidator)(exports.roleRequestDataSchema, validators_1.dataValidator);
exports.roleRequestDataResolver = (0, schema_1.resolve)({
    status: async () => 'pending',
    createdAt: async () => new Date().toISOString()
});
exports.roleRequestPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.roleRequestSchema, ['_id', 'userId', 'role', 'createdAt']), {
    $id: 'RoleRequestPatch'
});
exports.roleRequestPatchValidator = (0, typebox_1.getValidator)(exports.roleRequestPatchSchema, validators_1.dataValidator);
exports.roleRequestPatchResolver = (0, schema_1.resolve)({
    reviewedAt: async (_v, _r, context) => context.data?.status ? new Date().toISOString() : undefined
});
exports.roleRequestQuerySchema = typebox_1.Type.Object({}, { $id: 'RoleRequestQuery', additionalProperties: true });
exports.roleRequestQueryValidator = (0, typebox_1.getValidator)(exports.roleRequestQuerySchema, validators_1.queryValidator);
exports.roleRequestQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=role-requests.schema.js.map