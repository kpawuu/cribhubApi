import type { Application } from '../../declarations';
import { RentalContractsService } from './rental-contracts.class';
export declare const rentalContractsPath = "rental-contracts";
export declare const rentalContractsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const rentalContracts: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [rentalContractsPath]: RentalContractsService;
    }
}
