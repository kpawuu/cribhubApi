import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
/** Inline union only — do not set `$id` here or Ajv sees duplicate refs when this is embedded in SitePage, SitePageData, and SitePagePatch. */
export declare const sitePageSectionSchema: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
export declare const sitePageStatusSchema: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
export declare const sitePageSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    slug: import("@feathersjs/typebox").TString<string>;
    title: import("@feathersjs/typebox").TString<string>;
    body: import("@feathersjs/typebox").TString<string>;
    section: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
    status: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
    metaTitle: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    metaDescription: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    publishedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>;
export type SitePage = Static<typeof sitePageSchema>;
export declare const sitePageValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const sitePageResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    publishedAt?: string | undefined;
    _id: string | {};
    createdAt: string;
    status: "draft" | "published";
    title: string;
    body: string;
    slug: string;
    section: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
}, HookContext>;
export declare const sitePageExternalResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    publishedAt?: string | undefined;
    _id: string | {};
    createdAt: string;
    status: "draft" | "published";
    title: string;
    body: string;
    slug: string;
    section: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
}, HookContext>;
export declare const sitePageDataSchema: import("@feathersjs/typebox").TObject<{
    slug: import("@feathersjs/typebox").TString<string>;
    title: import("@feathersjs/typebox").TString<string>;
    body: import("@feathersjs/typebox").TString<string>;
    section: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>>;
    metaTitle: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    metaDescription: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
}>;
export type SitePageData = Static<typeof sitePageDataSchema>;
export declare const sitePageDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const sitePageDataResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    publishedAt?: string | undefined;
    _id: string | {};
    createdAt: string;
    status: "draft" | "published";
    title: string;
    body: string;
    slug: string;
    section: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
}, HookContext>;
export declare const sitePagePatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TOmit<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    slug: import("@feathersjs/typebox").TString<string>;
    title: import("@feathersjs/typebox").TString<string>;
    body: import("@feathersjs/typebox").TString<string>;
    section: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
    status: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
    metaTitle: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    metaDescription: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    publishedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "slug", "createdAt"]>>;
export type SitePagePatch = Static<typeof sitePagePatchSchema>;
export declare const sitePagePatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const sitePagePatchResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    publishedAt?: string | undefined;
    _id: string | {};
    createdAt: string;
    status: "draft" | "published";
    title: string;
    body: string;
    slug: string;
    section: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
}, HookContext>;
export declare const sitePageQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    slug: import("@feathersjs/typebox").TString<string>;
    title: import("@feathersjs/typebox").TString<string>;
    body: import("@feathersjs/typebox").TString<string>;
    section: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
    status: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
    metaTitle: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    metaDescription: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    publishedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "slug", "section", "status", "title", "publishedAt", "createdAt", "updatedAt"]>;
