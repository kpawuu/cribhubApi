import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
export declare const roleRequestSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">]>;
    status: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"approved">, import("@feathersjs/typebox").TLiteral<"rejected">]>;
    /** Optional message / pitch from the applicant */
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    /** Virtual: basic applicant info (loaded via ?include=applicant). */
    applicant: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    /** Virtual: role-specific profile (loaded via ?include=profile). */
    profile: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    /** Virtual: verification documents tied to the applicant (loaded via ?include=documents). */
    documents: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
}>;
export type RoleRequest = Static<typeof roleRequestSchema>;
export declare const roleRequestValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const roleRequestResolver: import("@feathersjs/schema").Resolver<{
    message?: string | undefined;
    notes?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
    applicant?: any;
    profile?: any;
    documents?: any[] | undefined;
    _id: string | {};
    createdAt: string;
    userId: string;
    role: "landlord" | "property_manager" | "agent";
    status: "pending" | "approved" | "rejected";
}, HookContext>;
export declare const roleRequestExternalResolver: import("@feathersjs/schema").Resolver<{
    message?: string | undefined;
    notes?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
    applicant?: any;
    profile?: any;
    documents?: any[] | undefined;
    _id: string | {};
    createdAt: string;
    userId: string;
    role: "landlord" | "property_manager" | "agent";
    status: "pending" | "approved" | "rejected";
}, HookContext>;
export declare const roleRequestDataSchema: import("@feathersjs/typebox").TObject<{
    userId: import("@feathersjs/typebox").TString<string>;
    role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">]>;
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TLiteral<"pending">>;
    /** Optional message the applicant wants to include with their request */
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
}>;
export type RoleRequestData = Static<typeof roleRequestDataSchema>;
export declare const roleRequestDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const roleRequestDataResolver: import("@feathersjs/schema").Resolver<{
    message?: string | undefined;
    notes?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
    applicant?: any;
    profile?: any;
    documents?: any[] | undefined;
    _id: string | {};
    createdAt: string;
    userId: string;
    role: "landlord" | "property_manager" | "agent";
    status: "pending" | "approved" | "rejected";
}, HookContext>;
export declare const roleRequestPatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TOmit<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">]>;
    status: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"approved">, import("@feathersjs/typebox").TLiteral<"rejected">]>;
    /** Optional message / pitch from the applicant */
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    /** Virtual: basic applicant info (loaded via ?include=applicant). */
    applicant: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    /** Virtual: role-specific profile (loaded via ?include=profile). */
    profile: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    /** Virtual: verification documents tied to the applicant (loaded via ?include=documents). */
    documents: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
}>, ["_id", "userId", "role", "createdAt"]>>;
export type RoleRequestPatch = Static<typeof roleRequestPatchSchema>;
export declare const roleRequestPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const roleRequestPatchResolver: import("@feathersjs/schema").Resolver<{
    message?: string | undefined;
    notes?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
    applicant?: any;
    profile?: any;
    documents?: any[] | undefined;
    _id: string | {};
    createdAt: string;
    userId: string;
    role: "landlord" | "property_manager" | "agent";
    status: "pending" | "approved" | "rejected";
}, HookContext>;
export declare const roleRequestQuerySchema: import("@feathersjs/typebox").TObject<{}>;
export type RoleRequestQuery = Static<typeof roleRequestQuerySchema>;
export declare const roleRequestQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const roleRequestQueryResolver: import("@feathersjs/schema").Resolver<{}, HookContext>;
