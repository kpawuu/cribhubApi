import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { ChatMessage, ChatMessageData, ChatMessagePatch, ChatMessageQuery } from './chat-messages.schema';
export type { ChatMessage, ChatMessageData, ChatMessagePatch, ChatMessageQuery };
export interface ChatMessagesParams extends MongoDBAdapterParams<ChatMessageQuery> {
}
export declare class ChatMessagesService<ServiceParams extends Params = ChatMessagesParams> extends MongoDBService<ChatMessage, ChatMessageData, ChatMessagesParams, ChatMessagePatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
