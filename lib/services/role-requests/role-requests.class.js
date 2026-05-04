"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.RoleRequestsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class RoleRequestsService extends mongodb_1.MongoDBService {
}
exports.RoleRequestsService = RoleRequestsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('role_requests'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=role-requests.class.js.map