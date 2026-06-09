/**
 * Notification template registry.
 *
 * For each `eventKey` produced by `createUserNotification`, this registry can
 * provide:
 *   - `emailSubject(notif)`   override the email subject line
 *   - `emailHeading(notif)`   override the H1-style heading in the email
 *   - `emailIntro(notif)`     pre-message paragraph (e.g. "Great news!")
 *   - `emailExtra(notif)`     extra HTML rendered below the body (lists, KPIs, etc.)
 *   - `ctaLabel(notif)`       override the CTA button label
 *   - `smsText(notif)`        SMS body (kept under 160 chars when possible)
 *   - `smsDisabled(notif)`    return `true` to skip SMS for this event
 *
 * All fields are optional. The generic email/SMS pipeline falls back to
 * `notif.title` + `notif.body` when no template is registered.
 *
 * Reference event keys (kept in sync with services):
 *   pm_listing_request.created
 *   pm_listing_request.accepted
 *   pm_listing_request.rejected
 *   pm_listing_request.countered
 *   pm_listing_request.recountered
 *   pm_assignment.created
 *   agent_listing_request.created
 *   agent_listing_request.accepted
 *   agent_listing_request.rejected
 *   agent_listing_request.countered
 *   agent_listing_request.recountered
 *   agent_assignment.created
 *   role_request.created
 *   role_request.approved
 *   role_request.rejected
 *   agent_payout.created
 *   agent_payout.paid
 *   pm_payout.created
 *   pm_payout.paid
 */

export type NotificationLike = {
  userId: string
  eventKey: string
  category?: string
  title: string
  body?: string
  linkUrl?: string
  relatedService?: string
  relatedId?: string
  metadata?: Record<string, unknown> | null
}

