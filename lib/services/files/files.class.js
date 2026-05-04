"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.FilesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class FilesService extends mongodb_1.MongoDBService {
}
exports.FilesService = FilesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        multi: true,
        Model: app.get('mongodbClient').then((db) => db.collection('files'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=files.class.js.map