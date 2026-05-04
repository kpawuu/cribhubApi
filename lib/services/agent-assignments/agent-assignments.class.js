"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.AgentAssignmentsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class AgentAssignmentsService extends mongodb_1.MongoDBService {
}
exports.AgentAssignmentsService = AgentAssignmentsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        multi: true,
        Model: app.get('mongodbClient').then((db) => db.collection('agent_assignments'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=agent-assignments.class.js.map