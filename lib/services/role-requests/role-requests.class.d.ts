import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { RoleRequest, RoleRequestData, RoleRequestPatch, RoleRequestQuery } from './role-requests.schema';
export type { RoleRequest, RoleRequestData, RoleRequestPatch, RoleRequestQuery };
export interface RoleRequestParams extends Params<RoleRequestQuery> {
}
export declare class RoleRequestsService<ServiceParams extends RoleRequestParams = RoleRequestParams> extends MongoDBService<RoleRequest, RoleRequestData, ServiceParams, RoleRequestPatch> {
}
export declare const getOptions: (app: Application) => {
    paginate: {
        default: number;
        max: number;
    } | undefined;
    Model: Promise<import("mongodb").Collection<import("bson").Document>>;
};
