import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { Application } from '../../declarations'
import type { UserRole, UserRoleData, UserRolePatch, UserRoleQuery } from './user-roles.schema'

export type { UserRole, UserRoleData, UserRolePatch, UserRoleQuery }

export interface UserRoleParams extends Params<UserRoleQuery> {}

export class UserRolesService<ServiceParams extends UserRoleParams = UserRoleParams> extends MongoDBService<
  UserRole,
  UserRoleData,
  ServiceParams,
  UserRolePatch
> {}

export const getOptions = (app: Application) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('user_roles'))
  }
}

