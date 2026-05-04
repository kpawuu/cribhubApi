import type { Application } from '../../declarations';
export declare const mailerPath = "mailer";
export declare const mailer: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [mailerPath]: any;
    }
}
