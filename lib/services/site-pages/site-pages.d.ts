import type { Application } from '../../declarations';
import { SitePagesService } from './site-pages.class';
export declare const sitePagesPath = "site-pages";
export declare const sitePagesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const sitePages: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [sitePagesPath]: SitePagesService;
    }
}
