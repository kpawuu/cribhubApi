import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { UserNotification, UserNotificationData, UserNotificationPatch, UserNotificationQuery } from './user-notifications.schema';
export type { UserNotification, UserNotificationData, UserNotificationPatch, UserNotificationQuery };
export interface UserNotificationsParams extends MongoDBAdapterParams<UserNotificationQuery> {
}
export declare class UserNotificationsService<ServiceParams extends Params = UserNotificationsParams> extends MongoDBService<UserNotification, UserNotificationData, UserNotificationsParams, UserNotificationPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
