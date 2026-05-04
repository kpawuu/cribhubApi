"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.PropertiesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class PropertiesService extends mongodb_1.MongoDBService {
}
exports.PropertiesService = PropertiesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('properties')),
        operators: ['$regex', '$options', '$text', '$elemMatch', '$exists', '$type', '$size', '$all', '$and', '$or', '$nor', '$not']
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=properties.class.js.map