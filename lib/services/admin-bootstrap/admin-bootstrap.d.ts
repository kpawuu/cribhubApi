import type { Application } from '../../declarations';
export declare const adminBootstrapPath = "admin-bootstrap";
/**
 * One-off / dev bootstrap for admin accounts. Gated by `ADMIN_BOOTSTRAP_SECRET` (min 16 chars).
 * Not authenticated — protect with a strong secret and disable in production if you prefer DB-only ops.
 */
export declare class AdminBootstrapService {
    create(data: any, params: any): Promise<{
        ok: boolean;
        userId: string;
        email: string;
        mode: string;
        message: string;
    } | {
        ok: boolean;
        userId: any;
        email: string;
        mode: string;
        message: string;
        roles: string[];
    }>;
}
export declare const adminBootstrap: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [adminBootstrapPath]: AdminBootstrapService;
    }
}
