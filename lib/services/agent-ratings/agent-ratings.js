"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentRatings = exports.agentRatingsMethods = exports.agentRatingsPath = void 0;
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authentication_1 = require("@feathersjs/authentication");
const mongodb_1 = require("mongodb");
const authenticate_if_jwt_present_1 = require("../../hooks/authenticate-if-jwt-present");
const populate_roles_1 = require("../../hooks/populate-roles");
const agent_ratings_class_1 = require("./agent-ratings.class");
const agent_ratings_schema_1 = require("./agent-ratings.schema");
exports.agentRatingsPath = 'agent-ratings';
exports.agentRatingsMethods = ['find', 'get', 'create', 'patch', 'remove'];
// ──────────────────────────────────────────────────────────────────
// After any write: recompute ratingAvg + ratingCount on the
// agent-profile document via direct MongoDB (bypasses schema hooks).
// ──────────────────────────────────────────────────────────────────
async function syncAgentRatingSummary(context) {
    // Determine the agentProfileId from the written/deleted record.
    const record = Array.isArray(context.result)
        ? context.result[0]
        : context.result;
    const agentProfileId = record?.agentProfileId ?? context.data?.agentProfileId ?? '';
    if (!agentProfileId)
        return context;
    try {
        // Aggregate directly via MongoDB to avoid going through service query
        // validators (which don't allow `$exists` on the boolean `hidden` field)
        // AND the agent-profiles patch validators.
        const db = await context.app.get('mongodbClient');
        const visibleFilter = {
            agentProfileId,
            $or: [{ hidden: { $exists: false } }, { hidden: false }]
        };
        const all = (await db.collection('agent_ratings').find(visibleFilter, {
            projection: { rating: 1 },
            limit: 10000
        }).toArray());
        const count = all.length;
        const avg = count > 0
            ? Number((all.reduce((s, r) => s + (Number(r.rating) || 0), 0) / count).toFixed(2))
            : 0;
        const id = agentProfileId;
        const filter = mongodb_1.ObjectId.isValid(id) && id.length === 24 ? { _id: new mongodb_1.ObjectId(id) } : { _id: id };
        await db.collection('agent_profiles').updateOne(filter, {
            $set: { ratingAvg: avg, ratingCount: count, updatedAt: new Date().toISOString() }
        });
    }
    catch (err) {
        // Non-fatal: log but don't block the response.
        console.error('[agent-ratings] syncAgentRatingSummary error:', err);
    }
    return context;
}
// ──────────────────────────────────────────────────────────────────
// Before create: attach userId + reviewerName; enforce one-per-user.
// ──────────────────────────────────────────────────────────────────
const attachUserAndEnforceUnique = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    // NOTE: do NOT touch context.data here — agentRatingDataSchema has
    // additionalProperties: false, so any extra field (e.g. userId) added
    // before validateData will fail validation.  userId is injected by the
    // resolver (agentRatingDataResolver) which runs after validation.
    const userId = user._id.toString();
    const agentProfileId = context.data.agentProfileId;
    if (!agentProfileId)
        throw new errors_1.errors.BadRequest('agentProfileId is required');
    // Reject duplicate submissions.
    const existing = await context.app.service(exports.agentRatingsPath).find({
        paginate: false,
        query: { agentProfileId, userId, $limit: 1 }
    });
    if (existing.length > 0) {
        throw new errors_1.errors.Conflict('You have already rated this agent. Update your existing review instead.', {
            existingId: existing[0]._id?.toString()
        });
    }
    return context;
};
// ──────────────────────────────────────────────────────────────────
// Before patch/remove: only the owner (or admin) may modify.
// Owners cannot toggle moderation fields.
// ──────────────────────────────────────────────────────────────────
const restrictToOwner = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const isAdmin = roles.includes('admin');
    if (!isAdmin) {
        const existing = await context.app
            .service(exports.agentRatingsPath)
            .get(context.id, { provider: undefined });
        if (existing.userId !== user._id.toString()) {
            throw new errors_1.errors.Forbidden('You can only modify your own reviews.');
        }
        // Strip moderation fields from non-admin patches.
        if (context.method === 'patch' && context.data && typeof context.data === 'object') {
            delete context.data.hidden;
            delete context.data.moderationNote;
        }
    }
    else if (context.method === 'patch' && context.data && typeof context.data === 'object') {
        const d = context.data;
        // Stamp hiddenBy/hiddenAt when an admin toggles `hidden`.
        if (d.hidden === true) {
            d.hiddenAt = new Date().toISOString();
            d.hiddenBy = user._id.toString();
        }
        else if (d.hidden === false) {
            d.hiddenAt = null;
            d.hiddenBy = null;
        }
    }
    return context;
};
// ──────────────────────────────────────────────────────────────────
// Public find: hide reviews where `hidden=true` unless admin or
// requesting your own review. Applied as an after-find filter so it
// works regardless of mongo query operator validation quirks.
// ──────────────────────────────────────────────────────────────────
const hideModeratedFromPublic = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    const uid = user?._id?.toString?.();
    const keep = (r) => {
        if (!r?.hidden)
            return true;
        if (uid && String(r.userId) === uid)
            return true;
        return false;
    };
    const result = context.result;
    if (Array.isArray(result)) {
        context.result = result.filter(keep);
    }
    else if (result && Array.isArray(result.data)) {
        result.data = result.data.filter(keep);
        if (typeof result.total === 'number') {
            result.total = Math.max(0, result.total - (Array.isArray(result.data) ? 0 : 0));
        }
    }
    return context;
};
// ──────────────────────────────────────────────────────────────────
// Service registration
// ──────────────────────────────────────────────────────────────────
const agentRatings = (app) => {
    app.use(exports.agentRatingsPath, new agent_ratings_class_1.AgentRatingsService((0, agent_ratings_class_1.getOptions)(app)), {
        methods: exports.agentRatingsMethods,
        events: []
    });
    app.service(exports.agentRatingsPath).hooks({
        around: {
            all: [
                schema_1.hooks.resolveExternal(agent_ratings_schema_1.agentRatingExternalResolver),
                schema_1.hooks.resolveResult(agent_ratings_schema_1.agentRatingResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(agent_ratings_schema_1.agentRatingQueryValidator),
                schema_1.hooks.resolveQuery(agent_ratings_schema_1.agentRatingQueryResolver)
            ],
            // Public browse: anyone can list reviews; admins see hidden ones too.
            find: [(0, authenticate_if_jwt_present_1.authenticateIfJwtPresent)(), populate_roles_1.populateRoles],
            get: [(0, authenticate_if_jwt_present_1.authenticateIfJwtPresent)(), populate_roles_1.populateRoles],
            create: [
                (0, authentication_1.authenticate)('jwt'),
                attachUserAndEnforceUnique,
                schema_1.hooks.validateData(agent_ratings_schema_1.agentRatingDataValidator),
                schema_1.hooks.resolveData(agent_ratings_schema_1.agentRatingDataResolver)
            ],
            patch: [
                (0, authentication_1.authenticate)('jwt'),
                populate_roles_1.populateRoles,
                restrictToOwner,
                schema_1.hooks.validateData(agent_ratings_schema_1.agentRatingPatchValidator),
                schema_1.hooks.resolveData(agent_ratings_schema_1.agentRatingPatchResolver)
            ],
            remove: [(0, authentication_1.authenticate)('jwt'), populate_roles_1.populateRoles, restrictToOwner]
        },
        after: {
            find: [hideModeratedFromPublic],
            create: [syncAgentRatingSummary],
            patch: [syncAgentRatingSummary],
            remove: [syncAgentRatingSummary]
        }
    });
};
exports.agentRatings = agentRatings;
//# sourceMappingURL=agent-ratings.js.map