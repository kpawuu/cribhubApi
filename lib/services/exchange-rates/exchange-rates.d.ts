import type { Application } from '../../declarations';
import { ExchangeRatesService } from './exchange-rates.class';
export declare const exchangeRatesPath = "exchange-rates";
export declare const exchangeRatesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const exchangeRates: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [exchangeRatesPath]: ExchangeRatesService;
    }
}
