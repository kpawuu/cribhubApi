import type { Application } from '../../declarations';
import { PaymentsService } from './payments.class';
export declare const paymentsPath = "payments";
export declare const paymentsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const payments: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [paymentsPath]: PaymentsService;
    }
}
