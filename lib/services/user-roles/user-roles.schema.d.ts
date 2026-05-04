import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
export declare const userRoleSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
}>;
export type UserRole = Static<typeof userRoleSchema>;
export declare const userRoleValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const userRoleResolver: import("@feathersjs/schema").Resolver<{
    _id: string | {};
    createdAt: string;
    userId: string;
    role: "tenant" | "landlord" | "property_manager" | "agent" | "admin";
}, HookContext>;
export declare const userRoleExternalResolver: import("@feathersjs/schema").Resolver<{
    _id: string | {};
    createdAt: string;
    userId: string;
    role: "tenant" | "landlord" | "property_manager" | "agent" | "admin";
}, HookContext>;
export declare const userRoleDataSchema: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
}>, ["userId", "role"]>;
export type UserRoleData = Static<typeof userRoleDataSchema>;
export declare const userRoleDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const userRoleDataResolver: import("@feathersjs/schema").Resolver<{
    _id: string | {};
    createdAt: string;
    userId: string;
    role: "tenant" | "landlord" | "property_manager" | "agent" | "admin";
}, HookContext>;
export declare const userRolePatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
}>>;
export type UserRolePatch = Static<typeof userRolePatchSchema>;
export declare const userRolePatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const userRolePatchResolver: import("@feathersjs/schema").Resolver<{
    _id: string | {};
    createdAt: string;
    userId: string;
    role: "tenant" | "landlord" | "property_manager" | "agent" | "admin";
}, HookContext>;
export declare const userRoleQuerySchema: import("@feathersjs/typebox").TObject<{}>;
export type UserRoleQuery = Static<typeof userRoleQuerySchema>;
export declare const userRoleQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const userRoleQueryResolver: import("@feathersjs/schema").Resolver<{}, HookContext>;
