import type { Application } from '../../declarations';
import { PropertiesService } from './properties.class';
export declare const propertiesPath = "properties";
export declare const propertiesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const properties: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [propertiesPath]: PropertiesService;
    }
}
