import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
export declare const propertyManagerAssignmentSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    managerUserId: import("@feathersjs/typebox").TString<string>;
    landlordId: import("@feathersjs/typebox").TString<string>;
    assignedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    /** Mirrored from the listing-request `acceptedTerms` (or set by admin on direct assignment). */
    acceptedTerms: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        rent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            type: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"percent">, import("@feathersjs/typebox").TLiteral<"fixed">, import("@feathersjs/typebox").TLiteral<"months_rent">, import("@feathersjs/typebox").TLiteral<"percent_rent_collected">]>;
            value: import("@feathersjs/typebox").TNumber;
            currency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        }>>;
        sale: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            type: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"percent">, import("@feathersjs/typebox").TLiteral<"fixed">, import("@feathersjs/typebox").TLiteral<"months_rent">, import("@feathersjs/typebox").TLiteral<"percent_rent_collected">]>;
            value: import("@feathersjs/typebox").TNumber;
            currency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        }>>;
        triggers: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rent_consummated">, import("@feathersjs/typebox").TLiteral<"sale_consummated">, import("@feathersjs/typebox").TLiteral<"first_month_paid">, import("@feathersjs/typebox").TLiteral<"each_renewal">, import("@feathersjs/typebox").TLiteral<"monthly_rent_collected">]>>>;
        validityDays: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
        notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        proposedByUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        at: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    }>>;
    sourceRequestId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    /** Virtual: full property manager profile (loaded on demand via ?include=manager). */
    manager: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
}>;
export type PropertyManagerAssignment = Static<typeof propertyManagerAssignmentSchema>;
export declare const propertyManagerAssignmentValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const propertyManagerAssignmentResolver: import("@feathersjs/schema").Resolver<{
    assignedBy?: string | undefined;
    acceptedTerms?: {
        at?: string | undefined;
        notes?: string | undefined;
        rent?: {
            notes?: string | undefined;
            currency?: string | undefined;
            value: number;
            type: "fixed" | "percent" | "months_rent" | "percent_rent_collected";
        } | undefined;
        sale?: {
            notes?: string | undefined;
            currency?: string | undefined;
            value: number;
            type: "fixed" | "percent" | "months_rent" | "percent_rent_collected";
        } | undefined;
        triggers?: ("rent_consummated" | "sale_consummated" | "first_month_paid" | "each_renewal" | "monthly_rent_collected")[] | undefined;
        validityDays?: number | undefined;
        proposedByUserId?: string | undefined;
    } | undefined;
    sourceRequestId?: string | undefined;
    manager?: any;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    managerUserId: string;
    landlordId: string;
}, HookContext>;
export declare const propertyManagerAssignmentExternalResolver: import("@feathersjs/schema").Resolver<{
    assignedBy?: string | undefined;
    acceptedTerms?: {
        at?: string | undefined;
        notes?: string | undefined;
        rent?: {
            notes?: string | undefined;
            currency?: string | undefined;
            value: number;
            type: "fixed" | "percent" | "months_rent" | "percent_rent_collected";
        } | undefined;
        sale?: {
            notes?: string | undefined;
            currency?: string | undefined;
            value: number;
            type: "fixed" | "percent" | "months_rent" | "percent_rent_collected";
        } | undefined;
        triggers?: ("rent_consummated" | "sale_consummated" | "first_month_paid" | "each_renewal" | "monthly_rent_collected")[] | undefined;
        validityDays?: number | undefined;
        proposedByUserId?: string | undefined;
    } | undefined;
    sourceRequestId?: string | undefined;
    manager?: any;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    managerUserId: string;
    landlordId: string;
}, HookContext>;
export declare const propertyManagerAssignmentDataSchema: import("@feathersjs/typebox").TObject<{
    propertyId: import("@feathersjs/typebox").TString<string>;
    managerUserId: import("@feathersjs/typebox").TString<string>;
    acceptedTerms: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        rent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            type: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"percent">, import("@feathersjs/typebox").TLiteral<"fixed">, import("@feathersjs/typebox").TLiteral<"months_rent">, import("@feathersjs/typebox").TLiteral<"percent_rent_collected">]>;
            value: import("@feathersjs/typebox").TNumber;
            currency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        }>>;
        sale: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            type: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"percent">, import("@feathersjs/typebox").TLiteral<"fixed">, import("@feathersjs/typebox").TLiteral<"months_rent">, import("@feathersjs/typebox").TLiteral<"percent_rent_collected">]>;
            value: import("@feathersjs/typebox").TNumber;
            currency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        }>>;
        triggers: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rent_consummated">, import("@feathersjs/typebox").TLiteral<"sale_consummated">, import("@feathersjs/typebox").TLiteral<"first_month_paid">, import("@feathersjs/typebox").TLiteral<"each_renewal">, import("@feathersjs/typebox").TLiteral<"monthly_rent_collected">]>>>;
        validityDays: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
        notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        proposedByUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        at: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    }>>;
    sourceRequestId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
}>;
export type PropertyManagerAssignmentData = Static<typeof propertyManagerAssignmentDataSchema>;
export declare const propertyManagerAssignmentDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const propertyManagerAssignmentDataResolver: import("@feathersjs/schema").Resolver<{
    assignedBy?: string | undefined;
    acceptedTerms?: {
        at?: string | undefined;
        notes?: string | undefined;
        rent?: {
            notes?: string | undefined;
            currency?: string | undefined;
            value: number;
            type: "fixed" | "percent" | "months_rent" | "percent_rent_collected";
        } | undefined;
        sale?: {
            notes?: string | undefined;
            currency?: string | undefined;
            value: number;
            type: "fixed" | "percent" | "months_rent" | "percent_rent_collected";
        } | undefined;
        triggers?: ("rent_consummated" | "sale_consummated" | "first_month_paid" | "each_renewal" | "monthly_rent_collected")[] | undefined;
        validityDays?: number | undefined;
        proposedByUserId?: string | undefined;
    } | undefined;
    sourceRequestId?: string | undefined;
    manager?: any;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    managerUserId: string;
    landlordId: string;
}, HookContext>;
export declare const propertyManagerAssignmentPatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    acceptedTerms: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        rent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            type: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"percent">, import("@feathersjs/typebox").TLiteral<"fixed">, import("@feathersjs/typebox").TLiteral<"months_rent">, import("@feathersjs/typebox").TLiteral<"percent_rent_collected">]>;
            value: import("@feathersjs/typebox").TNumber;
            currency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        }>>;
        sale: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            type: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"percent">, import("@feathersjs/typebox").TLiteral<"fixed">, import("@feathersjs/typebox").TLiteral<"months_rent">, import("@feathersjs/typebox").TLiteral<"percent_rent_collected">]>;
            value: import("@feathersjs/typebox").TNumber;
            currency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        }>>;
        triggers: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rent_consummated">, import("@feathersjs/typebox").TLiteral<"sale_consummated">, import("@feathersjs/typebox").TLiteral<"first_month_paid">, import("@feathersjs/typebox").TLiteral<"each_renewal">, import("@feathersjs/typebox").TLiteral<"monthly_rent_collected">]>>>;
        validityDays: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
        notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        proposedByUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        at: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    }>>;
}>>;
export type PropertyManagerAssignmentPatch = Static<typeof propertyManagerAssignmentPatchSchema>;
export declare const propertyManagerAssignmentPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const propertyManagerAssignmentPatchResolver: import("@feathersjs/schema").Resolver<Partial<{
    acceptedTerms?: {
        at?: string | undefined;
        notes?: string | undefined;
        rent?: {
            notes?: string | undefined;
            currency?: string | undefined;
            value: number;
            type: "fixed" | "percent" | "months_rent" | "percent_rent_collected";
        } | undefined;
        sale?: {
            notes?: string | undefined;
            currency?: string | undefined;
            value: number;
            type: "fixed" | "percent" | "months_rent" | "percent_rent_collected";
        } | undefined;
        triggers?: ("rent_consummated" | "sale_consummated" | "first_month_paid" | "each_renewal" | "monthly_rent_collected")[] | undefined;
        validityDays?: number | undefined;
        proposedByUserId?: string | undefined;
    } | undefined;
}>, HookContext>;
export declare const propertyManagerAssignmentQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    managerUserId: import("@feathersjs/typebox").TString<string>;
    landlordId: import("@feathersjs/typebox").TString<string>;
    assignedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    /** Mirrored from the listing-request `acceptedTerms` (or set by admin on direct assignment). */
    acceptedTerms: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
        rent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            type: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"percent">, import("@feathersjs/typebox").TLiteral<"fixed">, import("@feathersjs/typebox").TLiteral<"months_rent">, import("@feathersjs/typebox").TLiteral<"percent_rent_collected">]>;
            value: import("@feathersjs/typebox").TNumber;
            currency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        }>>;
        sale: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
            type: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"percent">, import("@feathersjs/typebox").TLiteral<"fixed">, import("@feathersjs/typebox").TLiteral<"months_rent">, import("@feathersjs/typebox").TLiteral<"percent_rent_collected">]>;
            value: import("@feathersjs/typebox").TNumber;
            currency: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
            notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        }>>;
        triggers: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"rent_consummated">, import("@feathersjs/typebox").TLiteral<"sale_consummated">, import("@feathersjs/typebox").TLiteral<"first_month_paid">, import("@feathersjs/typebox").TLiteral<"each_renewal">, import("@feathersjs/typebox").TLiteral<"monthly_rent_collected">]>>>;
        validityDays: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
        notes: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        proposedByUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
        at: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    }>>;
    sourceRequestId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    /** Virtual: full property manager profile (loaded on demand via ?include=manager). */
    manager: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
}>, ["_id", "propertyId", "managerUserId", "landlordId", "createdAt"]>;
export declare const propertyManagerAssignmentQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    $limit: import("@feathersjs/typebox").TNumber;
    $skip: import("@feathersjs/typebox").TNumber;
    $sort: import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        propertyId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        managerUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        landlordId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
    }>;
    $select: import("@feathersjs/typebox").TUnsafe<("_id" | "createdAt" | "propertyId" | "managerUserId" | "landlordId")[]>;
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
export type PropertyManagerAssignmentQuery = Static<typeof propertyManagerAssignmentQuerySchema>;
export declare const propertyManagerAssignmentQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const propertyManagerAssignmentQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
        createdAt?: number | undefined;
        propertyId?: number | undefined;
        managerUserId?: number | undefined;
        landlordId?: number | undefined;
    };
    $select: ("_id" | "createdAt" | "propertyId" | "managerUserId" | "landlordId")[];
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
