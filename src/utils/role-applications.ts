/**
 * Shared logic for the role-application tracker.
 *
 * Centralizes:
 *   • the required-document matrix per role,
 *   • SLA / business-day math,
 *   • derivation of the application sub-stage from the persisted top-level
 *     `status` plus the linked `verification-documents` collection,
 *   • copy used by the dashboard banner and the dedicated application page.
 *
 * Every surface that talks about a role-application (admin verification list,
 * applicant dashboard, notification copy, my-role-applications endpoint) must
 * import from this file so the labels, colors, and next-step prompts stay in
 * lock-step.
 */

import type { Application } from '../declarations'

export type RoleKind = 'landlord' | 'property_manager' | 'agent'
export type RoleStatus = 'pending' | 'approved' | 'rejected'
export type RoleSubstage = 'submitted' | 'docs_required' | 'reviewing' | 'decided'

export const ROLE_LABEL: Record<RoleKind, string> = {
  landlord: 'Landlord',
  property_manager: 'Property Manager',
  agent: 'Agent'
}

/**
 * Document types we expect for each role, in display order. Keep keys snake_case
 * so they round-trip cleanly through `verification-documents.documentType`.
 *
 * The mobile/web upload UI should prompt for these one at a time. Reviewers
 * use the same list to compute completeness.
 */
export const REQUIRED_DOCUMENT_TYPES: Record<RoleKind, string[]> = {
  landlord: ['national_id', 'proof_of_ownership'],
  property_manager: ['national_id', 'business_registration'],
  agent: ['national_id', 'agent_license']
}

export const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  national_id: 'National ID (Ghana Card)',
  proof_of_ownership: 'Proof of ownership',
  business_registration: 'Business registration',
  agent_license: 'Agent licence',
  pm_certificate: 'PM certification (optional)'
}

/** Business-day window in which we promise the team will reach a decision. */
export const SLA_BUSINESS_DAYS = 2

/** Returns a date that is N business days after `from` (skipping Sat/Sun). */
export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from.getTime())
  let added = 0
  while (added < days) {
    d.setUTCDate(d.getUTCDate() + 1)
    const dow = d.getUTCDay()
    if (dow !== 0 && dow !== 6) added += 1
  }
  return d
}

/** Whole-day diff between two dates (UTC). */
export function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000)
}

export type EnrichedDocument = {
  _id: string
  documentType: string
  documentTypeLabel: string
  documentUrl: string
  uploadedAt: string
}

/**
 * Pull the verification-documents for a role-request and decorate with labels.
 */
export async function loadDocumentsForRequest(
  app: Application,
  roleRequestId: string
): Promise<EnrichedDocument[]> {
  // Sort by `_id` (which is monotonic in MongoDB) instead of `uploadedAt`
  // because the verification-documents query validator only whitelists
  // `_id`, `roleRequestId`, `documentType` for sorting.
  const res = (await (app as any).service('verification-documents').find({
    paginate: false,
    query: { roleRequestId, $sort: { _id: -1 }, $limit: 50 },
    provider: undefined
  } as any)) as any
  const list = Array.isArray(res) ? res : (res?.data ?? [])
  return list.map((d: any) => ({
    _id: String(d._id),
    documentType: String(d.documentType),
    documentTypeLabel: DOCUMENT_TYPE_LABEL[String(d.documentType)] ?? String(d.documentType),
    documentUrl: String(d.documentUrl || ''),
    uploadedAt: String(d.uploadedAt || '')
  }))
}

/**
 * Determine which required document types are still missing for a request.
 * Reviewer-requested extras (`role-request.requestedDocumentTypes`) are folded
 * into the required set so the "missing" list reflects both base requirements
 * and any follow-ups the admin asked for.
 */
export function missingDocumentTypes(
  role: RoleKind,
  uploaded: Array<{ documentType: string }>,
  requestedExtras: string[] = []
): string[] {
  const base = REQUIRED_DOCUMENT_TYPES[role] ?? []
  const required = Array.from(new Set([...base, ...requestedExtras]))
  const have = new Set(uploaded.map((d) => String(d.documentType)))
  return required.filter((t) => !have.has(t))
}

/**
 * Derives the application sub-stage from the top-level status, the uploaded
 * docs, and whether a reviewer has opened the case. The result is suitable
 * for both UI badges and storage on the role-request document.
 */
