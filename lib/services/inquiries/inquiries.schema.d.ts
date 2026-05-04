import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
export declare const inquirySchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    unitId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    createdByUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    name: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    email: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"email">>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    contactMethod: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"call">, import("@feathersjs/typebox").TLiteral<"email">, import("@feathersjs/typebox").TLiteral<"whatsapp">, import("@feathersjs/typebox").TLiteral<"message">]>>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>;
export type Inquiry = Static<typeof inquirySchema>;
export declare const inquiryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const inquiryResolver: import("@feathersjs/schema").Resolver<{
    email?: string | undefined;
    phone?: string | undefined;
    updatedAt?: string | undefined;
    message?: string | undefined;
    status?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
    landlordId?: string | undefined;
    agentUserId?: string | undefined;
    name?: string | undefined;
    unitId?: string | undefined;
    createdByUserId?: string | undefined;
    contactMethod?: "email" | "message" | "whatsapp" | "call" | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
}, HookContext>;
export declare const inquiryExternalResolver: import("@feathersjs/schema").Resolver<{
    email?: string | undefined;
    phone?: string | undefined;
    updatedAt?: string | undefined;
    message?: string | undefined;
    status?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
    landlordId?: string | undefined;
    agentUserId?: string | undefined;
    name?: string | undefined;
    unitId?: string | undefined;
    createdByUserId?: string | undefined;
    contactMethod?: "email" | "message" | "whatsapp" | "call" | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
}, HookContext>;
export declare const inquiryDataSchema: import("@feathersjs/typebox").TObject<{
    propertyId: import("@feathersjs/typebox").TString<string>;
    unitId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    name: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    email: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"email">>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    contactMethod: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"call">, import("@feathersjs/typebox").TLiteral<"email">, import("@feathersjs/typebox").TLiteral<"whatsapp">, import("@feathersjs/typebox").TLiteral<"message">]>>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
}>;
export type InquiryData = Static<typeof inquiryDataSchema>;
export declare const inquiryDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const inquiryDataResolver: import("@feathersjs/schema").Resolver<{
    email?: string | undefined;
    phone?: string | undefined;
    updatedAt?: string | undefined;
    message?: string | undefined;
    status?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
    landlordId?: string | undefined;
    agentUserId?: string | undefined;
    name?: string | undefined;
    unitId?: string | undefined;
    createdByUserId?: string | undefined;
    contactMethod?: "email" | "message" | "whatsapp" | "call" | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
}, HookContext>;
export declare const inquiryPatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
}>>;
export type InquiryPatch = Static<typeof inquiryPatchSchema>;
export declare const inquiryPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const inquiryPatchResolver: import("@feathersjs/schema").Resolver<{
    email?: string | undefined;
    phone?: string | undefined;
    updatedAt?: string | undefined;
    message?: string | undefined;
    status?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
    landlordId?: string | undefined;
    agentUserId?: string | undefined;
    name?: string | undefined;
    unitId?: string | undefined;
    createdByUserId?: string | undefined;
    contactMethod?: "email" | "message" | "whatsapp" | "call" | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
}, HookContext>;
export declare const inquiryQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    unitId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    createdByUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    name: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    email: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"email">>;
    phone: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    contactMethod: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"call">, import("@feathersjs/typebox").TLiteral<"email">, import("@feathersjs/typebox").TLiteral<"whatsapp">, import("@feathersjs/typebox").TLiteral<"message">]>>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "propertyId", "agentUserId", "landlordId", "status", "createdAt", "updatedAt"]>;
export declare const inquiryQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    $limit: import("@feathersjs/typebox").TNumber;
    $skip: import("@feathersjs/typebox").TNumber;
    $sort: import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        propertyId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
    }>;
    $select: import("@feathersjs/typebox").TUnsafe<("_id" | "createdAt" | "updatedAt" | "status" | "propertyId" | "landlordId" | "agentUserId")[]>;
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>>;
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
        landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
                $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
                $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
                $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
                $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
                $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>>;
                $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>>;
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
            landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>>;
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
        landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
        $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
        $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
        $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
        $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>;
        $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>>;
        $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"new">, import("@feathersjs/typebox").TLiteral<"contacted">, import("@feathersjs/typebox").TLiteral<"viewing_scheduled">, import("@feathersjs/typebox").TLiteral<"closed">, import("@feathersjs/typebox").TLiteral<"lost">]>>>;
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
    landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
export type InquiryQuery = Static<typeof inquiryQuerySchema>;
export declare const inquiryQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const inquiryQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
        status?: number | undefined;
        propertyId?: number | undefined;
        landlordId?: number | undefined;
        agentUserId?: number | undefined;
    };
    $select: ("_id" | "createdAt" | "updatedAt" | "status" | "propertyId" | "landlordId" | "agentUserId")[];
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
        status?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | Partial<{
            $gt?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $gte?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $lt?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $lte?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $ne?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $in: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | ("closed" | "new" | "contacted" | "viewing_scheduled" | "lost")[];
            $nin: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | ("closed" | "new" | "contacted" | "viewing_scheduled" | "lost")[];
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
        landlordId?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        agentUserId?: string | Partial<{
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
            updatedAt?: string | Partial<{
                $gt?: string | undefined;
                $gte?: string | undefined;
                $lt?: string | undefined;
                $lte?: string | undefined;
                $ne?: string | undefined;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            status?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | Partial<{
                $gt?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
                $gte?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
                $lt?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
                $lte?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
                $ne?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
                $in: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | ("closed" | "new" | "contacted" | "viewing_scheduled" | "lost")[];
                $nin: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | ("closed" | "new" | "contacted" | "viewing_scheduled" | "lost")[];
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
            landlordId?: string | Partial<{
                $gt?: string | undefined;
                $gte?: string | undefined;
                $lt?: string | undefined;
                $lte?: string | undefined;
                $ne?: string | undefined;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            agentUserId?: string | Partial<{
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
        updatedAt?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        status?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | Partial<{
            $gt?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $gte?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $lt?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $lte?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $ne?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
            $in: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | ("closed" | "new" | "contacted" | "viewing_scheduled" | "lost")[];
            $nin: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | ("closed" | "new" | "contacted" | "viewing_scheduled" | "lost")[];
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
        landlordId?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        agentUserId?: string | Partial<{
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
    updatedAt?: string | Partial<{
        $gt?: string | undefined;
        $gte?: string | undefined;
        $lt?: string | undefined;
        $lte?: string | undefined;
        $ne?: string | undefined;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    status?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | Partial<{
        $gt?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
        $gte?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
        $lt?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
        $lte?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
        $ne?: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | undefined;
        $in: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | ("closed" | "new" | "contacted" | "viewing_scheduled" | "lost")[];
        $nin: "closed" | "new" | "contacted" | "viewing_scheduled" | "lost" | ("closed" | "new" | "contacted" | "viewing_scheduled" | "lost")[];
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
    landlordId?: string | Partial<{
        $gt?: string | undefined;
        $gte?: string | undefined;
        $lt?: string | undefined;
        $lte?: string | undefined;
        $ne?: string | undefined;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    agentUserId?: string | Partial<{
        $gt?: string | undefined;
        $gte?: string | undefined;
        $lt?: string | undefined;
        $lte?: string | undefined;
        $ne?: string | undefined;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
} & {}, HookContext>;
