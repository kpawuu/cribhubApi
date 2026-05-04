import type { Application } from '../../declarations';
import { FilesUploaderService } from './files-uploader.class';
export declare const filesUploaderPath = "files-uploader";
export declare const filesUploader: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [filesUploaderPath]: FilesUploaderService;
    }
}
