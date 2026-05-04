import type { Static } from '@feathersjs/typebox';
export declare const configurationSchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
    authentication: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        secret: import("@feathersjs/typebox").TString<string>;
        entity: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TNull]>>;
        entityId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        service: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        authStrategies: import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
        parseStrategies: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
        jwtOptions: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{}>>;
        jwt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            header: import("@feathersjs/typebox").TString<string>;
            schemes: import("@feathersjs/typebox").TString<string>;
        }>>;
        local: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            usernameField: import("@feathersjs/typebox").TString<string>;
            passwordField: import("@feathersjs/typebox").TString<string>;
            hashSize: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            errorMessage: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            entityUsernameField: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            entityPasswordField: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        }>>;
        oauth: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            redirect: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            origins: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
            defaults: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
                key: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
                secret: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            }>>;
        }>>;
    }>>;
    paginate: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        default: import("@feathersjs/typebox").TNumber;
        max: import("@feathersjs/typebox").TNumber;
    }>>;
    origins: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    mongodb: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    mysql: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        client: import("@feathersjs/typebox").TString<string>;
        connection: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
            host: import("@feathersjs/typebox").TString<string>;
            port: import("@feathersjs/typebox").TNumber;
            user: import("@feathersjs/typebox").TString<string>;
            password: import("@feathersjs/typebox").TString<string>;
            database: import("@feathersjs/typebox").TString<string>;
        }>>]>;
        pool: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            min: import("@feathersjs/typebox").TNumber;
            max: import("@feathersjs/typebox").TNumber;
        }>>;
    }>>;
    postgresql: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        client: import("@feathersjs/typebox").TString<string>;
        connection: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
            host: import("@feathersjs/typebox").TString<string>;
            port: import("@feathersjs/typebox").TNumber;
            user: import("@feathersjs/typebox").TString<string>;
            password: import("@feathersjs/typebox").TString<string>;
            database: import("@feathersjs/typebox").TString<string>;
        }>>]>;
        pool: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            min: import("@feathersjs/typebox").TNumber;
            max: import("@feathersjs/typebox").TNumber;
        }>>;
    }>>;
    sqlite: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        client: import("@feathersjs/typebox").TString<string>;
        connection: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
            host: import("@feathersjs/typebox").TString<string>;
            port: import("@feathersjs/typebox").TNumber;
            user: import("@feathersjs/typebox").TString<string>;
            password: import("@feathersjs/typebox").TString<string>;
            database: import("@feathersjs/typebox").TString<string>;
        }>>]>;
        pool: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            min: import("@feathersjs/typebox").TNumber;
            max: import("@feathersjs/typebox").TNumber;
        }>>;
    }>>;
    mssql: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        client: import("@feathersjs/typebox").TString<string>;
        connection: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
            host: import("@feathersjs/typebox").TString<string>;
            port: import("@feathersjs/typebox").TNumber;
            user: import("@feathersjs/typebox").TString<string>;
            password: import("@feathersjs/typebox").TString<string>;
            database: import("@feathersjs/typebox").TString<string>;
        }>>]>;
        pool: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            min: import("@feathersjs/typebox").TNumber;
            max: import("@feathersjs/typebox").TNumber;
        }>>;
    }>>;
}>, import("@feathersjs/typebox").TObject<{
    host: import("@feathersjs/typebox").TString<string>;
    port: import("@feathersjs/typebox").TNumber;
    public: import("@feathersjs/typebox").TString<string>;
    origins: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    mongodb: import("@feathersjs/typebox").TString<string>;
    authentication: import("@feathersjs/typebox").TAny;
}>]>;
export type ApplicationConfiguration = Static<typeof configurationSchema>;
export declare const configurationValidator: import("@feathersjs/schema").Validator<any, any>;
