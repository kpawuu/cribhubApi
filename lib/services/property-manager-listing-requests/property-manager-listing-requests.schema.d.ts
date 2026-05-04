import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
export declare const pmListingRequestStatusSchema: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
export declare const propertyManagerListingRequestSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    managerUserId: import("@feathersjs/typebox").TString<string>;
    landlordId: import("@feathersjs/typebox").TString<string>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
    reviewedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>;
export type PropertyManagerListingRequest = Static<typeof propertyManagerListingRequestSchema>;
export declare const propertyManagerListingRequestValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const propertyManagerListingRequestResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    message?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
    _id: string | {};
    createdAt: string;
    status: "pending" | "rejected" | "accepted" | "withdrawn";
    propertyId: string;
    managerUserId: string;
    landlordId: string;
}, HookContext>;
export declare const propertyManagerListingRequestExternalResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    message?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
    _id: string | {};
    createdAt: string;
    status: "pending" | "rejected" | "accepted" | "withdrawn";
    propertyId: string;
    managerUserId: string;
    landlordId: string;
}, HookContext>;
export declare const propertyManagerListingRequestDataSchema: import("@feathersjs/typebox").TObject<{
    propertyId: import("@feathersjs/typebox").TString<string>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    /** Admin-only: create on behalf of this manager user. */
    managerUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
}>;
export type PropertyManagerListingRequestData = Static<typeof propertyManagerListingRequestDataSchema>;
export declare const propertyManagerListingRequestDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const propertyManagerListingRequestDataResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    message?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
    _id: string | {};
    createdAt: string;
    status: "pending" | "rejected" | "accepted" | "withdrawn";
    propertyId: string;
    managerUserId: string;
    landlordId: string;
}, HookContext>;
export declare const propertyManagerListingRequestPatchSchema: import("@feathersjs/typebox").TObject<{
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
    reviewedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>;
export type PropertyManagerListingRequestPatch = Static<typeof propertyManagerListingRequestPatchSchema>;
export declare const propertyManagerListingRequestPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const propertyManagerListingRequestPatchResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    status?: "rejected" | "accepted" | "withdrawn" | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
}, HookContext>;
export declare const propertyManagerListingRequestQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    managerUserId: import("@feathersjs/typebox").TString<string>;
    landlordId: import("@feathersjs/typebox").TString<string>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
    reviewedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "propertyId", "managerUserId", "landlordId", "status", "createdAt", "updatedAt"]>;
export declare const propertyManagerListingRequestQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    $limit: import("@feathersjs/typebox").TNumber;
    $skip: import("@feathersjs/typebox").TNumber;
    $sort: import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        propertyId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        managerUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
    }>;
    $select: import("@feathersjs/typebox").TUnsafe<("_id" | "createdAt" | "updatedAt" | "status" | "propertyId" | "managerUserId" | "landlordId")[]>;
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        propertyId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        managerUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
                $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
            }>, import("@feathersjs/typebox").TObject<{
                [key: string]: import("@feathersjs/typebox").TSchema;
            } | undefined>]>>]>>;
            propertyId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            managerUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        propertyId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        managerUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
        $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
    propertyId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    managerUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
}>>]>, import("@feathersjs/typebox").TObject<{}>]>;
export type PropertyManagerListingRequestQuery = Static<typeof propertyManagerListingRequestQuerySchema>;
export declare const propertyManagerListingRequestQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const propertyManagerListingRequestQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
        status?: number | undefined;
        propertyId?: number | undefined;
        managerUserId?: number | undefined;
        landlordId?: number | undefined;
    };
    $select: ("_id" | "createdAt" | "updatedAt" | "status" | "propertyId" | "managerUserId" | "landlordId")[];
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
        updatedAt?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        status?: "pending" | "rejected" | "accepted" | "withdrawn" | Partial<{
            $gt: "pending" | "rejected" | "accepted" | "withdrawn";
            $gte: "pending" | "rejected" | "accepted" | "withdrawn";
            $lt: "pending" | "rejected" | "accepted" | "withdrawn";
            $lte: "pending" | "rejected" | "accepted" | "withdrawn";
            $ne: "pending" | "rejected" | "accepted" | "withdrawn";
            $in: "pending" | "rejected" | "accepted" | "withdrawn" | ("pending" | "rejected" | "accepted" | "withdrawn")[];
            $nin: "pending" | "rejected" | "accepted" | "withdrawn" | ("pending" | "rejected" | "accepted" | "withdrawn")[];
        } & {}> | undefined;
        propertyId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        managerUserId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        landlordId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
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
            updatedAt?: string | Partial<{
                $gt?: string | undefined;
                $gte?: string | undefined;
                $lt?: string | undefined;
                $lte?: string | undefined;
                $ne?: string | undefined;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            status?: "pending" | "rejected" | "accepted" | "withdrawn" | Partial<{
                $gt: "pending" | "rejected" | "accepted" | "withdrawn";
                $gte: "pending" | "rejected" | "accepted" | "withdrawn";
                $lt: "pending" | "rejected" | "accepted" | "withdrawn";
                $lte: "pending" | "rejected" | "accepted" | "withdrawn";
                $ne: "pending" | "rejected" | "accepted" | "withdrawn";
                $in: "pending" | "rejected" | "accepted" | "withdrawn" | ("pending" | "rejected" | "accepted" | "withdrawn")[];
                $nin: "pending" | "rejected" | "accepted" | "withdrawn" | ("pending" | "rejected" | "accepted" | "withdrawn")[];
            } & {}> | undefined;
            propertyId?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            managerUserId?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            landlordId?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
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
        updatedAt?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        status?: "pending" | "rejected" | "accepted" | "withdrawn" | Partial<{
            $gt: "pending" | "rejected" | "accepted" | "withdrawn";
            $gte: "pending" | "rejected" | "accepted" | "withdrawn";
            $lt: "pending" | "rejected" | "accepted" | "withdrawn";
            $lte: "pending" | "rejected" | "accepted" | "withdrawn";
            $ne: "pending" | "rejected" | "accepted" | "withdrawn";
            $in: "pending" | "rejected" | "accepted" | "withdrawn" | ("pending" | "rejected" | "accepted" | "withdrawn")[];
            $nin: "pending" | "rejected" | "accepted" | "withdrawn" | ("pending" | "rejected" | "accepted" | "withdrawn")[];
        } & {}> | undefined;
        propertyId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        managerUserId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        landlordId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
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
    updatedAt?: string | Partial<{
        $gt?: string | undefined;
        $gte?: string | undefined;
        $lt?: string | undefined;
        $lte?: string | undefined;
        $ne?: string | undefined;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    status?: "pending" | "rejected" | "accepted" | "withdrawn" | Partial<{
        $gt: "pending" | "rejected" | "accepted" | "withdrawn";
        $gte: "pending" | "rejected" | "accepted" | "withdrawn";
        $lt: "pending" | "rejected" | "accepted" | "withdrawn";
        $lte: "pending" | "rejected" | "accepted" | "withdrawn";
        $ne: "pending" | "rejected" | "accepted" | "withdrawn";
        $in: "pending" | "rejected" | "accepted" | "withdrawn" | ("pending" | "rejected" | "accepted" | "withdrawn")[];
        $nin: "pending" | "rejected" | "accepted" | "withdrawn" | ("pending" | "rejected" | "accepted" | "withdrawn")[];
    } & {}> | undefined;
    propertyId?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    managerUserId?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    landlordId?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
} & {}, HookContext>;
