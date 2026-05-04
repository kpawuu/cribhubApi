"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.RentalApplicationsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class RentalApplicationsService extends mongodb_1.MongoDBService {
}
exports.RentalApplicationsService = RentalApplicationsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('rental_applications'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=rental-applications.class.js.map