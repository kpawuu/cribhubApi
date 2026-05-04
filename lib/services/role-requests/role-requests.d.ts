import type { Application } from '../../declarations';
import { RoleRequestsService } from './role-requests.class';
export declare const roleRequestsPath = "role-requests";
export declare const roleRequestsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const roleRequests: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [roleRequestsPath]: RoleRequestsService;
    }
}
