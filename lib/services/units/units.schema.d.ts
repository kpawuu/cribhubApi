import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
import type { UnitsService } from './units.class';
export declare const unitSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    unitNumber: import("@feathersjs/typebox").TString<string>;
    bedrooms: import("@feathersjs/typebox").TNumber;
    bathrooms: import("@feathersjs/typebox").TNumber;
    squareFeet: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    rentAmount: import("@feathersjs/typebox").TNumber;
    rentCurrency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
    tenantId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    leaseStart: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    leaseEnd: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    listingType: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
    salePrice: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    mortgageEligible: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    mortgagePartner: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    images: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>;
export type Unit = Static<typeof unitSchema>;
export declare const unitValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const unitResolver: import("@feathersjs/schema").Resolver<{
    files?: any[] | undefined;
    updatedAt?: string | undefined;
    status?: "vacant" | "occupied" | "maintenance" | undefined;
    listingType?: "rental" | "sale" | undefined;
    images?: string[] | undefined;
    squareFeet?: number | undefined;
    rentCurrency?: string | undefined;
    tenantId?: string | undefined;
    leaseStart?: string | undefined;
    leaseEnd?: string | undefined;
    salePrice?: number | undefined;
    mortgageEligible?: boolean | undefined;
    mortgagePartner?: string | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    bedrooms: number;
    bathrooms: number;
    unitNumber: string;
    rentAmount: number;
}, HookContext<UnitsService<import("./units.class").UnitsParams>>>;
export declare const unitExternalResolver: import("@feathersjs/schema").Resolver<{
    files?: any[] | undefined;
    updatedAt?: string | undefined;
    status?: "vacant" | "occupied" | "maintenance" | undefined;
    listingType?: "rental" | "sale" | undefined;
    images?: string[] | undefined;
    squareFeet?: number | undefined;
    rentCurrency?: string | undefined;
    tenantId?: string | undefined;
    leaseStart?: string | undefined;
    leaseEnd?: string | undefined;
    salePrice?: number | undefined;
    mortgageEligible?: boolean | undefined;
    mortgagePartner?: string | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    bedrooms: number;
    bathrooms: number;
    unitNumber: string;
    rentAmount: number;
}, HookContext<UnitsService<import("./units.class").UnitsParams>>>;
export declare const unitDataSchema: import("@feathersjs/typebox").TObject<{
    propertyId: import("@feathersjs/typebox").TString<string>;
    unitNumber: import("@feathersjs/typebox").TString<string>;
    bedrooms: import("@feathersjs/typebox").TNumber;
    bathrooms: import("@feathersjs/typebox").TNumber;
    squareFeet: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    rentAmount: import("@feathersjs/typebox").TNumber;
    rentCurrency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
    tenantId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    leaseStart: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    leaseEnd: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    listingType: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
    salePrice: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    mortgageEligible: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    mortgagePartner: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    images: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
}>;
export type UnitData = Static<typeof unitDataSchema>;
export declare const unitDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const unitDataResolver: import("@feathersjs/schema").Resolver<{
    files?: any[] | undefined;
    updatedAt?: string | undefined;
    status?: "vacant" | "occupied" | "maintenance" | undefined;
    listingType?: "rental" | "sale" | undefined;
    images?: string[] | undefined;
    squareFeet?: number | undefined;
    rentCurrency?: string | undefined;
    tenantId?: string | undefined;
    leaseStart?: string | undefined;
    leaseEnd?: string | undefined;
    salePrice?: number | undefined;
    mortgageEligible?: boolean | undefined;
    mortgagePartner?: string | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    bedrooms: number;
    bathrooms: number;
    unitNumber: string;
    rentAmount: number;
}, HookContext<UnitsService<import("./units.class").UnitsParams>>>;
export declare const unitPatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TOmit<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    unitNumber: import("@feathersjs/typebox").TString<string>;
    bedrooms: import("@feathersjs/typebox").TNumber;
    bathrooms: import("@feathersjs/typebox").TNumber;
    squareFeet: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    rentAmount: import("@feathersjs/typebox").TNumber;
    rentCurrency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
    tenantId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    leaseStart: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    leaseEnd: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    listingType: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
    salePrice: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    mortgageEligible: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    mortgagePartner: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    images: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "createdAt"]>>;
