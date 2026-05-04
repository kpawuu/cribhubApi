import type { Application } from '../../declarations';
export declare const paystackWebhookPath = "paystack-webhook";
/**
 * Paystack webhook receiver.
 * - Public endpoint (no auth)
 * - Verifies `x-paystack-signature` using `PAYSTACK_SECRET_KEY`
 * - On charge.success, inserts a payment record (idempotent by reference)
 */
export declare class PaystackWebhookService {
    create(data: any, params: any): Promise<{
        received: boolean;
    }>;
}
export declare const paystackWebhook: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [paystackWebhookPath]: PaystackWebhookService;
    }
}
