"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongodb = void 0;
const mongodb_1 = require("mongodb");
const mongodb = (app) => {
    const connection = app.get('mongodb');
    const database = new URL(connection).pathname.substring(1) || 'rentflow_api';
    const mongoClient = mongodb_1.MongoClient.connect(connection).then((client) => client.db(database));
    app.set('mongodbClient', mongoClient);
};
exports.mongodb = mongodb;
//# sourceMappingURL=mongodb.js.map