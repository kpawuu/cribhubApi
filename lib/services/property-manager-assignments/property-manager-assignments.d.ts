import type { Application } from '../../declarations';
import { PropertyManagerAssignmentsService } from './property-manager-assignments.class';
export declare const propertyManagerAssignmentsPath = "property-manager-assignments";
export declare const propertyManagerAssignmentsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const propertyManagerAssignments: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [propertyManagerAssignmentsPath]: PropertyManagerAssignmentsService;
    }
}
