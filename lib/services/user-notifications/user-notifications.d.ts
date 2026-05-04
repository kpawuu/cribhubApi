import type { Application } from '../../declarations';
import { UserNotificationsService } from './user-notifications.class';
export declare const userNotificationsPath = "user-notifications";
export declare const userNotificationsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const userNotifications: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [userNotificationsPath]: UserNotificationsService;
    }
}
