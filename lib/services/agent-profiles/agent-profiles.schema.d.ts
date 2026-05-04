import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
export declare const agentProfileSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    displayName: import("@feathersjs/typebox").TString<string>;
    agency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    whatsapp: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    emailPublic: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"email">>;
    bio: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    regions: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    languages: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    avatarUrl: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    listingsCount: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    responseTimeMinutes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    verified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>;
export type AgentProfile = Static<typeof agentProfileSchema>;
export declare const agentProfileValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentProfileResolver: import("@feathersjs/schema").Resolver<{
    files?: any[] | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    updatedAt?: string | undefined;
    verified?: boolean | undefined;
    agency?: string | undefined;
    listingsCount?: number | undefined;
    responseTimeMinutes?: number | undefined;
    whatsapp?: string | undefined;
    emailPublic?: string | undefined;
    bio?: string | undefined;
    regions?: string[] | undefined;
    languages?: string[] | undefined;
    _id: string | {};
    createdAt: string;
    userId: string;
    displayName: string;
}, HookContext>;
export declare const agentProfileExternalResolver: import("@feathersjs/schema").Resolver<{
    files?: any[] | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    updatedAt?: string | undefined;
    verified?: boolean | undefined;
    agency?: string | undefined;
    listingsCount?: number | undefined;
    responseTimeMinutes?: number | undefined;
    whatsapp?: string | undefined;
    emailPublic?: string | undefined;
    bio?: string | undefined;
    regions?: string[] | undefined;
    languages?: string[] | undefined;
    _id: string | {};
    createdAt: string;
    userId: string;
    displayName: string;
}, HookContext>;
export declare const agentProfileDataSchema: import("@feathersjs/typebox").TObject<{
    displayName: import("@feathersjs/typebox").TString<string>;
    agency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    whatsapp: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    emailPublic: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"email">>;
    bio: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    regions: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    languages: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    avatarUrl: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    listingsCount: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    responseTimeMinutes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
}>;
export type AgentProfileData = Static<typeof agentProfileDataSchema>;
export declare const agentProfileDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentProfileDataResolver: import("@feathersjs/schema").Resolver<{
    files?: any[] | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    updatedAt?: string | undefined;
    verified?: boolean | undefined;
    agency?: string | undefined;
    listingsCount?: number | undefined;
    responseTimeMinutes?: number | undefined;
    whatsapp?: string | undefined;
    emailPublic?: string | undefined;
    bio?: string | undefined;
    regions?: string[] | undefined;
    languages?: string[] | undefined;
    _id: string | {};
    createdAt: string;
    userId: string;
    displayName: string;
}, HookContext>;
export declare const agentProfilePatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TOmit<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    displayName: import("@feathersjs/typebox").TString<string>;
    agency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    whatsapp: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    emailPublic: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"email">>;
    bio: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    regions: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    languages: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    avatarUrl: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    listingsCount: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    responseTimeMinutes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    verified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "userId", "createdAt"]>>;
export type AgentProfilePatch = Static<typeof agentProfilePatchSchema>;
export declare const agentProfilePatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentProfilePatchResolver: import("@feathersjs/schema").Resolver<{
    files?: any[] | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    updatedAt?: string | undefined;
    verified?: boolean | undefined;
    agency?: string | undefined;
    listingsCount?: number | undefined;
    responseTimeMinutes?: number | undefined;
    whatsapp?: string | undefined;
    emailPublic?: string | undefined;
    bio?: string | undefined;
    regions?: string[] | undefined;
    languages?: string[] | undefined;
    _id: string | {};
    createdAt: string;
    userId: string;
    displayName: string;
}, HookContext>;
export declare const agentProfileQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    userId: import("@feathersjs/typebox").TString<string>;
    displayName: import("@feathersjs/typebox").TString<string>;
    agency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    whatsapp: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    emailPublic: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"email">>;
    bio: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    regions: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    languages: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    avatarUrl: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    listingsCount: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    responseTimeMinutes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    verified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "userId", "agency", "verified", "createdAt", "updatedAt"]>;
