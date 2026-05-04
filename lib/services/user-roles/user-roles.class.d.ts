import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { UserRole, UserRoleData, UserRolePatch, UserRoleQuery } from './user-roles.schema';
export type { UserRole, UserRoleData, UserRolePatch, UserRoleQuery };
export interface UserRoleParams extends Params<UserRoleQuery> {
}
export declare class UserRolesService<ServiceParams extends UserRoleParams = UserRoleParams> extends MongoDBService<UserRole, UserRoleData, ServiceParams, UserRolePatch> {
}
export declare const getOptions: (app: Application) => {
    paginate: {
        default: number;
        max: number;
    } | undefined;
    Model: Promise<import("mongodb").Collection<import("bson").Document>>;
};
