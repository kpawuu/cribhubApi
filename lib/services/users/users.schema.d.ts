import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
/**
 * Important: `feathers-authentication-management` writes these fields onto the user record.
 * They must exist in the schema when `additionalProperties: false`.
 */
/** Related `user-roles` rows (virtual — not stored on the user document). */
export declare const userRoleRelationSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    userId: import("@feathersjs/typebox").TString<string>;
    role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
    createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>;
export declare const userSchema: import("@feathersjs/typebox").TObject<{
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    isVerified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    verifyToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    verifyShortToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    verifyExpires: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    verifyChanges: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    resetToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    resetShortToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    resetExpires: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    resetAttempts: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    email: import("@feathersjs/typebox").TString<"email">;
    password: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    fullName: import("@feathersjs/typebox").TString<string>;
    avatarUrl: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    nationalId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    defaultCurrency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    /** Set to true once the user completes the onboarding role-selection step. */
    isOnboarded: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    /** Arbitrary onboarding preferences stored per role (tenant prefs, landlord details, etc.) */
    onboarding: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{}>>;
    /** When false, in-app notifications are still created but notification emails are skipped. */
    emailNotifications: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
    /** Role names (virtual — from `user-roles`). */
    roles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    /** Related role rows (virtual — from `user-roles`). */
    userRoles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        userId: import("@feathersjs/typebox").TString<string>;
        role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    }>>>;
}>;
export type User = Static<typeof userSchema>;
export declare const userValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const userResolver: import("@feathersjs/schema").Resolver<{
    password?: string | undefined;
    files?: any[] | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    nationalId?: string | undefined;
    defaultCurrency?: string | undefined;
    isOnboarded?: boolean | undefined;
    onboarding?: {} | undefined;
    emailNotifications?: boolean | undefined;
    roles?: string[] | undefined;
    userRoles?: {
        _id?: string | undefined;
        createdAt?: string | undefined;
        userId: string;
        role: "tenant" | "landlord" | "property_manager" | "agent" | "admin";
    }[] | undefined;
    updatedAt?: string | undefined;
    isVerified?: boolean | undefined;
    verifyToken?: any;
    verifyShortToken?: any;
    verifyExpires?: any;
    verifyChanges?: any;
    resetToken?: any;
    resetShortToken?: any;
    resetExpires?: any;
    resetAttempts?: any;
    email: string;
    _id: string | {};
    createdAt: string;
    fullName: string;
}, HookContext>;
export declare const userExternalResolver: import("@feathersjs/schema").Resolver<{
    password?: string | undefined;
    files?: any[] | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    nationalId?: string | undefined;
    defaultCurrency?: string | undefined;
    isOnboarded?: boolean | undefined;
    onboarding?: {} | undefined;
    emailNotifications?: boolean | undefined;
    roles?: string[] | undefined;
    userRoles?: {
        _id?: string | undefined;
        createdAt?: string | undefined;
        userId: string;
        role: "tenant" | "landlord" | "property_manager" | "agent" | "admin";
    }[] | undefined;
    updatedAt?: string | undefined;
    isVerified?: boolean | undefined;
    verifyToken?: any;
    verifyShortToken?: any;
    verifyExpires?: any;
    verifyChanges?: any;
    resetToken?: any;
    resetShortToken?: any;
    resetExpires?: any;
    resetAttempts?: any;
    email: string;
    _id: string | {};
    createdAt: string;
    fullName: string;
}, HookContext>;
export declare const userDataSchema: import("@feathersjs/typebox").TObject<{
    email: import("@feathersjs/typebox").TString<"email">;
    password: import("@feathersjs/typebox").TString<string>;
    fullName: import("@feathersjs/typebox").TString<string>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    nationalId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    defaultCurrency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    requestedRole: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">]>>;
}>;
export type UserData = Static<typeof userDataSchema>;
export declare const userDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const userDataResolver: import("@feathersjs/schema").Resolver<{
    password?: string | undefined;
    files?: any[] | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    nationalId?: string | undefined;
    defaultCurrency?: string | undefined;
    isOnboarded?: boolean | undefined;
    onboarding?: {} | undefined;
    emailNotifications?: boolean | undefined;
    roles?: string[] | undefined;
    userRoles?: {
        _id?: string | undefined;
        createdAt?: string | undefined;
        userId: string;
        role: "tenant" | "landlord" | "property_manager" | "agent" | "admin";
    }[] | undefined;
    updatedAt?: string | undefined;
    isVerified?: boolean | undefined;
    verifyToken?: any;
    verifyShortToken?: any;
    verifyExpires?: any;
    verifyChanges?: any;
    resetToken?: any;
    resetShortToken?: any;
    resetExpires?: any;
    resetAttempts?: any;
    email: string;
    _id: string | {};
    createdAt: string;
    fullName: string;
}, HookContext>;
export declare const userPatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TOmit<import("@feathersjs/typebox").TObject<{
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    isVerified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    verifyToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    verifyShortToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    verifyExpires: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    verifyChanges: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    resetToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    resetShortToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    resetExpires: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    resetAttempts: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    email: import("@feathersjs/typebox").TString<"email">;
    password: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    fullName: import("@feathersjs/typebox").TString<string>;
    avatarUrl: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    nationalId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    defaultCurrency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    /** Set to true once the user completes the onboarding role-selection step. */
    isOnboarded: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    /** Arbitrary onboarding preferences stored per role (tenant prefs, landlord details, etc.) */
    onboarding: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{}>>;
    /** When false, in-app notifications are still created but notification emails are skipped. */
    emailNotifications: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
    /** Role names (virtual — from `user-roles`). */
    roles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    /** Related role rows (virtual — from `user-roles`). */
    userRoles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        userId: import("@feathersjs/typebox").TString<string>;
        role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    }>>>;
}>, ["_id", "createdAt", "roles", "userRoles"]>>;
export type UserPatch = Static<typeof userPatchSchema>;
export declare const userPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const userPatchResolver: import("@feathersjs/schema").Resolver<{
    password?: string | undefined;
    files?: any[] | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    nationalId?: string | undefined;
    defaultCurrency?: string | undefined;
    isOnboarded?: boolean | undefined;
    onboarding?: {} | undefined;
    emailNotifications?: boolean | undefined;
    roles?: string[] | undefined;
    userRoles?: {
        _id?: string | undefined;
        createdAt?: string | undefined;
        userId: string;
        role: "tenant" | "landlord" | "property_manager" | "agent" | "admin";
    }[] | undefined;
    updatedAt?: string | undefined;
    isVerified?: boolean | undefined;
    verifyToken?: any;
    verifyShortToken?: any;
    verifyExpires?: any;
    verifyChanges?: any;
    resetToken?: any;
    resetShortToken?: any;
    resetExpires?: any;
    resetAttempts?: any;
    email: string;
    _id: string | {};
    createdAt: string;
    fullName: string;
}, HookContext>;
export declare const userQuerySchema: import("@feathersjs/typebox").TObject<{}>;
export type UserQuery = Static<typeof userQuerySchema>;
export declare const userQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const userQueryResolver: import("@feathersjs/schema").Resolver<{}, HookContext>;
