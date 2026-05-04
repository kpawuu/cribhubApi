import type { HookContext } from '../declarations';
/**
 * Ensures `context.params.user.roles` is populated from `user-roles` service.
 * Use this in services that make role decisions without calling `requireRole(...)`.
 */
export declare const populateRoles: (context: HookContext) => Promise<HookContext>;
