import type { Application } from '../../declarations';
import { VirtualViewingRequestsService } from './virtual-viewing-requests.class';
export declare const virtualViewingRequestsPath = "virtual-viewing-requests";
export declare const virtualViewingRequestsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const virtualViewingRequests: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [virtualViewingRequestsPath]: VirtualViewingRequestsService;
    }
}
