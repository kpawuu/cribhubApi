import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
import { deriveLegacyCommissionPercent } from '../fee-proposal-shared';
export declare const agentListingRequestStatusSchema: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
export declare const agentListingRequestSchema: import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    agentUserId: import("@feathersjs/typebox").TString<string>;
    landlordId: import("@feathersjs/typebox").TString<string>;
    /** Legacy single-percent field. Mirrored from `proposal.rent.value` when type is percent. */
    commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
    /** Initial fee proposal from the agent. */
    proposal: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
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
    /** Landlord counter-offer (present when status = 'countered'). */
    counter: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
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
    /** Final agreed terms (set when status moves to 'accepted'). */
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
    reviewedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    /** Virtual: full agent profile (loaded via ?include=agent). */
    agent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    property: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    thread: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
}>;
export type AgentListingRequest = Static<typeof agentListingRequestSchema>;
export declare const agentListingRequestValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentListingRequestResolver: import("@feathersjs/schema").Resolver<{
    agent?: any;
    updatedAt?: string | undefined;
    message?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
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
    commissionPercent?: number | undefined;
    property?: any;
    proposal?: {
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
    counter?: {
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
    thread?: any;
    _id: string | {};
    createdAt: string;
    status: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
    propertyId: string;
    landlordId: string;
    agentUserId: string;
}, HookContext>;
export declare const agentListingRequestExternalResolver: import("@feathersjs/schema").Resolver<{
    agent?: any;
    updatedAt?: string | undefined;
    message?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
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
    commissionPercent?: number | undefined;
    property?: any;
    proposal?: {
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
    counter?: {
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
    thread?: any;
    _id: string | {};
    createdAt: string;
    status: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
    propertyId: string;
    landlordId: string;
    agentUserId: string;
}, HookContext>;
/** External create: agent proposes representation on a listing. */
export declare const agentListingRequestDataSchema: import("@feathersjs/typebox").TObject<{
    propertyId: import("@feathersjs/typebox").TString<string>;
    /** Optional legacy short-hand; if `proposal.rent` is provided it takes precedence. */
    commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    proposal: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
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
    /** Admin-only: create a request on behalf of this agent user. */
    agentUserId: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
}>;
export type AgentListingRequestData = Static<typeof agentListingRequestDataSchema>;
export declare const agentListingRequestDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentListingRequestDataResolver: import("@feathersjs/schema").Resolver<{
    agent?: any;
    updatedAt?: string | undefined;
    message?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
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
    commissionPercent?: number | undefined;
    property?: any;
    proposal?: {
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
    counter?: {
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
    thread?: any;
    _id: string | {};
    createdAt: string;
    status: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
    propertyId: string;
    landlordId: string;
    agentUserId: string;
}, HookContext>;
export declare const agentListingRequestPatchSchema: import("@feathersjs/typebox").TObject<{
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
    counter: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
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
    proposal: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
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
    /** Mirrored from `acceptedTerms.rent.value` when type is `percent`; kept in sync by `restrictPatch`. */
    commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
}>;
export type AgentListingRequestPatch = Static<typeof agentListingRequestPatchSchema>;
export declare const agentListingRequestPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentListingRequestPatchResolver: import("@feathersjs/schema").Resolver<{
    agent?: any;
    updatedAt?: string | undefined;
    message?: string | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | undefined;
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
    commissionPercent?: number | undefined;
    property?: any;
    proposal?: {
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
    counter?: {
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
    thread?: any;
    _id: string | {};
    createdAt: string;
    status: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
    propertyId: string;
    landlordId: string;
    agentUserId: string;
}, HookContext>;
export declare const agentListingRequestQueryProperties: import("@feathersjs/typebox").TPick<import("@feathersjs/typebox").TObject<{
    _id: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TString<string>, import("@feathersjs/typebox").TObject<{}>]>;
    propertyId: import("@feathersjs/typebox").TString<string>;
    agentUserId: import("@feathersjs/typebox").TString<string>;
    landlordId: import("@feathersjs/typebox").TString<string>;
    /** Legacy single-percent field. Mirrored from `proposal.rent.value` when type is percent. */
    commissionPercent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TNumber>;
    message: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    status: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
    /** Initial fee proposal from the agent. */
    proposal: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
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
    /** Landlord counter-offer (present when status = 'countered'). */
    counter: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TObject<{
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
    /** Final agreed terms (set when status moves to 'accepted'). */
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
    reviewedBy: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<string>>;
    reviewedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    createdAt: import("@feathersjs/typebox").TString<"date-time">;
    updatedAt: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TString<"date-time">>;
    /** Virtual: full agent profile (loaded via ?include=agent). */
    agent: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    property: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
    thread: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TAny>;
}>, ["_id", "propertyId", "agentUserId", "landlordId", "status", "createdAt", "updatedAt"]>;
export declare const agentListingRequestQuerySchema: import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TObject<{
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
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
            status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
                $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
                $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
                $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
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
        status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
            $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
            $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
            $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
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
    status: import("@feathersjs/typebox").TOptional<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>, import("@feathersjs/typebox").TPartial<import("@feathersjs/typebox").TIntersect<[import("@feathersjs/typebox").TObject<{
        $gt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $gte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $lt: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $lte: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $ne: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>;
        $in: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
        $nin: import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]> | import("@feathersjs/typebox").TArray<import("@feathersjs/typebox").TUnion<[import("@feathersjs/typebox").TLiteral<"pending">, import("@feathersjs/typebox").TLiteral<"countered">, import("@feathersjs/typebox").TLiteral<"accepted">, import("@feathersjs/typebox").TLiteral<"rejected">, import("@feathersjs/typebox").TLiteral<"withdrawn">]>>;
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
}>>]>, import("@feathersjs/typebox").TObject<{}>]>;
export type AgentListingRequestQuery = Static<typeof agentListingRequestQuerySchema>;
export declare const agentListingRequestQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const agentListingRequestQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
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
        status?: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | Partial<{
            $gt: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $gte: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $lt: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $lte: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $ne: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $in: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | ("pending" | "rejected" | "countered" | "accepted" | "withdrawn")[];
            $nin: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | ("pending" | "rejected" | "countered" | "accepted" | "withdrawn")[];
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
            status?: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | Partial<{
                $gt: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
                $gte: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
                $lt: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
                $lte: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
                $ne: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
                $in: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | ("pending" | "rejected" | "countered" | "accepted" | "withdrawn")[];
                $nin: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | ("pending" | "rejected" | "countered" | "accepted" | "withdrawn")[];
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
        status?: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | Partial<{
            $gt: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $gte: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $lt: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $lte: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $ne: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
            $in: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | ("pending" | "rejected" | "countered" | "accepted" | "withdrawn")[];
            $nin: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | ("pending" | "rejected" | "countered" | "accepted" | "withdrawn")[];
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
    status?: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | Partial<{
        $gt: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
        $gte: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
        $lt: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
        $lte: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
        $ne: "pending" | "rejected" | "countered" | "accepted" | "withdrawn";
        $in: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | ("pending" | "rejected" | "countered" | "accepted" | "withdrawn")[];
        $nin: "pending" | "rejected" | "countered" | "accepted" | "withdrawn" | ("pending" | "rejected" | "countered" | "accepted" | "withdrawn")[];
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
} & {}, HookContext>;
export { deriveLegacyCommissionPercent };
