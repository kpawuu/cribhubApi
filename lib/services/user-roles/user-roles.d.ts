import type { Application } from '../../declarations';
import { UserRolesService } from './user-roles.class';
export declare const userRolesPath = "user-roles";
export declare const userRolesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const userRoles: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [userRolesPath]: UserRolesService;
    }
}