export type UnitPatch = Static<typeof unitPatchSchema>;
export declare const unitPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const unitPatchResolver: import("@feathersjs/schema").Resolver<{
    files?: any[] | undefined;
    updatedAt?: string | undefined;
    status?: "vacant" | "occupied" | "maintenance" | undefined;
    listingType?: "rental" | "sale" | undefined;
    images?: string[] | undefined;
    squareFeet?: number | undefined;
    rentCurrency?: string | undefined;
    tenantId?: string | undefined;
    leaseStart?: string | undefined;
    leaseEnd?: string | undefined;
    salePrice?: number | undefined;
    mortgageEligible?: boolean | undefined;
    mortgagePartner?: string | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    bedrooms: number;
    bathrooms: number;
    unitNumber: string;
    rentAmount: number;
}, HookContext<UnitsService<import("./units.class").UnitsParams>>>;
export declare const unitQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    unitNumber: import("@feathersjs/typebox").TString<string>;
    bedrooms: import("@feathersjs/typebox").TNumber;
    bathrooms: import("@feathersjs/typebox").TNumber;
    squareFeet: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    rentAmount: import("@feathersjs/typebox").TNumber;
    rentCurrency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
    tenantId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    leaseStart: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    leaseEnd: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    listingType: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
    salePrice: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    mortgageEligible: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TBoolean>;
    mortgagePartner: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    images: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TString<string>>>;
    files: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TAny>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>, ["_id", "propertyId", "unitNumber", "status", "tenantId", "listingType", "createdAt", "updatedAt"]>;
export declare const unitQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    $limit: import("@feathersjs/typebox").TNumber;
    $skip: import("@feathersjs/typebox").TNumber;
    $sort: import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        propertyId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        listingType: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        unitNumber: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        tenantId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
    }>;
    $select: import("@feathersjs/typebox").TUnsafe<("_id" | "createdAt" | "updatedAt" | "status" | "propertyId" | "listingType" | "unitNumber" | "tenantId")[]>;
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>>;
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
        listingType: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        unitNumber: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        tenantId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
                $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
                $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
                $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
                $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
                $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>>;
                $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>>;
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
            listingType: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
                $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
                $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
                $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
                $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
                $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>>;
                $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>>;
            }>, import("@feathersjs/typebox").TObject<{
                [key: string]: import("@feathersjs/typebox").TSchema;
            } | undefined>]>>]>>;
            unitNumber: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            tenantId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>>;
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
        listingType: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>>;
        }>, import("@feathersjs/typebox").TObject<{
            [key: string]: import("@feathersjs/typebox").TSchema;
        } | undefined>]>>]>>;
        unitNumber: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        tenantId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
        $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
        $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
        $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
        $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>;
        $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>>;
        $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"vacant">, import("@feathersjs/typebox").TLiteral<"occupied">, import("@feathersjs/typebox").TLiteral<"maintenance">]>>>;
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
    listingType: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
        $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
        $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
        $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
        $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>;
        $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>>;
        $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rental">, import("@feathersjs/typebox").TLiteral<"sale">]>>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
    unitNumber: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    tenantId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
