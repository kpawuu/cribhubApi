"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.SitePagesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class SitePagesService extends mongodb_1.MongoDBService {
}
exports.SitePagesService = SitePagesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('site_pages'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=site-pages.class.js.map