import type { Application } from '../../declarations';
import { LegalDocumentsService } from './legal-documents.class';
export declare const legalDocumentsPath = "legal-documents";
export declare const legalDocumentsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const legalDocuments: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [legalDocumentsPath]: LegalDocumentsService;
    }
}
