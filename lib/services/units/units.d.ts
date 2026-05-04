import type { Application } from '../../declarations';
import { UnitsService } from './units.class';
export declare const unitsPath = "units";
export declare const unitsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const units: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [unitsPath]: UnitsService;
    }
}
