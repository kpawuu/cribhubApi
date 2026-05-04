import type { Application } from '../../declarations';
export declare const deleteAccountPath = "delete-account";
export declare class DeleteAccountService {
    create(data: any, params: any): Promise<{
        status: string;
    }>;
}
export declare const deleteAccount: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [deleteAccountPath]: DeleteAccountService;
    }
}