export type UnitQuery = Static<typeof unitQuerySchema>;
export declare const unitQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const unitQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
        status?: number | undefined;
        propertyId?: number | undefined;
        listingType?: number | undefined;
        unitNumber?: number | undefined;
        tenantId?: number | undefined;
    };
    $select: ("_id" | "createdAt" | "updatedAt" | "status" | "propertyId" | "listingType" | "unitNumber" | "tenantId")[];
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
        status?: "vacant" | "occupied" | "maintenance" | Partial<{
            $gt?: "vacant" | "occupied" | "maintenance" | undefined;
            $gte?: "vacant" | "occupied" | "maintenance" | undefined;
            $lt?: "vacant" | "occupied" | "maintenance" | undefined;
            $lte?: "vacant" | "occupied" | "maintenance" | undefined;
            $ne?: "vacant" | "occupied" | "maintenance" | undefined;
            $in: "vacant" | "occupied" | "maintenance" | ("vacant" | "occupied" | "maintenance")[];
            $nin: "vacant" | "occupied" | "maintenance" | ("vacant" | "occupied" | "maintenance")[];
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
        listingType?: "rental" | "sale" | Partial<{
            $gt?: "rental" | "sale" | undefined;
            $gte?: "rental" | "sale" | undefined;
            $lt?: "rental" | "sale" | undefined;
            $lte?: "rental" | "sale" | undefined;
            $ne?: "rental" | "sale" | undefined;
            $in: "rental" | "sale" | ("rental" | "sale")[];
            $nin: "rental" | "sale" | ("rental" | "sale")[];
        } & {}> | undefined;
        unitNumber?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        tenantId?: string | Partial<{
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
            status?: "vacant" | "occupied" | "maintenance" | Partial<{
                $gt?: "vacant" | "occupied" | "maintenance" | undefined;
                $gte?: "vacant" | "occupied" | "maintenance" | undefined;
                $lt?: "vacant" | "occupied" | "maintenance" | undefined;
                $lte?: "vacant" | "occupied" | "maintenance" | undefined;
                $ne?: "vacant" | "occupied" | "maintenance" | undefined;
                $in: "vacant" | "occupied" | "maintenance" | ("vacant" | "occupied" | "maintenance")[];
                $nin: "vacant" | "occupied" | "maintenance" | ("vacant" | "occupied" | "maintenance")[];
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
            listingType?: "rental" | "sale" | Partial<{
                $gt?: "rental" | "sale" | undefined;
                $gte?: "rental" | "sale" | undefined;
                $lt?: "rental" | "sale" | undefined;
                $lte?: "rental" | "sale" | undefined;
                $ne?: "rental" | "sale" | undefined;
                $in: "rental" | "sale" | ("rental" | "sale")[];
                $nin: "rental" | "sale" | ("rental" | "sale")[];
            } & {}> | undefined;
            unitNumber?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            tenantId?: string | Partial<{
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
        status?: "vacant" | "occupied" | "maintenance" | Partial<{
            $gt?: "vacant" | "occupied" | "maintenance" | undefined;
            $gte?: "vacant" | "occupied" | "maintenance" | undefined;
            $lt?: "vacant" | "occupied" | "maintenance" | undefined;
            $lte?: "vacant" | "occupied" | "maintenance" | undefined;
            $ne?: "vacant" | "occupied" | "maintenance" | undefined;
            $in: "vacant" | "occupied" | "maintenance" | ("vacant" | "occupied" | "maintenance")[];
            $nin: "vacant" | "occupied" | "maintenance" | ("vacant" | "occupied" | "maintenance")[];
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
        listingType?: "rental" | "sale" | Partial<{
            $gt?: "rental" | "sale" | undefined;
            $gte?: "rental" | "sale" | undefined;
            $lt?: "rental" | "sale" | undefined;
            $lte?: "rental" | "sale" | undefined;
            $ne?: "rental" | "sale" | undefined;
            $in: "rental" | "sale" | ("rental" | "sale")[];
            $nin: "rental" | "sale" | ("rental" | "sale")[];
        } & {}> | undefined;
        unitNumber?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        tenantId?: string | Partial<{
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
    status?: "vacant" | "occupied" | "maintenance" | Partial<{
        $gt?: "vacant" | "occupied" | "maintenance" | undefined;
        $gte?: "vacant" | "occupied" | "maintenance" | undefined;
        $lt?: "vacant" | "occupied" | "maintenance" | undefined;
        $lte?: "vacant" | "occupied" | "maintenance" | undefined;
        $ne?: "vacant" | "occupied" | "maintenance" | undefined;
        $in: "vacant" | "occupied" | "maintenance" | ("vacant" | "occupied" | "maintenance")[];
        $nin: "vacant" | "occupied" | "maintenance" | ("vacant" | "occupied" | "maintenance")[];
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
    listingType?: "rental" | "sale" | Partial<{
        $gt?: "rental" | "sale" | undefined;
        $gte?: "rental" | "sale" | undefined;
        $lt?: "rental" | "sale" | undefined;
        $lte?: "rental" | "sale" | undefined;
        $ne?: "rental" | "sale" | undefined;
        $in: "rental" | "sale" | ("rental" | "sale")[];
        $nin: "rental" | "sale" | ("rental" | "sale")[];
    } & {}> | undefined;
    unitNumber?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    tenantId?: string | Partial<{
        $gt?: string | undefined;
        $gte?: string | undefined;
        $lt?: string | undefined;
        $lte?: string | undefined;
        $ne?: string | undefined;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
} & {}, HookContext<UnitsService<import("./units.class").UnitsParams>>>;
