"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.InquiriesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class InquiriesService extends mongodb_1.MongoDBService {
}
exports.InquiriesService = InquiriesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('inquiries'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=inquiries.class.js.map