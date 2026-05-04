import type { HookContext } from '../declarations';
export declare const authenticateIfExternal: (...strategies: string[]) => (context: HookContext) => Promise<any>;
