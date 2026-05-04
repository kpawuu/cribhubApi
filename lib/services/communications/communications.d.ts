import type { Application } from '../../declarations';
import { CommunicationsService } from './communications.class';
export declare const communicationsPath = "communications";
export declare const communicationsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const communications: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [communicationsPath]: CommunicationsService;
    }
}
