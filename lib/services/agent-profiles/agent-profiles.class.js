"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.AgentProfilesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class AgentProfilesService extends mongodb_1.MongoDBService {
}
exports.AgentProfilesService = AgentProfilesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('agent_profiles'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=agent-profiles.class.js.map