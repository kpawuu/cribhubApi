import type { HookContext } from '../declarations';
export declare const requireRole: (...allowedRoles: string[]) => (context: HookContext) => Promise<HookContext>;
