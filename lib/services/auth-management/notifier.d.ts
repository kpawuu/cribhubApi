import type { Application } from '../../declarations';
/**
 * Mirrors inventorsocial_api_backup notifier pattern, but implemented as a safe no-op logger
 * until you wire in a real email/SMS provider.
 *
 * Feathers-authentication-management calls this with:
 *  - resendVerifySignup
 *  - verifySignup
 *  - sendResetPwd
 *  - resetPwd / resetPwdShort
 *  - passwordChange
 *  - identityChange
 */
export declare const authNotifier: (app: Application) => (type: string, user: Record<string, any>, notifierOptions?: Record<string, any>) => Promise<void>;
