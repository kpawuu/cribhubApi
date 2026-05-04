"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.ExchangeRatesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class ExchangeRatesService extends mongodb_1.MongoDBService {
}
exports.ExchangeRatesService = ExchangeRatesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('exchange_rates'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=exchange-rates.class.js.map