export type NotificationTemplate = {
  emailSubject?: (n: NotificationLike) => string
  emailHeading?: (n: NotificationLike) => string
  emailIntro?: (n: NotificationLike) => string
  emailExtra?: (n: NotificationLike) => string
  ctaLabel?: (n: NotificationLike) => string
  smsText?: (n: NotificationLike) => string
  smsDisabled?: (n: NotificationLike) => boolean
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const appName = () => process.env.APP_NAME || 'CribHub'

const truncateSms = (s: string, max = 320) => (s.length > max ? `${s.slice(0, max - 1)}…` : s)

const calloutBox = (label: string, value: string, color: 'emerald' | 'amber' | 'red' | 'blue' = 'blue') => {
  const palette: Record<string, { bg: string; bd: string; ink: string }> = {
    emerald: { bg: '#ecfdf5', bd: '#a7f3d0', ink: '#065f46' },
    amber:   { bg: '#fffbeb', bd: '#fcd34d', ink: '#92400e' },
    red:     { bg: '#fef2f2', bd: '#fecaca', ink: '#991b1b' },
    blue:    { bg: '#eff6ff', bd: '#bfdbfe', ink: '#1e3a8a' }
  }
  const c = palette[color] ?? palette.blue
  return `
    <div style="margin:14px 0 0;padding:12px 14px;background:${c.bg};border:1px solid ${c.bd};border-radius:6px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:${c.ink};opacity:.75;">${escapeHtml(label)}</div>
      <div style="margin-top:4px;font-size:14px;font-weight:600;color:${c.ink};">${escapeHtml(value)}</div>
    </div>
  `
}

const moneyLine = (n: NotificationLike): string | null => {
  const md = (n.metadata || {}) as Record<string, any>
  const amount = md.amount ?? md.value
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return null
  const currency = String(md.currency || 'GHS').toUpperCase()
  return `${currency} ${amount.toLocaleString()}`
}

const templates: Record<string, NotificationTemplate> = {
  // ── Property-manager listing-request lifecycle ─────────────────────────────
  'pm_listing_request.created': {
    emailSubject: () => `New management request — ${appName()}`,
    emailHeading: () => 'A property manager would like to help manage your listing',
    emailIntro: () =>
      'Review their profile and proposed fee. You can accept, decline, or counter their terms.',
    ctaLabel: () => 'Review request',
    smsText: () =>
      `${appName()}: A property manager has requested to manage your listing. Open the app to review their profile and fee.`
  },
  'pm_listing_request.accepted': {
    emailSubject: () => `Management request accepted — ${appName()}`,
    emailHeading: () => '🎉 Your management request was accepted',
    emailIntro: () =>
      'The landlord has accepted your request. You can now coordinate with them directly from your dashboard.',
    ctaLabel: () => 'Open property',
    smsText: () =>
      `${appName()}: A landlord accepted your management request. Open the app to coordinate.`
  },
  'pm_listing_request.rejected': {
    emailSubject: () => `Management request declined — ${appName()}`,
    emailHeading: () => 'Your management request was not accepted',
    emailIntro: () =>
      'The landlord chose not to proceed at this time. You can browse other listings and try again.',
    ctaLabel: () => 'Browse listings',
    smsText: () =>
      `${appName()}: Your management request was not accepted. Browse other listings on the app.`
  },
  'pm_listing_request.countered': {
    emailSubject: () => `Landlord proposed different terms — ${appName()}`,
    emailHeading: () => 'The landlord countered your fee proposal',
    emailIntro: () => 'Review their proposed terms — accept, decline, or send a revised proposal.',
    ctaLabel: () => 'View counter-offer',
    smsText: () =>
      `${appName()}: A landlord countered your management fee proposal. Open the app to review.`
  },
  'pm_listing_request.recountered': {
    emailSubject: () => `Property manager updated their proposal — ${appName()}`,
    emailHeading: () => 'The property manager sent a new proposal',
    emailIntro: () => 'Their revised terms are ready for your review.',
    ctaLabel: () => 'Review proposal',
    smsText: () =>
      `${appName()}: A property manager updated their fee proposal. Open the app to review.`
  },
  'pm_assignment.created': {
    emailSubject: () => `You were assigned to manage a property — ${appName()}`,
    emailHeading: () => 'New property assignment',
    emailIntro: () =>
      'A landlord assigned you to manage one of their properties. Open the listing to coordinate.',
    ctaLabel: () => 'Open property',
    smsText: () =>
      `${appName()}: You were assigned to manage a new property. Open the app to coordinate with the landlord.`
  },

  // ── Agent listing-request lifecycle ────────────────────────────────────────
  'agent_listing_request.created': {
    emailSubject: () => `New agent representation request — ${appName()}`,
    emailHeading: () => 'An agent would like to represent your listing',
    emailIntro: () =>
      'Review their profile and commission proposal. Accept, decline, or counter their terms.',
    ctaLabel: () => 'Review request',
    smsText: () =>
      `${appName()}: An agent requested to represent your listing. Open the app to review.`
  },
  'agent_listing_request.accepted': {
    emailSubject: () => `Representation accepted — ${appName()}`,
    emailHeading: () => '🎉 Your representation request was accepted',
    emailIntro: () => 'The landlord has accepted your request. You can now manage this listing.',
    ctaLabel: () => 'Open property',
    smsText: () =>
      `${appName()}: A landlord accepted your representation request. Open the app to coordinate.`
  },
  'agent_listing_request.rejected': {
    emailSubject: () => `Representation request declined — ${appName()}`,
    emailHeading: () => 'Your representation request was not accepted',
    emailIntro: () =>
      'The landlord chose another agent or option for this listing. Browse other listings to try again.',
    ctaLabel: () => 'Browse listings',
    smsText: () =>
      `${appName()}: Your representation request was not accepted. Browse other listings on the app.`
  },
  'agent_listing_request.countered': {
    emailSubject: () => `Landlord proposed different terms — ${appName()}`,
    emailHeading: () => 'The landlord countered your commission proposal',
    emailIntro: () => 'Review their proposed terms and respond.',
    ctaLabel: () => 'View counter-offer',
    smsText: () =>
      `${appName()}: A landlord countered your commission proposal. Open the app to review.`
  },
  'agent_listing_request.recountered': {
    emailSubject: () => `Agent updated their proposal — ${appName()}`,
    emailHeading: () => 'The agent sent a new proposal',
    emailIntro: () => 'Their revised terms are ready for your review.',
    ctaLabel: () => 'Review proposal',
    smsText: () =>
      `${appName()}: An agent updated their commission proposal. Open the app to review.`
  },
  'agent_assignment.created': {
    emailSubject: () => `You were assigned to a property — ${appName()}`,
    emailHeading: () => 'New representation assignment',
    emailIntro: () =>
      'A landlord assigned you as the agent for one of their properties. Open the listing to coordinate.',
    ctaLabel: () => 'Open property',
    smsText: () =>
      `${appName()}: You were assigned as agent for a new property. Open the app to coordinate.`
  },

  // ── Role-request lifecycle ─────────────────────────────────────────────────
  'role_request.created': {
    emailSubject: () => `New role request — ${appName()}`,
    emailHeading: () => 'New verification request awaiting review',
    emailIntro: () => 'A user has applied for an elevated role. Please review their profile and documents.',
    ctaLabel: () => 'Review requests',
    smsDisabled: () => true // admins typically get many; keep SMS off by default
  },
  'role_request.approved': {
    emailSubject: () => `Your role has been approved — ${appName()}`,
    emailHeading: () => '🎉 Welcome — your role is now active',
    emailIntro: () => 'Your verification is complete. You now have full access to the role features.',
    ctaLabel: () => 'Get started',
    smsText: () => `${appName()}: Your role request was approved! Sign in to get started.`
  },
  'role_request.rejected': {
    emailSubject: () => `Role request update — ${appName()}`,
    emailHeading: () => 'Your role request was not approved',
    emailIntro: () => 'Please review the note from our team and resubmit when ready.',
    ctaLabel: () => 'Open dashboard',
    smsText: () => `${appName()}: Your role request was not approved. Sign in to review the details.`
  },

  // ── Payouts ────────────────────────────────────────────────────────────────
  'agent_payout.created': {
    emailSubject: () => `Commission scheduled — ${appName()}`,
    emailHeading: () => 'A new commission has been scheduled',
    emailIntro: () => 'A landlord scheduled a commission payout for one of your representations.',
    emailExtra: (n) => {
      const amt = moneyLine(n)
      return amt ? calloutBox('Amount', amt, 'emerald') : ''
    },
    ctaLabel: () => 'View commissions',
    smsText: (n) => {
      const amt = moneyLine(n)
      return `${appName()}: A commission${amt ? ` of ${amt}` : ''} was scheduled. View in app.`
    }
  },
  'agent_payout.paid': {
    emailSubject: () => `Commission marked as paid — ${appName()}`,
    emailHeading: () => '✅ Your commission was paid',
    emailIntro: () => 'The landlord recorded this commission as paid. Thanks for using CribHub.',
    emailExtra: (n) => {
      const amt = moneyLine(n)
      return amt ? calloutBox('Amount paid', amt, 'emerald') : ''
    },
    ctaLabel: () => 'View commissions',
    smsText: (n) => {
      const amt = moneyLine(n)
      return `${appName()}: Commission${amt ? ` of ${amt}` : ''} marked as paid. View in app.`
    }
  },
  'pm_payout.created': {
    emailSubject: () => `Management fee scheduled — ${appName()}`,
    emailHeading: () => 'A new management fee has been scheduled',
    emailIntro: () => 'A landlord scheduled a management fee payout for a property you manage.',
    emailExtra: (n) => {
      const amt = moneyLine(n)
      return amt ? calloutBox('Amount', amt, 'emerald') : ''
    },
    ctaLabel: () => 'View fees',
    smsText: (n) => {
      const amt = moneyLine(n)
      return `${appName()}: A management fee${amt ? ` of ${amt}` : ''} was scheduled. View in app.`
    }
  },
  'pm_payout.paid': {
    emailSubject: () => `Management fee marked as paid — ${appName()}`,
    emailHeading: () => '✅ Your management fee was paid',
    emailIntro: () => 'The landlord recorded this fee as paid. Thanks for using CribHub.',
    emailExtra: (n) => {
      const amt = moneyLine(n)
      return amt ? calloutBox('Amount paid', amt, 'emerald') : ''
    },
    ctaLabel: () => 'View fees',
    smsText: (n) => {
      const amt = moneyLine(n)
      return `${appName()}: Management fee${amt ? ` of ${amt}` : ''} marked as paid. View in app.`
    }
  }
}

export function getTemplate(eventKey: string): NotificationTemplate | undefined {
  return templates[eventKey]
}

/**
 * Resolve an SMS body for a notification. Returns `null` to indicate "skip SMS".
 */
export function renderSmsBody(n: NotificationLike): string | null {
  const tpl = getTemplate(n.eventKey)
  if (tpl?.smsDisabled?.(n)) return null
  const fromTpl = tpl?.smsText?.(n)
  const base = fromTpl || `${appName()}: ${n.title}${n.body ? ` — ${n.body}` : ''}`
  return truncateSms(base.replace(/\s+/g, ' ').trim())
}

export type RenderedEmail = {
  subject: string
  heading: string
  innerHtml: string
  ctaLabel: string
  ctaUrl?: string
}

/**
 * Compose the email parts for a notification using the registry, falling back
 * to the generic `title`/`body` rendering.
 */
export function renderEmailParts(
  n: NotificationLike,
  recipientName: string
): RenderedEmail {
  const tpl = getTemplate(n.eventKey)
  const safeTitle = escapeHtml(String(n.title))
  const heading = escapeHtml(String(tpl?.emailHeading?.(n) || n.title))
  const intro = tpl?.emailIntro?.(n)
  const extra = tpl?.emailExtra?.(n)
  const body = n.body ? escapeHtml(String(n.body)).replace(/\n/g, '<br/>') : ''

  const innerHtml = `
    <p style="margin:0 0 18px;font-size:15px;color:#374151;">
      Hi <strong>${escapeHtml(recipientName)}</strong>,
    </p>
    <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#111827;line-height:1.35;">
      ${heading}
    </p>
    ${intro ? `<p style="margin:8px 0 0;font-size:14px;color:#4b5563;line-height:1.7;">${escapeHtml(intro)}</p>` : ''}
    ${body ? `<p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.7;">${body}</p>` : ''}
    ${extra ? extra : ''}
  `

  return {
    subject: tpl?.emailSubject?.(n) || `${safeTitle} — ${appName()}`,
    heading,
    innerHtml,
    ctaLabel: tpl?.ctaLabel?.(n) || 'View in CribHub',
    ctaUrl: n.linkUrl
  }
}