export declare const agentProfileQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    $limit: import("@feathersjs/typebox").TNumber;
    $skip: import("@feathersjs/typebox").TNumber;
    $sort: import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        userId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        verified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        agency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
    }>;
    $select: import("@feathersjs/typebox").TUnsafe<("_id" | "createdAt" | "userId" | "updatedAt" | "verified" | "agency")[]>;
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
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<"date-time">, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TString<"date-time">;
            $gte: import("@feathersjs/typebox").TString<"date-time">;
            $lt: import("@feathersjs/typebox").TString<"date-time">;
            $lte: import("@feathersjs/typebox").TString<"date-time">;
            $ne: import("@feathersjs/typebox").TString<"date-time">;
            $in: import("@feathersjs/typebox").TString<"date-time"> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<"date-time">>;
            $nin: import("@feathersjs/typebox").TString<"date-time"> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<"date-time">>;
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
        updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        verified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        agency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>>;
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
            createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<"date-time">, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TString<"date-time">;
                $gte: import("@feathersjs/typebox").TString<"date-time">;
                $lt: import("@feathersjs/typebox").TString<"date-time">;
                $lte: import("@feathersjs/typebox").TString<"date-time">;
                $ne: import("@feathersjs/typebox").TString<"date-time">;
                $in: import("@feathersjs/typebox").TString<"date-time"> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<"date-time">>;
                $nin: import("@feathersjs/typebox").TString<"date-time"> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<"date-time">>;
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
            updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
                $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
                $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
                $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
                $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
                $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>>;
                $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>>;
            }>, import("@feathersjs/typebox").TObject<{
                [key: string]: import("@feathersjs/typebox").TSchema;
            } | undefined>]>>]>>;
            verified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            agency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
                $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
                $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
                $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
                $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
                $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>>;
                $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>>;
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
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<"date-time">, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TString<"date-time">;
            $gte: import("@feathersjs/typebox").TString<"date-time">;
            $lt: import("@feathersjs/typebox").TString<"date-time">;
            $lte: import("@feathersjs/typebox").TString<"date-time">;
            $ne: import("@feathersjs/typebox").TString<"date-time">;
            $in: import("@feathersjs/typebox").TString<"date-time"> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<"date-time">>;
            $nin: import("@feathersjs/typebox").TString<"date-time"> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<"date-time">>;
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
        updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        verified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        agency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>>;
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
    createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<"date-time">, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TString<"date-time">;
        $gte: import("@feathersjs/typebox").TString<"date-time">;
        $lt: import("@feathersjs/typebox").TString<"date-time">;
        $lte: import("@feathersjs/typebox").TString<"date-time">;
        $ne: import("@feathersjs/typebox").TString<"date-time">;
        $in: import("@feathersjs/typebox").TString<"date-time"> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<"date-time">>;
        $nin: import("@feathersjs/typebox").TString<"date-time"> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<"date-time">>;
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
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
        $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
        $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
        $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
        $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
        $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>>;
        $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
    verified: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    agency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>>;
        $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
}>>]>, import("@feathersjs/typebox").TObject<{}>]>;
export type AgentProfileQuery = Static<typeof agentProfileQuerySchema>;
export declare const agentProfileQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentProfileQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
        createdAt?: number | undefined;
        userId?: number | undefined;
        updatedAt?: number | undefined;
        verified?: number | undefined;
        agency?: number | undefined;
    };
    $select: ("_id" | "createdAt" | "userId" | "updatedAt" | "verified" | "agency")[];
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
        createdAt?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
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
        updatedAt?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        verified?: boolean | Partial<{
            $gt?: boolean | undefined;
            $gte?: boolean | undefined;
            $lt?: boolean | undefined;
            $lte?: boolean | undefined;
            $ne?: boolean | undefined;
            $in: boolean | boolean[];
            $nin: boolean | boolean[];
        } & {}> | undefined;
        agency?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
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
            createdAt?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
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
            updatedAt?: string | Partial<{
                $gt?: string | undefined;
                $gte?: string | undefined;
                $lt?: string | undefined;
                $lte?: string | undefined;
                $ne?: string | undefined;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            verified?: boolean | Partial<{
                $gt?: boolean | undefined;
                $gte?: boolean | undefined;
                $lt?: boolean | undefined;
                $lte?: boolean | undefined;
                $ne?: boolean | undefined;
                $in: boolean | boolean[];
                $nin: boolean | boolean[];
            } & {}> | undefined;
            agency?: string | Partial<{
                $gt?: string | undefined;
                $gte?: string | undefined;
                $lt?: string | undefined;
                $lte?: string | undefined;
                $ne?: string | undefined;
                $in: string | string[];
                $nin: string | string[];
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
        createdAt?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
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
        updatedAt?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        verified?: boolean | Partial<{
            $gt?: boolean | undefined;
            $gte?: boolean | undefined;
            $lt?: boolean | undefined;
            $lte?: boolean | undefined;
            $ne?: boolean | undefined;
            $in: boolean | boolean[];
            $nin: boolean | boolean[];
        } & {}> | undefined;
        agency?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
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
    createdAt?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
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
    updatedAt?: string | Partial<{
        $gt?: string | undefined;
        $gte?: string | undefined;
        $lt?: string | undefined;
        $lte?: string | undefined;
        $ne?: string | undefined;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    verified?: boolean | Partial<{
        $gt?: boolean | undefined;
        $gte?: boolean | undefined;
        $lt?: boolean | undefined;
        $lte?: boolean | undefined;
        $ne?: boolean | undefined;
        $in: boolean | boolean[];
        $nin: boolean | boolean[];
    } & {}> | undefined;
    agency?: string | Partial<{
        $gt?: string | undefined;
        $gte?: string | undefined;
        $lt?: string | undefined;
        $lte?: string | undefined;
        $ne?: string | undefined;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
} & {}, HookContext>;
