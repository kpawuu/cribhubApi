import type { Application } from '../../declarations';
import { FavoritesService } from './favorites.class';
export declare const favoritesPath = "favorites";
export declare const favoritesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const favorites: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [favoritesPath]: FavoritesService;
    }
}
