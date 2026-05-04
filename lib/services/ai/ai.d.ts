import type { Application } from '../../declarations';
export declare const aiPath = "ai";
/**
 * Minimal AI “edge-function replacement” service.
 * Actions:
 * - create({ action: 'generate-contract', contractId })
 * - create({ action: 'generate-legal-document', title, documentType, jurisdiction?, prompt? })
 *
 * If `LOVABLE_API_KEY` is configured, you can later replace the placeholder generation
 * with real gateway calls.
 */
export declare class AiService {
    create(data: any, params: any): Promise<any>;
}
export declare const ai: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [aiPath]: AiService;
    }
}
