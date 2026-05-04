import type { Application } from '../../declarations';
import { RentalApplicationsService } from './rental-applications.class';
export declare const rentalApplicationsPath = "rental-applications";
export declare const rentalApplicationsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const rentalApplications: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [rentalApplicationsPath]: RentalApplicationsService;
    }
}
