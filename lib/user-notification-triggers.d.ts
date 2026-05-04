import type { Application } from './declarations';
/**
 * Registers `after` hooks on domain services so each significant event creates
 * an in-app row in `user-notifications` for the affected user(s).
 */
export declare function registerUserNotificationTriggers(app: Application): void;
