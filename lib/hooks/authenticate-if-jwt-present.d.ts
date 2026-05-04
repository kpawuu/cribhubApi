import type { HookContext } from '../declarations';
/** For external calls: run JWT auth only when Authorization is present (allows anonymous catalog reads). */
export declare const authenticateIfJwtPresent: () => (context: HookContext) => Promise<any>;
