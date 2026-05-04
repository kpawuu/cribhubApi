"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeQuery = mergeQuery;
const adapter_commons_1 = require("@feathersjs/adapter-commons");
/**
 * Merges additional query fields onto `context.params.query` while preserving the
 * non-enumerable VALIDATED symbol set by `schemaHooks.validateQuery`.
 *
 * Using `{ ...context.params.query, ...extra }` plain-object spread loses VALIDATED,
 * which forces `sanitizeQuery` to re-run `filterQuery` on the merged query.  That
 * causes "Invalid query parameter" errors for MongoDB operators like $regex, $nor, etc.
 * that are added server-side and never come from the client.
 */
function mergeQuery(context, extra) {
    const current = context.params.query || {};
    const merged = { ...current, ...extra };
    // Re-stamp VALIDATED so sanitizeQuery trusts the merged result without re-running
    // adapter-commons' filterQuery (which would reject server-side MongoDB operators).
    Object.defineProperty(merged, adapter_commons_1.VALIDATED, { value: true, enumerable: false, configurable: true });
    context.params.query = merged;
}
//# sourceMappingURL=merge-query.js.map