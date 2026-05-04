import type { Application } from '../../declarations';
import { FilesService } from './files.class';
export declare const filesPath = "files";
export declare const filesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const files: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [filesPath]: FilesService;
    }
}
