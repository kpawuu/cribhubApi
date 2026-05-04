import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { Application } from '../../declarations'
import type { RoleRequest, RoleRequestData, RoleRequestPatch, RoleRequestQuery } from './role-requests.schema'

export type { RoleRequest, RoleRequestData, RoleRequestPatch, RoleRequestQuery }

export interface RoleRequestParams extends Params<RoleRequestQuery> {}

export class RoleRequestsService<ServiceParams extends RoleRequestParams = RoleRequestParams> extends MongoDBService<
  RoleRequest,
  RoleRequestData,
  ServiceParams,
  RoleRequestPatch
> {}

export const getOptions = (app: Application) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('role_requests'))
  }
}

