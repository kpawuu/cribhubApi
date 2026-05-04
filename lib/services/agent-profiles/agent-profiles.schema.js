"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentProfileQueryResolver = exports.agentProfileQueryValidator = exports.agentProfileQuerySchema = exports.agentProfileQueryProperties = exports.agentProfilePatchResolver = exports.agentProfilePatchValidator = exports.agentProfilePatchSchema = exports.agentProfileDataResolver = exports.agentProfileDataValidator = exports.agentProfileDataSchema = exports.agentProfileExternalResolver = exports.agentProfileResolver = exports.agentProfileValidator = exports.agentProfileSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
const resolveEntityFiles_1 = require("../../utils/resolveEntityFiles");
exports.agentProfileSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    userId: typebox_1.Type.String(),
    displayName: typebox_1.Type.String(),
    agency: typebox_1.Type.Optional(typebox_1.Type.String()),
    phone: typebox_1.Type.Optional(typebox_1.Type.String()),
    whatsapp: typebox_1.Type.Optional(typebox_1.Type.String()),
    emailPublic: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'email' })),
    bio: typebox_1.Type.Optional(typebox_1.Type.String()),
    regions: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    languages: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    avatarUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    listingsCount: typebox_1.Type.Optional(typebox_1.Type.Number()),
    responseTimeMinutes: typebox_1.Type.Optional(typebox_1.Type.Number()),
    verified: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    // Denormalised rating summary — updated by the agent-ratings service after-hooks.
    ratingAvg: typebox_1.Type.Optional(typebox_1.Type.Number()),
    ratingCount: typebox_1.Type.Optional(typebox_1.Type.Number()),
    // attachments (license, IDs, certificates, etc.)
    files: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Any())),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'AgentProfile', additionalProperties: false });
exports.agentProfileValidator = (0, typebox_1.getValidator)(exports.agentProfileSchema, validators_1.dataValidator);
exports.agentProfileResolver = (0, schema_1.resolve)({});
exports.agentProfileExternalResolver = (0, schema_1.resolve)({
    files: async (_value, profile, context) => {
        const id = profile?._id?.toString?.() ?? '';
        if (!id)
            return [];
        return await (0, resolveEntityFiles_1.resolveEntityFiles)(context.app, 'agent-profiles', id);
    }
});
exports.agentProfileDataSchema = typebox_1.Type.Object({
    displayName: typebox_1.Type.String(),
    agency: typebox_1.Type.Optional(typebox_1.Type.String()),
    phone: typebox_1.Type.Optional(typebox_1.Type.String()),
    whatsapp: typebox_1.Type.Optional(typebox_1.Type.String()),
    emailPublic: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'email' })),
    bio: typebox_1.Type.Optional(typebox_1.Type.String()),
    regions: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    languages: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    avatarUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    listingsCount: typebox_1.Type.Optional(typebox_1.Type.Number()),
    responseTimeMinutes: typebox_1.Type.Optional(typebox_1.Type.Number())
}, { $id: 'AgentProfileData', additionalProperties: false });
exports.agentProfileDataValidator = (0, typebox_1.getValidator)(exports.agentProfileDataSchema, validators_1.dataValidator);
exports.agentProfileDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString(),
    verified: async () => false
});
exports.agentProfilePatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.agentProfileSchema, ['_id', 'userId', 'createdAt']), {
    $id: 'AgentProfilePatch'
});
exports.agentProfilePatchValidator = (0, typebox_1.getValidator)(exports.agentProfilePatchSchema, validators_1.dataValidator);
exports.agentProfilePatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.agentProfileQueryProperties = typebox_1.Type.Pick(exports.agentProfileSchema, [
    '_id',
    'userId',
    'agency',
    'verified',
    'createdAt',
    'updatedAt'
]);
exports.agentProfileQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.agentProfileQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.agentProfileQueryValidator = (0, typebox_1.getValidator)(exports.agentProfileQuerySchema, validators_1.queryValidator);
exports.agentProfileQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=agent-profiles.schema.js.map