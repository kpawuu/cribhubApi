import type { Application } from '../../declarations';
import { NoticesService } from './notices.class';
export declare const noticesPath = "notices";
export declare const noticesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const notices: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [noticesPath]: NoticesService;
    }
}
