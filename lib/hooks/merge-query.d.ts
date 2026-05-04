import type { HookContext } from '../declarations';
/**
 * Merges additional query fields onto `context.params.query` while preserving the
 * non-enumerable VALIDATED symbol set by `schemaHooks.validateQuery`.
 *
 * Using `{ ...context.params.query, ...extra }` plain-object spread loses VALIDATED,
 * which forces `sanitizeQuery` to re-run `filterQuery` on the merged query.  That
 * causes "Invalid query parameter" errors for MongoDB operators like $regex, $nor, etc.
 * that are added server-side and never come from the client.
 */
export declare function mergeQuery(context: HookContext, extra: Record<string, unknown>): void;
