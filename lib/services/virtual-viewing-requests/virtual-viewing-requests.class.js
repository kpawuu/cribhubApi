"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.VirtualViewingRequestsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class VirtualViewingRequestsService extends mongodb_1.MongoDBService {
}
exports.VirtualViewingRequestsService = VirtualViewingRequestsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('virtual_viewing_requests'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=virtual-viewing-requests.class.js.map