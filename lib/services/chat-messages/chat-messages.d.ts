import type { Application } from '../../declarations';
import { ChatMessagesService } from './chat-messages.class';
export declare const chatMessagesPath = "chat-messages";
export declare const chatMessagesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const chatMessages: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [chatMessagesPath]: ChatMessagesService;
    }
}
