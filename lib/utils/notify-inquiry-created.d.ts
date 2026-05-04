import type { Application } from '../declarations';
/**
 * After an inquiry is created, notify landlord (and assigned agent) by email;
 * optional SMS via existing `sms` service when MNOTIFY_API_KEY is set.
 * Failures are logged and never thrown (create must succeed).
 */
export declare function notifyInquiryCreated(app: Application, inquiry: Record<string, any>): Promise<void>;
