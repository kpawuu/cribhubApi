import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { User, UserData, UserPatch, UserQuery } from './users.schema';
export type { User, UserData, UserPatch, UserQuery };
export interface UserParams extends Params<UserQuery> {
}
export declare class UsersService<ServiceParams extends UserParams = UserParams> extends MongoDBService<User, UserData, ServiceParams, UserPatch> {
}
export declare const getOptions: (app: Application) => {
    paginate: {
        default: number;
        max: number;
    } | undefined;
    Model: Promise<import("mongodb").Collection<import("bson").Document>>;
};
