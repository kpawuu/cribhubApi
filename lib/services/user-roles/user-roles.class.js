"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.UserRolesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class UserRolesService extends mongodb_1.MongoDBService {
}
exports.UserRolesService = UserRolesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('user_roles'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=user-roles.class.js.map