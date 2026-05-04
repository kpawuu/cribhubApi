"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.MaintenanceRequestsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class MaintenanceRequestsService extends mongodb_1.MongoDBService {
}
exports.MaintenanceRequestsService = MaintenanceRequestsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('maintenance_requests'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=maintenance-requests.class.js.map