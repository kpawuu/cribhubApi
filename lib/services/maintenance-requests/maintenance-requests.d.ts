import type { Application } from '../../declarations';
import { MaintenanceRequestsService } from './maintenance-requests.class';
export declare const maintenanceRequestsPath = "maintenance-requests";
export declare const maintenanceRequestsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const maintenanceRequests: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [maintenanceRequestsPath]: MaintenanceRequestsService;
    }
}
