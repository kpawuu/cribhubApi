"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.ChatMessagesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
class ChatMessagesService extends mongodb_1.MongoDBService {
}
exports.ChatMessagesService = ChatMessagesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('chat_messages'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=chat-messages.class.js.map