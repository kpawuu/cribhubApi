import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
export declare const agentAssignmentSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    agentUserId: import("@feathersjs/typebox").TString<string>;
    assignedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    agreementNote: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    /** Final agreed fee terms (copied from the source listing request's acceptedTerms). */
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
    /** Virtual: full agent profile (loaded on demand via ?include=agent). */
    agent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
}>;
export type AgentAssignment = Static<typeof agentAssignmentSchema>;
export declare const agentAssignmentValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentAssignmentResolver: import("@feathersjs/schema").Resolver<{
    agent?: any;
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
    commissionPercent?: number | undefined;
    agreementNote?: string | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    agentUserId: string;
}, HookContext>;
export declare const agentAssignmentExternalResolver: import("@feathersjs/schema").Resolver<{
    agent?: any;
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
    commissionPercent?: number | undefined;
    agreementNote?: string | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    agentUserId: string;
}, HookContext>;
export declare const agentAssignmentDataSchema: import("@feathersjs/typebox").TObject<{
    propertyId: import("@feathersjs/typebox").TString<string>;
    agentUserId: import("@feathersjs/typebox").TString<string>;
    commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    agreementNote: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
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
export type AgentAssignmentData = Static<typeof agentAssignmentDataSchema>;
export declare const agentAssignmentDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentAssignmentDataResolver: import("@feathersjs/schema").Resolver<{
    agent?: any;
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
    commissionPercent?: number | undefined;
    agreementNote?: string | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    agentUserId: string;
}, HookContext>;
export declare const agentAssignmentPatchSchema: import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    agreementNote: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
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
export type AgentAssignmentPatch = Static<typeof agentAssignmentPatchSchema>;
export declare const agentAssignmentPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentAssignmentPatchResolver: import("@feathersjs/schema").Resolver<{
    agent?: any;
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
    commissionPercent?: number | undefined;
    agreementNote?: string | undefined;
    _id: string | {};
    createdAt: string;
    propertyId: string;
    agentUserId: string;
}, HookContext>;
export declare const agentAssignmentQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    agentUserId: import("@feathersjs/typebox").TString<string>;
    assignedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    agreementNote: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    /** Final agreed fee terms (copied from the source listing request's acceptedTerms). */
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
    /** Virtual: full agent profile (loaded on demand via ?include=agent). */
    agent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
}>, ["_id", "propertyId", "agentUserId", "commissionPercent", "createdAt"]>;
export declare const agentAssignmentQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
    $limit: import("@feathersjs/typebox").TNumber;
    $skip: import("@feathersjs/typebox").TNumber;
    $sort: import("@feathersjs/typebox").TObject<{
        _id: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        createdAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        propertyId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
        commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TInteger>;
    }>;
    $select: import("@feathersjs/typebox").TUnsafe<("_id" | "createdAt" | "propertyId" | "agentUserId" | "commissionPercent")[]>;
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
        agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>>;
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
            agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
            commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
                $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
                $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
                $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
                $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
                $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>>;
                $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>>;
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
        agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
        commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
            $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>>;
            $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>>;
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
    agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
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
    commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
        $gte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
        $lt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
        $lte: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
        $ne: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
        $in: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>>;
        $nin: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>>;
    }>, import("@feathersjs/typebox").TObject<{
        [key: string]: import("@feathersjs/typebox").TSchema;
    } | undefined>]>>]>>;
}>>]>, import("@feathersjs/typebox").TObject<{}>]>;
export type AgentAssignmentQuery = Static<typeof agentAssignmentQuerySchema>;
export declare const agentAssignmentQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentAssignmentQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
        createdAt?: number | undefined;
        propertyId?: number | undefined;
        agentUserId?: number | undefined;
        commissionPercent?: number | undefined;
    };
    $select: ("_id" | "createdAt" | "propertyId" | "agentUserId" | "commissionPercent")[];
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
        agentUserId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        commissionPercent?: number | Partial<{
            $gt?: number | undefined;
            $gte?: number | undefined;
            $lt?: number | undefined;
            $lte?: number | undefined;
            $ne?: number | undefined;
            $in: number | number[];
            $nin: number | number[];
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
            agentUserId?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string | string[];
                $nin: string | string[];
            } & {}> | undefined;
            commissionPercent?: number | Partial<{
                $gt?: number | undefined;
                $gte?: number | undefined;
                $lt?: number | undefined;
                $lte?: number | undefined;
                $ne?: number | undefined;
                $in: number | number[];
                $nin: number | number[];
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
        agentUserId?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string | string[];
            $nin: string | string[];
        } & {}> | undefined;
        commissionPercent?: number | Partial<{
            $gt?: number | undefined;
            $gte?: number | undefined;
            $lt?: number | undefined;
            $lte?: number | undefined;
            $ne?: number | undefined;
            $in: number | number[];
            $nin: number | number[];
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
    agentUserId?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {}> | undefined;
    commissionPercent?: number | Partial<{
        $gt?: number | undefined;
        $gte?: number | undefined;
        $lt?: number | undefined;
        $lte?: number | undefined;
        $ne?: number | undefined;
        $in: number | number[];
        $nin: number | number[];
    } & {}> | undefined;
} & {}, HookContext>;
