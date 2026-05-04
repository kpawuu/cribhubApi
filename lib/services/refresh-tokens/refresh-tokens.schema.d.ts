import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
import type { RefreshTokensService } from './refresh-tokens.class';
export declare const refreshTokensSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    refreshToken: import("@feathersjs/typebox").TString<string>;
    isValid: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    deviceId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    dateCreated: import("@feathersjs/typebox").TString<"date-time">;
    dateUpdated: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    user: import("@feathersjs/typebox").TRef<import("@feathersjs/typebox").TObject<{
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
        emailNotifications: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
        files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
        roles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
        userRoles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TObject<{
            _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            userId: import("@feathersjs/typebox").TString<string>;
            role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
            createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
        }>>>;
    }>>;
}>;
export type RefreshTokens = Static<typeof refreshTokensSchema>;
export declare const refreshTokensValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const refreshTokensResolver: import("@feathersjs/schema").Resolver<{
    isValid?: boolean | undefined;
    deviceId?: string | undefined;
    dateUpdated?: string | undefined;
    _id: string | {};
    userId: string;
    user: {
        password?: string | undefined;
        files?: any[] | undefined;
        avatarUrl?: string | undefined;
        phone?: string | undefined;
        nationalId?: string | undefined;
        defaultCurrency?: string | undefined;
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
    };
    refreshToken: string;
    dateCreated: string;
}, HookContext<RefreshTokensService<import("./refresh-tokens.class").RefreshTokensParams>>>;
export declare const refreshTokensExternalResolver: import("@feathersjs/schema").Resolver<{
    isValid?: boolean | undefined;
    deviceId?: string | undefined;
    dateUpdated?: string | undefined;
    _id: string | {};
    userId: string;
    user: {
        password?: string | undefined;
        files?: any[] | undefined;
        avatarUrl?: string | undefined;
        phone?: string | undefined;
        nationalId?: string | undefined;
        defaultCurrency?: string | undefined;
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
    };
    refreshToken: string;
    dateCreated: string;
}, HookContext<RefreshTokensService<import("./refresh-tokens.class").RefreshTokensParams>>>;
export declare const refreshTokensDataSchema: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    refreshToken: import("@feathersjs/typebox").TString<string>;
    isValid: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    deviceId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    dateCreated: import("@feathersjs/typebox").TString<"date-time">;
    dateUpdated: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    user: import("@feathersjs/typebox").TRef<import("@feathersjs/typebox").TObject<{
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
        emailNotifications: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
        files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
        roles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
        userRoles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TObject<{
            _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            userId: import("@feathersjs/typebox").TString<string>;
            role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
            createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
        }>>>;
    }>>;
}>, ["userId", "isValid", "refreshToken"]>;
export type RefreshTokensData = Static<typeof refreshTokensDataSchema>;
export declare const refreshTokensDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const refreshTokensDataResolver: import("@feathersjs/schema").Resolver<{
    isValid?: boolean | undefined;
    deviceId?: string | undefined;
    dateUpdated?: string | undefined;
    _id: string | {};
    userId: string;
    user: {
        password?: string | undefined;
        files?: any[] | undefined;
        avatarUrl?: string | undefined;
        phone?: string | undefined;
        nationalId?: string | undefined;
        defaultCurrency?: string | undefined;
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
    };
    refreshToken: string;
    dateCreated: string;
}, HookContext<RefreshTokensService<import("./refresh-tokens.class").RefreshTokensParams>>>;
export declare const refreshTokensPatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    refreshToken: import("@feathersjs/typebox").TString<string>;
    isValid: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    deviceId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    dateCreated: import("@feathersjs/typebox").TString<"date-time">;
    dateUpdated: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    user: import("@feathersjs/typebox").TRef<import("@feathersjs/typebox").TObject<{
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
        emailNotifications: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
        files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
        roles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
        userRoles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TObject<{
            _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            userId: import("@feathersjs/typebox").TString<string>;
            role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
            createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
        }>>>;
    }>>;
}>>;
export type RefreshTokensPatch = Static<typeof refreshTokensPatchSchema>;
export declare const refreshTokensPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const refreshTokensPatchResolver: import("@feathersjs/schema").Resolver<{
    isValid?: boolean | undefined;
    deviceId?: string | undefined;
    dateUpdated?: string | undefined;
    _id: string | {};
    userId: string;
    user: {
        password?: string | undefined;
        files?: any[] | undefined;
        avatarUrl?: string | undefined;
        phone?: string | undefined;
        nationalId?: string | undefined;
        defaultCurrency?: string | undefined;
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
    };
    refreshToken: string;
    dateCreated: string;
}, HookContext<RefreshTokensService<import("./refresh-tokens.class").RefreshTokensParams>>>;
export declare const refreshTokensQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    refreshToken: import("@feathersjs/typebox").TString<string>;
    isValid: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    deviceId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    dateCreated: import("@feathersjs/typebox").TString<"date-time">;
    dateUpdated: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    user: import("@feathersjs/typebox").TRef<import("@feathersjs/typebox").TObject<{
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
        emailNotifications: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
        files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
        roles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
        userRoles: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TObject<{
            _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            userId: import("@feathersjs/typebox").TString<string>;
            role: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"tenant">, import("@feathersjs/typebox").TLiteral<"landlord">, import("@feathersjs/typebox").TLiteral<"property_manager">, import("@feathersjs/typebox").TLiteral<"agent">, import("@feathersjs/typebox").TLiteral<"admin">]>;
            createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
        }>>>;
    }>>;
}>, ["_id", "userId", "isValid", "refreshToken"]>;
export declare const refreshTokensQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    $limit: import("@feathersjs/typebox").TNumber;
    $skip: import("@feathersjs/typebox").TNumber;
    $sort: import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        userId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        refreshToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        isValid: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
    }>;
    $select: import("@feathersjs/typebox").TUnsafe<("_id" | "userId" | "refreshToken" | "isValid")[]>;
    $and: import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        userId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TString<string>;
            $gte: import("@feathersjs/typebox").TString<string>;
            $lt: import("@feathersjs/typebox").TString<string>;
            $lte: import("@feathersjs/typebox").TString<string>;
            $ne: import("@feathersjs/typebox").TString<string>;
            $in: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
            $nin: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        refreshToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TString<string>;
            $gte: import("@feathersjs/typebox").TString<string>;
            $lt: import("@feathersjs/typebox").TString<string>;
            $lte: import("@feathersjs/typebox").TString<string>;
            $ne: import("@feathersjs/typebox").TString<string>;
            $in: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
            $nin: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        isValid: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
    }>>, import("@feathersjs/typebox").TObject<{
        $or: import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
                $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
                $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
                $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
                $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
                $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>>;
                $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>>;
            }>, import("@feathersjs/typebox").TObject<{
                [key: string]: import("@feathersjs/typebox").TSchema;
            } | undefined>]>>]>>;
            userId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TString<string>;
                $gte: import("@feathersjs/typebox").TString<string>;
                $lt: import("@feathersjs/typebox").TString<string>;
                $lte: import("@feathersjs/typebox").TString<string>;
                $ne: import("@feathersjs/typebox").TString<string>;
                $in: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
                $nin: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
            }>, import("@feathersjs/typebox").TObject<{
                [key: string]: import("@feathersjs/typebox").TSchema;
            } | undefined>]>>]>>;
            refreshToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TString<string>;
                $gte: import("@feathersjs/typebox").TString<string>;
                $lt: import("@feathersjs/typebox").TString<string>;
                $lte: import("@feathersjs/typebox").TString<string>;
                $ne: import("@feathersjs/typebox").TString<string>;
                $in: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
                $nin: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
            }>, import("@feathersjs/typebox").TObject<{
                [key: string]: import("@feathersjs/typebox").TSchema;
            } | undefined>]>>]>>;
            isValid: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
                $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
                $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
                $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
                $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
                $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>>;
                $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>>;
            }>, import("@feathersjs/typebox").TObject<{
                [key: string]: import("@feathersjs/typebox").TSchema;
            } | undefined>]>>]>>;
        }>>>;
    }>]>>;
    $or: import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        userId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TString<string>;
            $gte: import("@feathersjs/typebox").TString<string>;
            $lt: import("@feathersjs/typebox").TString<string>;
            $lte: import("@feathersjs/typebox").TString<string>;
            $ne: import("@feathersjs/typebox").TString<string>;
            $in: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
            $nin: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        refreshToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TString<string>;
            $gte: import("@feathersjs/typebox").TString<string>;
            $lt: import("@feathersjs/typebox").TString<string>;
            $lte: import("@feathersjs/typebox").TString<string>;
            $ne: import("@feathersjs/typebox").TString<string>;
            $in: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
            $nin: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        isValid: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
    }>>>;
}>>, import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
        $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
        $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
        $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
        $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
        $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>>;
        $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
    userId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TString<string>;
        $gte: import("@feathersjs/typebox").TString<string>;
        $lt: import("@feathersjs/typebox").TString<string>;
        $lte: import("@feathersjs/typebox").TString<string>;
        $ne: import("@feathersjs/typebox").TString<string>;
        $in: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
        $nin: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
    refreshToken: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TString<string>;
        $gte: import("@feathersjs/typebox").TString<string>;
        $lt: import("@feathersjs/typebox").TString<string>;
        $lte: import("@feathersjs/typebox").TString<string>;
        $ne: import("@feathersjs/typebox").TString<string>;
        $in: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
        $nin: import("@feathersjs/typebox").TString<string> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
    isValid: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
        $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
        $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
        $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
        $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
        $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>>;
        $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
}>>]>, import("@feathersjs/typebox").TObject<{}>]>;
export type RefreshTokensQuery = Static<typeof refreshTokensQuerySchema>;
export declare const refreshTokensQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const refreshTokensQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
        userId?: number | undefined;
        refreshToken?: number | undefined;
        isValid?: number | undefined;
    };
    $select: ("_id" | "userId" | "refreshToken" | "isValid")[];
    $and: ({
        _id?: string | {} | Partial<{
            $gt: string | {};
            $gte: string | {};
            $lt: string | {};
            $lte: string | {};
            $ne: string | {};
            $in: string | {} | (string | {})[];
            $nin: string | {} | (string | {})[];
        } & {}> | undefined;
        userId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        refreshToken?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        isValid?: boolean | Partial<{
            $gt?: boolean | undefined;
            $gte?: boolean | undefined;
            $lt?: boolean | undefined;
            $lte?: boolean | undefined;
            $ne?: boolean | undefined;
            $in: boolean | boolean[];
            $nin: boolean | boolean[];
        } & {}> | undefined;
    } | {
        $or: {
            _id?: string | {} | Partial<{
                $gt: string | {};
                $gte: string | {};
                $lt: string | {};
                $lte: string | {};
                $ne: string | {};
                $in: string | {} | (string | {})[];
                $nin: string | {} | (string | {})[];
            } & {}> | undefined;
            userId?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            refreshToken?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            isValid?: boolean | Partial<{
                $gt?: boolean | undefined;
                $gte?: boolean | undefined;
                $lt?: boolean | undefined;
                $lte?: boolean | undefined;
                $ne?: boolean | undefined;
                $in: boolean | boolean[];
                $nin: boolean | boolean[];
            } & {}> | undefined;
        }[];
    })[];
    $or: {
        _id?: string | {} | Partial<{
            $gt: string | {};
            $gte: string | {};
            $lt: string | {};
            $lte: string | {};
            $ne: string | {};
            $in: string | {} | (string | {})[];
            $nin: string | {} | (string | {})[];
        } & {}> | undefined;
        userId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        refreshToken?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        isValid?: boolean | Partial<{
            $gt?: boolean | undefined;
            $gte?: boolean | undefined;
            $lt?: boolean | undefined;
            $lte?: boolean | undefined;
            $ne?: boolean | undefined;
            $in: boolean | boolean[];
            $nin: boolean | boolean[];
        } & {}> | undefined;
    }[];
}> & {
    _id?: string | {} | Partial<{
        $gt: string | {};
        $gte: string | {};
        $lt: string | {};
        $lte: string | {};
        $ne: string | {};
        $in: string | {} | (string | {})[];
        $nin: string | {} | (string | {})[];
    } & {}> | undefined;
    userId?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    refreshToken?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    isValid?: boolean | Partial<{
        $gt?: boolean | undefined;
        $gte?: boolean | undefined;
        $lt?: boolean | undefined;
        $lte?: boolean | undefined;
        $ne?: boolean | undefined;
        $in: boolean | boolean[];
        $nin: boolean | boolean[];
    } & {}> | undefined;
} & {}, HookContext<RefreshTokensService<import("./refresh-tokens.class").RefreshTokensParams>>>;
