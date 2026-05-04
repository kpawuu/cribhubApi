"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.UnitsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class UnitsService extends mongodb_1.MongoDBService {
}
exports.UnitsService = UnitsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('units')),
        operators: ['$regex', '$options', '$exists', '$elemMatch', '$and', '$or', '$nor', '$not']
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=units.class.js.map