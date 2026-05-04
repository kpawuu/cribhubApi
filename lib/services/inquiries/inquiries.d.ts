import type { Application } from '../../declarations';
import { InquiriesService } from './inquiries.class';
export declare const inquiriesPath = "inquiries";
export declare const inquiriesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const inquiries: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [inquiriesPath]: InquiriesService;
    }
}
