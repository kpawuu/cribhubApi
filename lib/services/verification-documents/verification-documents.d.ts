import type { Application } from '../../declarations';
import { VerificationDocumentsService } from './verification-documents.class';
export declare const verificationDocumentsPath = "verification-documents";
export declare const verificationDocumentsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const verificationDocuments: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [verificationDocumentsPath]: VerificationDocumentsService;
    }
}
