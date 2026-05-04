"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.AgentRatingsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class AgentRatingsService extends mongodb_1.MongoDBService {
}
exports.AgentRatingsService = AgentRatingsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('agent_ratings'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=agent-ratings.class.js.map