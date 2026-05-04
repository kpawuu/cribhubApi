import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers';
import type { Application } from '../../declarations';
export type Sms = any;
export type SmsData = {
    recipient: string[];
    message: string;
    sender?: string;
    is_schedule?: boolean;
    schedule_date?: string;
    sms_type?: 'otp';
};
export type SmsPatch = any;
export type SmsQuery = any;
export interface SmsServiceOptions {
    app: Application;
}
export interface SmsParams extends Params<SmsQuery> {
}
export declare class SmsService<ServiceParams extends SmsParams = SmsParams> implements ServiceInterface<Sms, SmsData, ServiceParams, SmsPatch> {
    options: SmsServiceOptions;
    constructor(options: SmsServiceOptions);
    find(_params?: ServiceParams): Promise<Sms[]>;
    get(id: Id, _params?: ServiceParams): Promise<Sms>;
    create(data: SmsData, _params?: ServiceParams): Promise<Sms>;
    update(_id: NullableId, data: SmsData, params?: ServiceParams): Promise<Sms>;
    patch(id: NullableId, data: SmsPatch, _params?: ServiceParams): Promise<Sms>;
    remove(id: NullableId, _params?: ServiceParams): Promise<Sms>;
}
export declare const getOptions: (app: Application) => {
    app: Application;
};
