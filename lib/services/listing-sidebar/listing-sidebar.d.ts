import type { Application } from '../../declarations';
export declare const listingSidebarPath = "listing-sidebar";
export type ListingSidebarLink = {
    label: string;
    /** Flat string query params suitable for `/listings` URL query */
    query: Record<string, string>;
};
export declare class ListingSidebarService {
    app: Application;
    constructor(app: Application);
    find(): Promise<{
        popularSearches: {
            query: {
                [x: string]: string;
            };
            label: string;
        }[];
        nearbyAreas: ListingSidebarLink[];
    }>;
}
export declare const listingSidebar: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [listingSidebarPath]: ListingSidebarService;
    }
}
