import type { Application } from '../../declarations';
import { AgentProfilesService } from './agent-profiles.class';
export declare const agentProfilesPath = "agent-profiles";
export declare const agentProfilesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const agentProfiles: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [agentProfilesPath]: AgentProfilesService;
    }
}
