"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.CommunicationsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class CommunicationsService extends mongodb_1.MongoDBService {
}
exports.CommunicationsService = CommunicationsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('communications'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=communications.class.js.map