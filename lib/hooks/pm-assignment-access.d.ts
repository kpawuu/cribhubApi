import type { HookContext } from '../declarations';
export declare const getPmAssignedPropertyIds: (context: HookContext, managerUserId: string) => Promise<string[]>;
/**
 * PM-only users (no landlord/admin): portfolio `find` is limited to assigned properties.
 * Public catalog browse (e.g. `/listings`) must not send `pmPortfolio`; same visibility as guests/tenants.
 * Landlord hub passes `pmPortfolio: true` so managers only see properties they manage.
 */
export declare const restrictPropertyManagerPropertiesFind: (context: HookContext) => Promise<HookContext>;
/**
 * Agent-only users: portfolio `find` is limited to assigned properties.
 * Landlord hub passes `agentPortfolio: true` so agents only see properties they represent.
 */
export declare const restrictAgentPropertiesFind: (context: HookContext) => Promise<HookContext>;
export declare const requirePmAssignedToProperty: (propertyId: string) => (context: HookContext) => Promise<HookContext>;
export declare const restrictUnitsToAssignedPropertiesForPm: (context: HookContext) => Promise<HookContext>;
