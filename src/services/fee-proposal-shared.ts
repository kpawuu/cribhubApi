/**
 * Shared TypeBox schemas for structured fee proposals used by both
 * `agent-listing-requests` and `property-manager-listing-requests`.
 *
 * A fee proposal captures the negotiable terms between a landlord and an
 * agent/PM. Each request row carries:
 *   - `proposal`       — the initial terms offered by the agent/PM
 *   - `counter`        — optional landlord counter (only when status='countered')
 *   - `acceptedTerms`  — the final agreed terms (mirrored to the assignment row)
 *
 * The status flow:
 *   pending → accepted | rejected | withdrawn
 *   pending → countered → accepted | rejected | withdrawn
 *   countered → accepted | rejected | withdrawn
 */
import { Type } from '@feathersjs/typebox'

// No `$id` on these nested types — they are referenced from multiple
// schemas (agent + PM listing requests + both assignment tables). Giving
// them a $id causes AJV to register the same schema twice and fail
// validator compilation on app boot.
export const feeProposalUnitSchema = Type.Object(
  {
    type: Type.Union([
      Type.Literal('percent'),
      Type.Literal('fixed'),
      Type.Literal('months_rent'),
      Type.Literal('percent_rent_collected')
    ]),
    value: Type.Number({ minimum: 0 }),
    currency: Type.Optional(Type.String({ maxLength: 6 })),
    notes: Type.Optional(Type.String({ maxLength: 400 }))
  },
  { additionalProperties: false }
)

export const feeProposalSchema = Type.Object(
  {
    rent: Type.Optional(feeProposalUnitSchema),
    sale: Type.Optional(feeProposalUnitSchema),
    triggers: Type.Optional(
      Type.Array(
        Type.Union([
          Type.Literal('rent_consummated'),
          Type.Literal('sale_consummated'),
          Type.Literal('first_month_paid'),
          Type.Literal('each_renewal'),
          Type.Literal('monthly_rent_collected')
        ])
      )
    ),
    validityDays: Type.Optional(Type.Number({ minimum: 1, maximum: 365 })),
    notes: Type.Optional(Type.String({ maxLength: 4000 })),
    proposedByUserId: Type.Optional(Type.String()),
    at: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { additionalProperties: false }
)

export const requestStatusWithCounterSchema = Type.Union([
  Type.Literal('pending'),
  Type.Literal('countered'),
  Type.Literal('accepted'),
  Type.Literal('rejected'),
  Type.Literal('withdrawn')
])

/**
 * Mirror a fee proposal's primary "rent percent" value into the legacy
 * `commissionPercent` field for backward compatibility with the existing UI.
 */
export function deriveLegacyCommissionPercent(terms?: { rent?: { type?: string; value?: number } } | null): number | undefined {
  if (!terms?.rent) return undefined
  if (terms.rent.type === 'percent' || terms.rent.type === 'percent_rent_collected') {
    return typeof terms.rent.value === 'number' ? terms.rent.value : undefined
  }
  return undefined
}
