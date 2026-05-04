import type { Application } from '../../declarations';
import { PropertyManagerListingRequestsService } from './property-manager-listing-requests.class';
export declare const propertyManagerListingRequestsPath = "property-manager-listing-requests";
export declare const propertyManagerListingRequestsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const propertyManagerListingRequests: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [propertyManagerListingRequestsPath]: PropertyManagerListingRequestsService;
    }
}
