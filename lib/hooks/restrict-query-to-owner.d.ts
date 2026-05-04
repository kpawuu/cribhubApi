import type { HookContext } from '../declarations';
/**
 * Restrict external queries to records owned by the current user unless they have one of the privileged roles.
 * Intended for services that store an explicit owner field (e.g. landlordId).
 */
export declare const restrictQueryToOwner: (ownerField: string, privilegedRoles?: string[]) => (context: HookContext) => Promise<HookContext>;