export declare const sitePageQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    $limit: import("@feathersjs/typebox").TNumber;
    $skip: import("@feathersjs/typebox").TNumber;
    $sort: import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        title: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        slug: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        section: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        publishedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
    }>;
    $select: import("@feathersjs/typebox").TUnsafe<("_id" | "createdAt" | "updatedAt" | "status" | "title" | "slug" | "section" | "publishedAt")[]>;
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        title: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        slug: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        section: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        publishedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
                $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
                $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
                $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
                $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
                $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>>;
                $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>>;
            }>, import("@feathersjs/typebox").TObject<{
                [key: string]: import("@feathersjs/typebox").TSchema;
            } | undefined>]>>]>>;
            title: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            slug: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            section: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
                $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
                $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
                $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
                $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
                $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>>;
                $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>>;
            }>, import("@feathersjs/typebox").TObject<{
                [key: string]: import("@feathersjs/typebox").TSchema;
            } | undefined>]>>]>>;
            publishedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        title: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        slug: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        section: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        publishedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
        $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
        $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
        $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
        $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>;
        $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>>;
        $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"draft">, import("@feathersjs/typebox").TLiteral<"published">]>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
    title: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    slug: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    section: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
        $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
        $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
        $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
        $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>;
        $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>>;
        $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"legal">, import("@feathersjs/typebox").TLiteral<"marketing">, import("@feathersjs/typebox").TLiteral<"blog">, import("@feathersjs/typebox").TLiteral<"explore">, import("@feathersjs/typebox").TLiteral<"tools">, import("@feathersjs/typebox").TLiteral<"footer">]>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
    publishedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
}>>]>, import("@feathersjs/typebox").TObject<{}>]>;
export type SitePageQuery = Static<typeof sitePageQuerySchema>;
export declare const sitePageQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const sitePageQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
        status?: number | undefined;
        title?: number | undefined;
        slug?: number | undefined;
        section?: number | undefined;
        publishedAt?: number | undefined;
    };
    $select: ("_id" | "createdAt" | "updatedAt" | "status" | "title" | "slug" | "section" | "publishedAt")[];
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
        status?: "draft" | "published" | Partial<{
            $gt: "draft" | "published";
            $gte: "draft" | "published";
            $lt: "draft" | "published";
            $lte: "draft" | "published";
            $ne: "draft" | "published";
            $in: "draft" | "published" | ("draft" | "published")[];
            $nin: "draft" | "published" | ("draft" | "published")[];
        } & {}> | undefined;
        title?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        slug?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        section?: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | Partial<{
            $gt: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $gte: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $lt: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $lte: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $ne: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $in: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | ("legal" | "marketing" | "blog" | "explore" | "tools" | "footer")[];
            $nin: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | ("legal" | "marketing" | "blog" | "explore" | "tools" | "footer")[];
        } & {}> | undefined;
        publishedAt?: string | Partial<{
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
            status?: "draft" | "published" | Partial<{
                $gt: "draft" | "published";
                $gte: "draft" | "published";
                $lt: "draft" | "published";
                $lte: "draft" | "published";
                $ne: "draft" | "published";
                $in: "draft" | "published" | ("draft" | "published")[];
                $nin: "draft" | "published" | ("draft" | "published")[];
            } & {}> | undefined;
            title?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            slug?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            section?: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | Partial<{
                $gt: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
                $gte: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
                $lt: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
                $lte: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
                $ne: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
                $in: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | ("legal" | "marketing" | "blog" | "explore" | "tools" | "footer")[];
                $nin: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | ("legal" | "marketing" | "blog" | "explore" | "tools" | "footer")[];
            } & {}> | undefined;
            publishedAt?: string | Partial<{
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
        status?: "draft" | "published" | Partial<{
            $gt: "draft" | "published";
            $gte: "draft" | "published";
            $lt: "draft" | "published";
            $lte: "draft" | "published";
            $ne: "draft" | "published";
            $in: "draft" | "published" | ("draft" | "published")[];
            $nin: "draft" | "published" | ("draft" | "published")[];
        } & {}> | undefined;
        title?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        slug?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        section?: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | Partial<{
            $gt: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $gte: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $lt: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $lte: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $ne: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
            $in: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | ("legal" | "marketing" | "blog" | "explore" | "tools" | "footer")[];
            $nin: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | ("legal" | "marketing" | "blog" | "explore" | "tools" | "footer")[];
        } & {}> | undefined;
        publishedAt?: string | Partial<{
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
    status?: "draft" | "published" | Partial<{
        $gt: "draft" | "published";
        $gte: "draft" | "published";
        $lt: "draft" | "published";
        $lte: "draft" | "published";
        $ne: "draft" | "published";
        $in: "draft" | "published" | ("draft" | "published")[];
        $nin: "draft" | "published" | ("draft" | "published")[];
    } & {}> | undefined;
    title?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    slug?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    section?: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | Partial<{
        $gt: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
        $gte: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
        $lt: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
        $lte: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
        $ne: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer";
        $in: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | ("legal" | "marketing" | "blog" | "explore" | "tools" | "footer")[];
        $nin: "legal" | "marketing" | "blog" | "explore" | "tools" | "footer" | ("legal" | "marketing" | "blog" | "explore" | "tools" | "footer")[];
    } & {}> | undefined;
    publishedAt?: string | Partial<{
        $gt?: string | undefined;
        $gte?: string | undefined;
        $lt?: string | undefined;
        $lte?: string | undefined;
        $ne?: string | undefined;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
} & {}, HookContext>;
