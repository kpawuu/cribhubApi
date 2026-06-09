"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentRatingQueryResolver = exports.agentRatingQueryValidator = exports.agentRatingQuerySchema = exports.agentRatingQueryProperties = exports.agentRatingPatchResolver = exports.agentRatingPatchValidator = exports.agentRatingPatchSchema = exports.agentRatingDataResolver = exports.agentRatingDataValidator = exports.agentRatingDataSchema = exports.agentRatingExternalResolver = exports.agentRatingResolver = exports.agentRatingValidator = exports.agentRatingSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// ──────────────────────────────────────────────
// Entity
// ──────────────────────────────────────────────
exports.agentRatingSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    agentProfileId: typebox_1.Type.String(),
    userId: typebox_1.Type.String(),
    rating: typebox_1.Type.Number({ minimum: 1, maximum: 5 }),
    comment: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 1000 })),
    reviewerName: typebox_1.Type.Optional(typebox_1.Type.String()),
    /** Admin moderation: when true, review is hidden from public listings (only admin/owner sees it). */
    hidden: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    hiddenAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    hiddenBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    moderationNote: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 1000 })),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'AgentRating', additionalProperties: false });
exports.agentRatingValidator = (0, typebox_1.getValidator)(exports.agentRatingSchema, validators_1.dataValidator);
exports.agentRatingResolver = (0, schema_1.resolve)({});
exports.agentRatingExternalResolver = (0, schema_1.resolve)({});
// ──────────────────────────────────────────────
// Create data
// ──────────────────────────────────────────────
exports.agentRatingDataSchema = typebox_1.Type.Object({
    agentProfileId: typebox_1.Type.String(),
    rating: typebox_1.Type.Number({ minimum: 1, maximum: 5 }),
    comment: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 1000 })),
    reviewerName: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'AgentRatingData', additionalProperties: false });
exports.agentRatingDataValidator = (0, typebox_1.getValidator)(exports.agentRatingDataSchema, validators_1.dataValidator);
exports.agentRatingDataResolver = (0, schema_1.resolve)({
    // userId and reviewerName are set here (after validateData) so they do not
    // trigger additionalProperties validation failure on agentRatingDataSchema.
    userId: async (_value, _record, context) => {
        const user = context.params?.user;
        return user?._id?.toString() ?? '';
    },
    reviewerName: async (value, _record, context) => {
        if (value)
            return value;
        const user = context.params?.user;
        return (user?.fullName ||
            user?.displayName ||
            user?.name ||
            user?.email ||
            'Anonymous');
    },
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString(),
});
// ──────────────────────────────────────────────
// Patch data
// ──────────────────────────────────────────────
exports.agentRatingPatchSchema = typebox_1.Type.Object({
    rating: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1, maximum: 5 })),
    comment: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 1000 })),
    /** Admin-only: toggle moderation visibility. */
    hidden: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    /** Admin-only: timestamped when admin toggles `hidden`. */
    hiddenAt: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String({ format: 'date-time' }), typebox_1.Type.Null()])),
    /** Admin-only: stamped to the moderator user id. */
    hiddenBy: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    moderationNote: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 1000 }))
}, { $id: 'AgentRatingPatch', additionalProperties: false });
exports.agentRatingPatchValidator = (0, typebox_1.getValidator)(exports.agentRatingPatchSchema, validators_1.dataValidator);
exports.agentRatingPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
// ──────────────────────────────────────────────
// Query
// ──────────────────────────────────────────────
exports.agentRatingQueryProperties = typebox_1.Type.Pick(exports.agentRatingSchema, [
    '_id',
    'agentProfileId',
    'userId',
    'rating',
    'hidden',
    'createdAt'
]);
exports.agentRatingQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.agentRatingQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.agentRatingQueryValidator = (0, typebox_1.getValidator)(exports.agentRatingQuerySchema, validators_1.queryValidator);
exports.agentRatingQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=agent-ratings.schema.js.map