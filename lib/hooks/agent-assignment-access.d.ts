import type { HookContext } from '../declarations';
export declare const restrictPropertiesToAssignedForAgents: () => (context: HookContext) => Promise<HookContext>;
export declare const requireAgentAssignedToProperty: (propertyId: string) => (context: HookContext) => Promise<HookContext>;
export declare const restrictUnitsToAssignedPropertiesForAgents: () => (context: HookContext) => Promise<HookContext>;
