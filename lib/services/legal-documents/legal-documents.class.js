"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.LegalDocumentsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class LegalDocumentsService extends mongodb_1.MongoDBService {
}
exports.LegalDocumentsService = LegalDocumentsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('legal_documents'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=legal-documents.class.js.map