import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { Application } from '../../declarations'
import type { User, UserData, UserPatch, UserQuery } from './users.schema'

export type { User, UserData, UserPatch, UserQuery }

export interface UserParams extends Params<UserQuery> {}

export class UsersService<ServiceParams extends UserParams = UserParams> extends MongoDBService<User, UserData, ServiceParams, UserPatch> {}

export const getOptions = (app: Application) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('users'))
  }
}

