import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers';
import type { Application } from '../../declarations';
type FilesUploaderData = any;
type FilesUploaderPatch = any;
type FilesUploaderQuery = any;
export interface FilesUploaderParams extends Params<FilesUploaderQuery> {
    koa?: {
        ctx: {
            request: {
                files: any;
                body: any;
            };
        };
    };
}
export declare class FilesUploaderService<ServiceParams extends FilesUploaderParams = FilesUploaderParams> implements ServiceInterface<any, FilesUploaderData, ServiceParams, FilesUploaderPatch> {
    options: {
        app: Application;
    };
    constructor(options: {
        app: Application;
    });
    find(_params?: ServiceParams): Promise<any[]>;
    get(id: Id, _params?: ServiceParams): Promise<any>;
    create(data: FilesUploaderData, params?: ServiceParams): Promise<any>;
    update(id: NullableId, data: FilesUploaderData): Promise<any>;
    patch(id: NullableId, data: FilesUploaderPatch): Promise<any>;
    remove(id: NullableId): Promise<any>;
}
export declare const getOptions: (app: Application) => {
    app: Application;
};
export {};
