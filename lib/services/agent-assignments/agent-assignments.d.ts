import type { Application } from '../../declarations';
import { AgentAssignmentsService } from './agent-assignments.class';
export declare const agentAssignmentsPath = "agent-assignments";
export declare const agentAssignmentsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const agentAssignments: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [agentAssignmentsPath]: AgentAssignmentsService;
    }
}
