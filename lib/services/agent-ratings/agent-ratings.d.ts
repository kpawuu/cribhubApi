import type { Application } from '../../declarations';
import { AgentRatingsService } from './agent-ratings.class';
export declare const agentRatingsPath = "agent-ratings";
export declare const agentRatingsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const agentRatings: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [agentRatingsPath]: AgentRatingsService;
    }
}
