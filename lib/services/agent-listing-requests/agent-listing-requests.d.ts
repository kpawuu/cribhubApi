import type { Application } from '../../declarations';
import { AgentListingRequestsService } from './agent-listing-requests.class';
export declare const agentListingRequestsPath = "agent-listing-requests";
export declare const agentListingRequestsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const agentListingRequests: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [agentListingRequestsPath]: AgentListingRequestsService;
    }
}
