"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.RentalContractsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class RentalContractsService extends mongodb_1.MongoDBService {
}
exports.RentalContractsService = RentalContractsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('rental_contracts'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=rental-contracts.class.js.map