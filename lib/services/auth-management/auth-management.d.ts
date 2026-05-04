import type { Application } from '../../declarations';
export declare const authManagementPath = "auth-management";
export declare const authManagement: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [authManagementPath]: any;
    }
}
