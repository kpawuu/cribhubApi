"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.PaymentsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class PaymentsService extends mongodb_1.MongoDBService {
}
exports.PaymentsService = PaymentsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('payments'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=payments.class.js.map