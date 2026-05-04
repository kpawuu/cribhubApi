import type { Application } from '../../declarations';
import { RefreshTokensService } from './refresh-tokens.class';
export declare const refreshTokensPath = "refresh-tokens";
export declare const refreshTokensMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const refreshTokens: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [refreshTokensPath]: RefreshTokensService;
    }
}
