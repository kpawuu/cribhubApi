"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.PropertyManagerListingRequestsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class PropertyManagerListingRequestsService extends mongodb_1.MongoDBService {
}
exports.PropertyManagerListingRequestsService = PropertyManagerListingRequestsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('property_manager_listing_requests')),
        operators: ['$exists', '$in', '$nin', '$ne', '$and', '$or', '$nor', '$not', '$elemMatch']
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=property-manager-listing-requests.class.js.map