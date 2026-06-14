/**
 * trigger-email.ts — fires a real backend event so the recipient receives a
 * genuine notification email via the actual production pipeline.
 *
 * What it does (default flow):
 *   1. Resolves (or creates) the recipient user.
 *   2. Removes any prior pending request + any prior grant for the chosen role
 *      so the run is idempotent.
 *   3. Creates a `role-requests` row in status=`pending` (internal call —
 *      bypasses the "only self" guard so the script can stand in for the user).
 *   4. Patches that row to status=`approved` (internal call — bypasses the
 *      admin guard so the script can stand in for an admin reviewer).
 *   5. The service's `after.patch` hook then:
 *        • grants the role via `user-roles.create(...)`, and
 *        • calls `createUserNotification(...)` with eventKey
 *          `role_request.approved`,
 *      which fires the `emailRecipientOnNotificationCreated` after-hook on the
 *      `user-notifications` service, which sends an HTML email through the
 *      `mailer` service (real SMTP — no spies or stubs).
 *
 * Why this event?
 *   role-request approvals are self-contained: they need no properties,
 *   inquiries, or third parties to be present, so they work against a fresh
 *   database. The pipeline travelled is identical to what an admin clicking
 *   "Approve" in the verification dashboard exercises, so the email you
 *   receive is the real production template byte-for-byte.
 *
 * USAGE
 *   npm run trigger:email                              # → kpawuu@gmail.com, role=landlord
 *   npm run trigger:email -- kpawuu@gmail.com agent    # custom email + role
 *   npm run trigger:email -- you@example.com           # custom email, default role
 *   TRIGGER_EMAIL_RECIPIENT=you@x.com npm run trigger:email
 *
 *   Roles: landlord | property_manager | agent
 */

import 'dotenv/config'
import { app } from '../src/app'

type RoleKind = 'landlord' | 'property_manager' | 'agent'

// ─── CLI / env ──────────────────────────────────────────────────────
const argv = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const RECIPIENT_EMAIL = (argv[0] || process.env.TRIGGER_EMAIL_RECIPIENT || 'kpawuu@gmail.com').toLowerCase()
const RECIPIENT_NAME = process.env.TRIGGER_EMAIL_NAME || 'Email Test User'
const ROLE = ((argv[1] || process.env.TRIGGER_EMAIL_ROLE || 'landlord') as RoleKind)
const PASSWORD = process.env.SEED_TEST_USERS_PASSWORD || 'CribHubTest1!'

if (!(['landlord', 'property_manager', 'agent'] as RoleKind[]).includes(ROLE)) {
  console.error(`Invalid role "${ROLE}". Use one of: landlord | property_manager | agent`)
  process.exit(2)
}

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const C = {
  reset: useColor ? '\x1b[0m' : '',
  dim:   useColor ? '\x1b[2m' : '',
  bold:  useColor ? '\x1b[1m' : '',
  green: useColor ? '\x1b[32m' : '',
  yel:   useColor ? '\x1b[33m' : '',
  red:   useColor ? '\x1b[31m' : '',
  cya:   useColor ? '\x1b[36m' : ''
}

const internal = () => ({ provider: undefined } as any)
const listOf = (res: any): any[] => (Array.isArray(res) ? res : res?.data || [])

const ROLE_LABEL: Record<RoleKind, string> = {
  landlord: 'Landlord',
  property_manager: 'Property Manager',
  agent: 'Agent'
}

// ─── mailer trace ───────────────────────────────────────────────────
type Sent = { to: string; subject: string; bytes: number; ok: boolean; durationMs: number; errMsg?: string }
const sent: Sent[] = []

function traceMailer(): void {
  const mailer = (app as any).service('mailer')
  if (!mailer?.create) return
  const original = mailer.create.bind(mailer)
  mailer.create = async (data: any, params: any) => {
    const to = String(data?.to || '?')
    const subject = String(data?.subject || '?')
    const bytes = (data?.html ? Buffer.byteLength(String(data.html), 'utf8') : 0)
                + (data?.text ? Buffer.byteLength(String(data.text), 'utf8') : 0)
    const t0 = Date.now()
    try {
      const out = await original(data, params)
      sent.push({ to, subject, bytes, ok: true, durationMs: Date.now() - t0 })
      return out
    } catch (err: any) {
      sent.push({ to, subject, bytes, ok: false, durationMs: Date.now() - t0, errMsg: err?.message || String(err) })
      throw err
    }
  }
}

// ─── user helpers ───────────────────────────────────────────────────
async function ensureUser(): Promise<any> {
  const res = await (app as any).service('users').find({ query: { email: RECIPIENT_EMAIL }, paginate: false, ...internal() })
  let user = listOf(res)[0]
  if (!user) {
    user = await (app as any).service('users').create(
      { email: RECIPIENT_EMAIL, password: PASSWORD, fullName: RECIPIENT_NAME } as any,
      internal()
    )
    console.log(`  ${C.green}+${C.reset} created user ${C.bold}${RECIPIENT_EMAIL}${C.reset}`)
  } else {
    console.log(`  ${C.dim}·${C.reset} reused user  ${C.bold}${RECIPIENT_EMAIL}${C.reset}`)
  }
  // Make sure email notifications are enabled and account is verified
  user = await (app as any).service('users').patch(
    String(user._id),
    { isVerified: true, emailNotifications: true, fullName: user.fullName || RECIPIENT_NAME } as any,
    internal()
  )
  return user
}

