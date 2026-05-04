"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.RefreshTokensService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class RefreshTokensService extends mongodb_1.MongoDBService {
}
exports.RefreshTokensService = RefreshTokensService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('refresh-tokens'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=refresh-tokens.class.js.map