import type { Application } from '../declarations';
/** Unit `_id` strings for all units on properties owned by this user (matches `rental-applications` lookup). */
export declare function unitIdsForLandlord(app: Application, user: {
    _id: {
        toString(): string;
    };
}): Promise<string[]>;
/** Unit `_id` strings for units on properties assigned to the agent. */
/** Units on properties where this user is an assigned property manager. */
export declare function unitIdsForPropertyManager(app: Application, managerUserId: string): Promise<string[]>;
export declare function unitIdsForAgent(app: Application, agentUserId: string): Promise<string[]>;
