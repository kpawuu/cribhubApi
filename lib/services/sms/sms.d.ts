import type { Application } from '../../declarations';
import { SmsService } from './sms.class';
export declare const smsPath = "sms";
export declare const smsMethods: Array<keyof SmsService>;
export declare const sms: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [smsPath]: SmsService;
    }
}
