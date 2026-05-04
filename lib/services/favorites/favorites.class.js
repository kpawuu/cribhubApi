"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.FavoritesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class FavoritesService extends mongodb_1.MongoDBService {
}
exports.FavoritesService = FavoritesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('favorites'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=favorites.class.js.map