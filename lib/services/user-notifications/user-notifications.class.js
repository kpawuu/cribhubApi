"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.UserNotificationsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class UserNotificationsService extends mongodb_1.MongoDBService {
}
exports.UserNotificationsService = UserNotificationsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('user_notifications')),
        operators: ['$exists', '$in', '$nin', '$ne', '$regex', '$options', '$and', '$or', '$nor', '$not', '$elemMatch', '$type']
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=user-notifications.class.js.map