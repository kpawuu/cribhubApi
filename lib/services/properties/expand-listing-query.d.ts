import type { HookContext } from '../../declarations';
/**
 * Turns public listing UI params into Mongo-safe filters before the adapter runs.
 * Removes virtual keys: `$search`, `type`, `superAgent`.
 */
export declare function expandListingQuery(context: HookContext): Promise<HookContext>;
