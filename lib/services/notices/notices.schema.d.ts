import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
import type { NoticesService } from './notices.class';
export declare const noticeSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    landlordId: import("@feathersjs/typebox").TString<string>;
    title: import("@feathersjs/typebox").TString<string>;
    content: import("@feathersjs/typebox").TString<string>;
    type: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    author: import("@feathersjs/typebox").TString<string>;
    isManualEntry: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    smsSent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    smsRecipients: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>;
export type Notice = Static<typeof noticeSchema>;
export declare const noticeValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const noticeResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    type?: string | undefined;
    isManualEntry?: boolean | undefined;
    smsSent?: boolean | undefined;
    smsRecipients?: string[] | undefined;
    _id: string | {};
    createdAt: string;
    title: string;
    landlordId: string;
    content: string;
    author: string;
}, HookContext<NoticesService<import("./notices.class").NoticesParams>>>;
export declare const noticeExternalResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    type?: string | undefined;
    isManualEntry?: boolean | undefined;
    smsSent?: boolean | undefined;
    smsRecipients?: string[] | undefined;
    _id: string | {};
    createdAt: string;
    title: string;
    landlordId: string;
    content: string;
    author: string;
}, HookContext<NoticesService<import("./notices.class").NoticesParams>>>;
export declare const noticeDataSchema: import("@feathersjs/typebox").TObject<{
    /** Required for `property_manager` (and optional for `admin`) when posting on behalf of a landlord. */
    landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    title: import("@feathersjs/typebox").TString<string>;
    content: import("@feathersjs/typebox").TString<string>;
    type: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    author: import("@feathersjs/typebox").TString<string>;
    isManualEntry: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    smsRecipients: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
}>;
export type NoticeData = Static<typeof noticeDataSchema>;
export declare const noticeDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const noticeDataResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    type?: string | undefined;
    isManualEntry?: boolean | undefined;
    smsSent?: boolean | undefined;
    smsRecipients?: string[] | undefined;
    _id: string | {};
    createdAt: string;
    title: string;
    landlordId: string;
    content: string;
    author: string;
}, HookContext<NoticesService<import("./notices.class").NoticesParams>>>;
export declare const noticePatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TOmit<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    landlordId: import("@feathersjs/typebox").TString<string>;
    title: import("@feathersjs/typebox").TString<string>;
    content: import("@feathersjs/typebox").TString<string>;
    type: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    author: import("@feathersjs/typebox").TString<string>;
    isManualEntry: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    smsSent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    smsRecipients: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "landlordId", "createdAt"]>>;
export type NoticePatch = Static<typeof noticePatchSchema>;
export declare const noticePatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const noticePatchResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    type?: string | undefined;
    isManualEntry?: boolean | undefined;
    smsSent?: boolean | undefined;
    smsRecipients?: string[] | undefined;
    _id: string | {};
    createdAt: string;
    title: string;
    landlordId: string;
    content: string;
    author: string;
}, HookContext<NoticesService<import("./notices.class").NoticesParams>>>;
export declare const noticeQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    landlordId: import("@feathersjs/typebox").TString<string>;
    title: import("@feathersjs/typebox").TString<string>;
    content: import("@feathersjs/typebox").TString<string>;
    type: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    author: import("@feathersjs/typebox").TString<string>;
    isManualEntry: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    smsSent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    smsRecipients: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "landlordId", "type", "smsSent", "createdAt", "updatedAt"]>;
export declare const noticeQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    $limit: import("@feathersjs/typebox").TNumber;
    $skip: import("@feathersjs/typebox").TNumber;
    $sort: import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        type: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        smsSent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
    }>;
    $select: import("@feathersjs/typebox").TUnsafe<("_id" | "createdAt" | "updatedAt" | "landlordId" | "type" | "smsSent")[]>;
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
        type: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        smsSent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            type: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            smsSent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        type: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        smsSent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    type: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    smsSent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
export type NoticeQuery = Static<typeof noticeQuerySchema>;
export declare const noticeQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const noticeQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
        landlordId?: number | undefined;
        type?: number | undefined;
        smsSent?: number | undefined;
    };
    $select: ("_id" | "createdAt" | "updatedAt" | "landlordId" | "type" | "smsSent")[];
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
        landlordId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        type?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        smsSent?: boolean | Partial<{
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
            landlordId?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            type?: string | Partial<{
                $gt?: string | undefined;
                $gte?: string | undefined;
                $lt?: string | undefined;
                $lte?: string | undefined;
                $ne?: string | undefined;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            smsSent?: boolean | Partial<{
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
        landlordId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        type?: string | Partial<{
            $gt?: string | undefined;
            $gte?: string | undefined;
            $lt?: string | undefined;
            $lte?: string | undefined;
            $ne?: string | undefined;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        smsSent?: boolean | Partial<{
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
    landlordId?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    type?: string | Partial<{
        $gt?: string | undefined;
        $gte?: string | undefined;
        $lt?: string | undefined;
        $lte?: string | undefined;
        $ne?: string | undefined;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    smsSent?: boolean | Partial<{
        $gt?: boolean | undefined;
        $gte?: boolean | undefined;
        $lt?: boolean | undefined;
        $lte?: boolean | undefined;
        $ne?: boolean | undefined;
        $in: boolean | boolean[];
        $nin: boolean | boolean[];
    } & {}> | undefined;
} & {}, HookContext<NoticesService<import("./notices.class").NoticesParams>>>;
