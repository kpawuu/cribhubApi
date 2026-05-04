"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.VerificationDocumentsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class VerificationDocumentsService extends mongodb_1.MongoDBService {
}
exports.VerificationDocumentsService = VerificationDocumentsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('verification_documents'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=verification-documents.class.js.map