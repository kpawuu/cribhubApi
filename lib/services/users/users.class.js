"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.UsersService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class UsersService extends mongodb_1.MongoDBService {
}
exports.UsersService = UsersService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('users'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=users.class.js.map