/**
 * Remove any prior pending role-request and any prior grant for this role so
 * the script is idempotent across runs.
 */
async function clearPriorState(userId: string): Promise<void> {
  const db = await (app as any).get('mongodbClient')

  const rrPending = await db.collection('role_requests').deleteMany({
    userId, role: ROLE, status: 'pending'
  })
  if (rrPending.deletedCount > 0) {
    console.log(`  ${C.dim}·${C.reset} cleared ${rrPending.deletedCount} prior pending ${ROLE} request(s)`)
  }

  const ur = await db.collection('user_roles').deleteMany({ userId, role: ROLE })
  if (ur.deletedCount > 0) {
    console.log(`  ${C.dim}·${C.reset} cleared ${ur.deletedCount} prior ${ROLE} grant(s)`)
  }
}

// ─── main ───────────────────────────────────────────────────────────
async function main(): Promise<number> {
  console.log(`${C.bold}CribHub — trigger real email event${C.reset}`)
  console.log(`  recipient : ${C.bold}${RECIPIENT_EMAIL}${C.reset}`)
  console.log(`  event     : role-request approval (${C.bold}${ROLE_LABEL[ROLE]}${C.reset})`)
  console.log(`  smtp host : ${process.env.MAIL_HOST || `${C.red}NOT CONFIGURED${C.reset}`}`)
  console.log(`  emails    : ${process.env.NOTIFICATION_EMAIL_DISABLED === 'true' ? `${C.red}GLOBALLY DISABLED${C.reset}` : `${C.green}enabled${C.reset}`}`)
  console.log('')

  if (!process.env.MAIL_HOST || !process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
    console.log(`${C.red}!${C.reset} SMTP credentials missing — the after-hook will short-circuit and no email will leave the host.`)
    console.log(`  Set MAIL_HOST / MAIL_USERNAME / MAIL_PASSWORD in .env to deliver.\n`)
  }

  await (app as any).get('mongodbClient')
  traceMailer()

  // Step 1: user
  console.log(`${C.cya}1.${C.reset} Resolving recipient user…`)
  const user = await ensureUser()
  const userId = String(user._id)

  // Step 2: clear prior state (idempotency)
  console.log(`${C.cya}2.${C.reset} Clearing prior role-request / grant for ${ROLE}…`)
  await clearPriorState(userId)

  // Step 3: create the pending request (internal — skips "self only" guard)
  console.log(`${C.cya}3.${C.reset} Creating pending role-request…`)
  const rr = await (app as any).service('role-requests').create(
    {
      userId,
      role: ROLE,
      message: `Triggered by scripts/trigger-email.ts at ${new Date().toISOString()}`
    } as any,
    internal()
  )
  console.log(`  ${C.green}✓${C.reset} role-request ${C.dim}${rr._id}${C.reset} status=${rr.status}`)
  const sentBeforeApproval = sent.length
  if (sentBeforeApproval > 0) {
    console.log(`  ${C.dim}↪ ${sentBeforeApproval} admin-notification email(s) fired by create after-hook${C.reset}`)
  }

  // Step 4: approve it (internal — skips admin guard)
  console.log(`${C.cya}4.${C.reset} Approving the request…`)
  const approved = await (app as any).service('role-requests').patch(
    String(rr._id),
    { status: 'approved', notes: 'Auto-approved by scripts/trigger-email.ts' } as any,
    internal()
  )
  console.log(`  ${C.green}✓${C.reset} role-request status=${approved.status}`)

  // Allow any async after-hook side-effects to settle (mailer is awaited
  // already, but log this so it's obvious nothing is detached).
  await new Promise((r) => setTimeout(r, 250))

  // ─── report ─────────────────────────────────────────────────────
  console.log('')
  console.log(`${C.bold}${C.cya}━━ Email pipeline result ━━${C.reset}`)
  if (sent.length === 0) {
    console.log(`  ${C.red}✘${C.reset} No mailer.create call was made.`)
    console.log(`    Likely cause: SMTP not configured, NOTIFICATION_EMAIL_DISABLED=true,`)
    console.log(`    or the user has emailNotifications=false.`)
    return 1
  }

  for (const m of sent) {
    const mark = m.ok ? `${C.green}✓${C.reset}` : `${C.red}✘${C.reset}`
    console.log(`  ${mark} to ${C.bold}${m.to}${C.reset}  ${C.dim}${m.durationMs}ms${C.reset}`)
    console.log(`      subject: "${m.subject}"`)
    console.log(`      payload: ${(m.bytes / 1024).toFixed(1)} KiB`)
    if (!m.ok && m.errMsg) console.log(`      ${C.red}error: ${m.errMsg}${C.reset}`)
  }

  const recipientMails = sent.filter((s) => s.to.toLowerCase().includes(RECIPIENT_EMAIL))
  const okRecipient = recipientMails.find((s) => s.ok)

  console.log('')
  if (okRecipient) {
    console.log(`${C.green}✓ ${C.bold}${RECIPIENT_EMAIL}${C.reset}${C.green} should receive: "${okRecipient.subject}"${C.reset}`)
    console.log(`  Check the inbox (and spam folder) in the next few seconds.`)
    return 0
  }

  console.log(`${C.yel}⚠ No email was successfully delivered to ${RECIPIENT_EMAIL}.${C.reset}`)
  return 1
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`\n${C.red}FATAL: ${err?.message || err}${C.reset}`)
    console.error(err?.stack)
    process.exit(2)
  })
