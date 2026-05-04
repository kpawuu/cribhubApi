import type { HookContext } from '../../declarations';
/**
 * Batches `user-roles` for all users in the response and attaches `userRoles` + `roles`
 * (external clients only). Avoids N+1 queries on `users.find`.
 */
export declare const attachUserRolesForExternal: (context: HookContext) => Promise<HookContext>;
