"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.PropertyManagerAssignmentsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class PropertyManagerAssignmentsService extends mongodb_1.MongoDBService {
}
exports.PropertyManagerAssignmentsService = PropertyManagerAssignmentsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        multi: true,
        Model: app.get('mongodbClient').then((db) => db.collection('property_manager_assignments'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=property-manager-assignments.class.js.map