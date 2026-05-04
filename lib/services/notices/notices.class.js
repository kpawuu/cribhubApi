"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.NoticesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class NoticesService extends mongodb_1.MongoDBService {
}
exports.NoticesService = NoticesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('notices'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=notices.class.js.map