export function deriveSubstage(opts: {
  status: RoleStatus
  role: RoleKind
  uploadedDocumentTypes: string[]
  requestedExtras?: string[]
  reviewerStartedAt?: string | Date | null
}): RoleSubstage {
  if (opts.status === 'approved' || opts.status === 'rejected') return 'decided'
  const missing = missingDocumentTypes(
    opts.role,
    opts.uploadedDocumentTypes.map((t) => ({ documentType: t })),
    opts.requestedExtras ?? []
  )
  if (missing.length > 0) return 'docs_required'
  if (opts.reviewerStartedAt) return 'reviewing'
  return 'submitted'
}

export type NextStep = {
  label: string
  href: string
  tone: 'amber' | 'indigo' | 'emerald' | 'red' | 'blue'
}

/**
 * Returns the headline next-step CTA copy used by the dashboard banner.
 */
export function nextStepFor(
  substage: RoleSubstage,
  status: RoleStatus,
  role: RoleKind,
  missing: string[]
): NextStep {
  if (status === 'approved') {
    const hubs: Record<RoleKind, string> = {
      landlord: '/landlord/properties',
      property_manager: '/pm/profile',
      agent: '/agent/profile'
    }
    return { label: `Open ${ROLE_LABEL[role]} hub`, href: hubs[role], tone: 'emerald' }
  }
  if (status === 'rejected') {
    return { label: 'Re-apply', href: '/onboarding/role', tone: 'red' }
  }
  if (substage === 'docs_required') {
    const first = missing[0]
    const what = first ? DOCUMENT_TYPE_LABEL[first] ?? first : 'document'
    return {
      label: `Upload ${what}`,
      href: '/applications/role-requests',
      tone: 'amber'
    }
  }
  if (substage === 'reviewing') {
    return { label: 'View full status', href: '/applications/role-requests', tone: 'indigo' }
  }
  return { label: 'View full status', href: '/applications/role-requests', tone: 'blue' }
}

/**
 * Builds the enriched payload returned by the `my-role-applications`
 * service for one role-request.
 */
export async function buildApplicationView(
  app: Application,
  rr: any
): Promise<Record<string, unknown> | null> {
  if (!rr || !rr._id) return null
  const role = rr.role as RoleKind
  const status = (rr.status || 'pending') as RoleStatus
  const documents = await loadDocumentsForRequest(app, String(rr._id))
  const requestedExtras: string[] = Array.isArray(rr.requestedDocumentTypes) ? rr.requestedDocumentTypes : []
  const missing = missingDocumentTypes(role, documents, requestedExtras)
  const substage = deriveSubstage({
    status,
    role,
    uploadedDocumentTypes: documents.map((d) => d.documentType),
    requestedExtras,
    reviewerStartedAt: rr.reviewerStartedAt ?? null
  })

  const createdAt = rr.createdAt ? new Date(rr.createdAt) : null
  const slaDueAt = rr.slaDueAt
    ? new Date(rr.slaDueAt)
    : createdAt
      ? addBusinessDays(createdAt, SLA_BUSINESS_DAYS)
      : null

  const daysOpen = createdAt ? daysBetween(createdAt, new Date()) : 0
  const overdue = !!(slaDueAt && status === 'pending' && Date.now() > slaDueAt.getTime())
  const next = nextStepFor(substage, status, role, missing)

  return {
    _id: String(rr._id),
    userId: String(rr.userId),
    role,
    roleLabel: ROLE_LABEL[role],
    status,
    substage,
    message: rr.message ?? null,
    notes: rr.notes ?? null,
    reviewedAt: rr.reviewedAt ?? null,
    reviewedBy: rr.reviewedBy ?? null,
    reviewerStartedAt: rr.reviewerStartedAt ?? null,
    createdAt: rr.createdAt ?? null,
    slaDueAt: slaDueAt ? slaDueAt.toISOString() : null,
    daysOpen,
    overdue,
    requiredDocumentTypes: REQUIRED_DOCUMENT_TYPES[role] ?? [],
    requestedDocumentTypes: requestedExtras,
    missingDocumentTypes: missing,
    missingDocumentLabels: missing.map((t) => DOCUMENT_TYPE_LABEL[t] ?? t),
    documents,
    nextStep: next
  }
}
