"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.AgentListingRequestsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class AgentListingRequestsService extends mongodb_1.MongoDBService {
}
exports.AgentListingRequestsService = AgentListingRequestsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('agent_listing_requests')),
        operators: ['$exists', '$in', '$nin', '$ne', '$and', '$or', '$nor', '$not', '$elemMatch']
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=agent-listing-requests.class.js.map