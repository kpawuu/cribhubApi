import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { UserNotification, UserNotificationData, UserNotificationPatch, UserNotificationQuery } from './user-notifications.schema'

export type { UserNotification, UserNotificationData, UserNotificationPatch, UserNotificationQuery }

export interface UserNotificationsParams extends MongoDBAdapterParams<UserNotificationQuery> {}

export class UserNotificationsService<ServiceParams extends Params = UserNotificationsParams> extends MongoDBService<
  UserNotification,
  UserNotificationData,
  UserNotificationsParams,
  UserNotificationPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('user_notifications')),
    operators: ['$exists', '$in', '$nin', '$ne', '$regex', '$options', '$and', '$or', '$nor', '$not', '$elemMatch', '$type']
  }
}
