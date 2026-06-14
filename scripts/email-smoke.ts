/**
 * Email smoke test — exercises every notification template against a real user.
 *
 * Boots the Feathers app in-process and:
 *   1. Resolves (or creates) a test user with a configurable email address
 *      (default: `kpawuu@gmail.com`, override with CLI arg or
 *      `SMOKE_EMAIL_RECIPIENT` env var).
 *   2. Triggers the auth-management pipeline (`resendVerifySignup`,
 *      `sendResetPwd`) so the signup / password-reset emails are exercised.
 *   3. Fires `createUserNotification(...)` once per registered event key in
 *      `src/utils/notification-templates.ts`, which causes the
 *      `emailRecipientOnNotificationCreated` after-hook to render the template
 *      and send via the configured SMTP host.
 *   4. Captures every `mailer.create(...)` call via a service hook so we know
 *      exactly what was attempted (subject, recipient, character counts) —
 *      independent of whether the SMTP transport actually delivered.
 *
 * MODES
 *   live (default when SMTP is configured)
 *     Actually sends each email. Watch the recipient's inbox.
 *   dry-run (default when SMTP is NOT configured, or pass --dry-run)
 *     Replaces the real mailer's `create` method with a spy so nothing leaves
 *     the host. Useful in CI or when you just want to validate template
 *     rendering.
 *
 * USAGE
 *   npm run email:smoke -- kpawuu@gmail.com                  # live, real send
 *   npm run email:smoke -- kpawuu@gmail.com --dry-run        # capture only
 *   npm run email:smoke -- --cleanup                         # delete test data
 *   SMOKE_EMAIL_RECIPIENT=you@example.com npm run email:smoke
 *
 * SAFETY
 *   • Re-runs reuse the existing user (looked up by email) — no duplicate
 *     accounts are created.
 *   • Notification rows persist (admins can inspect them in the admin UI).
 *     Pass `--cleanup` to delete the user + their notifications afterwards.
 *   • Even in live mode, only the recipient address you supplied receives mail.
 */

import 'dotenv/config'
import { ObjectId } from 'mongodb'
import { app } from '../src/app'
import { createUserNotification } from '../src/utils/create-user-notification'

// ─── CLI / env ──────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const cleanupOnly = argv.includes('--cleanup')
const dryRunFlag = argv.includes('--dry-run')
const liveFlag = argv.includes('--live')
const templatesOnly = argv.includes('--templates-only')
const authOnly = argv.includes('--auth-only')

// First non-flag arg is the recipient.
const positional = argv.filter((a) => !a.startsWith('--'))
const RECIPIENT_EMAIL = (positional[0] || process.env.SMOKE_EMAIL_RECIPIENT || 'kpawuu@gmail.com').toLowerCase()
const RECIPIENT_NAME = process.env.SMOKE_EMAIL_NAME || 'Email Smoke Tester'
const PASSWORD = process.env.SEED_TEST_USERS_PASSWORD || 'CribHubTest1!'

// ─── output ─────────────────────────────────────────────────────────
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

type Result = {
  step: string
  ok: boolean
  detail?: string
  errMsg?: string
  subject?: string
  bytes?: number
  durationMs?: number
}
const results: Result[] = []
let currentStep = ''

const log = {
  section: (title: string) => console.log(`\n${C.bold}${C.cya}━━ ${title} ━━${C.reset}`),
  ok:      (step: string, detail?: string)                            => results.push({ step, ok: true,  detail }),
  fail:    (step: string, err: unknown)                                => results.push({ step, ok: false, errMsg: err instanceof Error ? err.message : String(err) }),
  mail:    (step: string, subject: string, bytes: number, durationMs: number) =>
             results.push({ step, ok: true, subject, bytes, durationMs })
}

// ─── helpers ────────────────────────────────────────────────────────
const internal = () => ({ provider: undefined } as any)
const listOf = (res: any): any[] => (Array.isArray(res) ? res : res?.data || [])
const findAs = async (svc: string, params: any, query: any = {}) =>
  await (app as any).service(svc).find({ ...params, query })

// ─── mailer spy ─────────────────────────────────────────────────────
type CapturedMail = { to: string; subject: string; htmlBytes: number; textBytes: number; sentAt: string; durationMs: number; ok: boolean; errMsg?: string }
const captured: CapturedMail[] = []
let dryRun = dryRunFlag || (!liveFlag && !smtpConfigured())

function smtpConfigured(): boolean {
  return Boolean(process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD)
}

/**
 * Wrap the mailer service's `create` so every send attempt is recorded.
 * In dry-run mode, the call is short-circuited and treated as a success.
 */
function wireMailerSpy(): void {
  const mailer = (app as any).service('mailer')
  if (!mailer) {
    console.log(`${C.red}!${C.reset} mailer service not registered — emails cannot be sent`)
    return
  }
  // feathers-mailer exposes `.create` on the service instance.
  const originalCreate = mailer.create.bind(mailer)
  mailer.create = async (data: any, params: any) => {
    const subject = String(data?.subject || '(no subject)')
    const to = String(data?.to || '(no recipient)')
    const htmlBytes = data?.html ? Buffer.byteLength(String(data.html), 'utf8') : 0
    const textBytes = data?.text ? Buffer.byteLength(String(data.text), 'utf8') : 0
    const t0 = Date.now()
    if (dryRun) {
      const rec: CapturedMail = { to, subject, htmlBytes, textBytes, sentAt: new Date().toISOString(), durationMs: 0, ok: true }
      captured.push(rec)
      return { messageId: `<dry-run-${captured.length}@local>` } as any
    }
    try {
      const out = await originalCreate(data, params)
      const rec: CapturedMail = { to, subject, htmlBytes, textBytes, sentAt: new Date().toISOString(), durationMs: Date.now() - t0, ok: true }
      captured.push(rec)
      return out
    } catch (err: any) {
      const rec: CapturedMail = { to, subject, htmlBytes, textBytes, sentAt: new Date().toISOString(), durationMs: Date.now() - t0, ok: false, errMsg: err?.message || String(err) }
      captured.push(rec)
      throw err
    }
  }
}

// ─── user setup ─────────────────────────────────────────────────────
async function findUserByEmail(email: string): Promise<any | null> {
  const res = await findAs('users', internal(), { email })
  return listOf(res)[0] || null
}

async function ensureRecipientUser(): Promise<any> {
  let user = await findUserByEmail(RECIPIENT_EMAIL)
  if (!user) {
    user = await (app as any).service('users').create(
      { email: RECIPIENT_EMAIL, password: PASSWORD, fullName: RECIPIENT_NAME } as any,
      internal()
    )
    console.log(`  ${C.green}+${C.reset} created test user ${C.bold}${RECIPIENT_EMAIL}${C.reset}`)
  } else {
    console.log(`  ${C.dim}·${C.reset} reused test user  ${C.bold}${RECIPIENT_EMAIL}${C.reset}`)
  }
  user = await (app as any).service('users').patch(
    String(user._id),
    { isVerified: true, emailNotifications: true, fullName: user.fullName || RECIPIENT_NAME } as any,
    internal()
  )
  return user
}

async function cleanupTestData(): Promise<void> {
  console.log(`\n${C.bold}${C.yel}━━ Cleanup ━━${C.reset}`)
  const db = await (app as any).get('mongodbClient')
  const user = await findUserByEmail(RECIPIENT_EMAIL)
  if (!user) {
    console.log(`  ${C.dim}·${C.reset} no test user found, nothing to delete`)
    return
  }
  const uid = String(user._id)
  const userOid = ObjectId.isValid(uid) ? new ObjectId(uid) : (uid as any)
  const n1 = await db.collection('user_notifications').deleteMany({ userId: uid })
  const n2 = await db.collection('user_roles').deleteMany({ userId: uid })
  const n3 = await db.collection('users').deleteOne({ _id: userOid })
  console.log(`  ${C.green}✓${C.reset} deleted user_notifications:${n1.deletedCount} user_roles:${n2.deletedCount} users:${n3.deletedCount}`)
}

// ─── auth-management triggers ───────────────────────────────────────
async function exerciseAuthManagement(user: any): Promise<void> {
  log.section('Auth-management emails (resendVerifySignup, sendResetPwd)')
  const am = (app as any).service('auth-management')
  if (!am) {
    console.log(`  ${C.red}✘${C.reset} auth-management service not registered`)
    return
  }
  // resendVerifySignup refuses if the user is already verified. Temporarily
  // mark them unverified so we can exercise the email, then restore.
  const wasVerified = Boolean(user?.isVerified)
  try {
    if (wasVerified) {
      await (app as any).service('users').patch(String(user._id), { isVerified: false } as any, internal())
    }
    await am.create({ action: 'resendVerifySignup', value: { email: RECIPIENT_EMAIL } }, internal())
    log.ok('resendVerifySignup', `→ ${RECIPIENT_EMAIL}`)
    console.log(`  ${C.green}✓${C.reset} resendVerifySignup`)
  } catch (err) {
    log.fail('resendVerifySignup', err)
    console.log(`  ${C.red}✘${C.reset} resendVerifySignup: ${(err as Error).message}`)
  } finally {
    try {
      await (app as any).service('users').patch(String(user._id), { isVerified: true } as any, internal())
    } catch {
      /* best-effort restore */
    }
  }

  try {
    await am.create({ action: 'sendResetPwd', value: { email: RECIPIENT_EMAIL } }, internal())
    log.ok('sendResetPwd', `→ ${RECIPIENT_EMAIL}`)
    console.log(`  ${C.green}✓${C.reset} sendResetPwd`)
  } catch (err) {
    log.fail('sendResetPwd', err)
    console.log(`  ${C.red}✘${C.reset} sendResetPwd: ${(err as Error).message}`)
  }
}

// ─── template triggers ──────────────────────────────────────────────
type TemplateCase = {
  key: string
  category: string
  title: string
  body: string
  linkUrl?: string
  metadata?: Record<string, unknown>
}

const EVENT_CASES: TemplateCase[] = [
  // PM listing-request lifecycle
  { key: 'pm_listing_request.created',     category: 'requests',  title: 'New management request from Yaa Owusu',     body: 'Owusu Property Care wants to manage The Aster — Cantonments.', linkUrl: '/landlord/properties/abc123' },
  { key: 'pm_listing_request.accepted',    category: 'requests',  title: 'Your management request was accepted',       body: 'You can now manage The Aster — Cantonments.',                  linkUrl: '/pm/listings' },
  { key: 'pm_listing_request.rejected',    category: 'requests',  title: 'Your management request was declined',       body: 'The landlord chose a different option for this listing.',     linkUrl: '/pm/listings' },
  { key: 'pm_listing_request.countered',   category: 'requests',  title: 'Landlord countered your fee proposal',       body: 'They suggested 8% instead of 10% of monthly rent.',             linkUrl: '/pm/listings' },
  { key: 'pm_listing_request.recountered', category: 'requests',  title: 'Property manager sent a revised proposal',   body: 'They updated their fee to 9% of monthly rent.',                 linkUrl: '/landlord/properties/abc123' },
  { key: 'pm_assignment.created',          category: 'assignments', title: 'You were assigned to manage Green Court',  body: 'A landlord assigned you directly without a request.',           linkUrl: '/pm/listings' },
  // Agent listing-request lifecycle
  { key: 'agent_listing_request.created',     category: 'requests', title: 'New representation request from Ama Boateng', body: 'Boateng Realty wants to represent Oxford Lofts — Osu.',  linkUrl: '/landlord/properties/def456' },
  { key: 'agent_listing_request.accepted',    category: 'requests', title: 'Your representation request was accepted',     body: 'You can now represent Lakeside Court.',                   linkUrl: '/agent/listings' },
  { key: 'agent_listing_request.rejected',    category: 'requests', title: 'Your representation request was declined',     body: 'The landlord chose another agent or option.',             linkUrl: '/agent/listings' },
  { key: 'agent_listing_request.countered',   category: 'requests', title: 'Landlord countered your commission proposal',  body: 'They suggested 6% instead of 8%.',                        linkUrl: '/agent/listings' },
  { key: 'agent_listing_request.recountered', category: 'requests', title: 'Agent sent a revised proposal',                body: 'They updated their commission to 7%.',                    linkUrl: '/landlord/properties/def456' },
  { key: 'agent_assignment.created',          category: 'assignments', title: 'You were assigned as agent for The Aster', body: 'A landlord assigned you directly without a request.',     linkUrl: '/agent/listings' },
  // Role-request lifecycle
  { key: 'role_request.created',            category: 'roles', title: 'New verification request awaiting review', body: 'Adjoa applied for the agent role.',                                      linkUrl: '/verification/role-requests' },
  { key: 'role_request.approved',           category: 'roles', title: 'Your role request was approved',            body: 'Welcome — you can now access agent features.',                           linkUrl: '/agent/profile' },
  { key: 'role_request.rejected',           category: 'roles', title: 'Your role request was not approved',        body: 'Please attach proof-of-ownership documents and resubmit.',               linkUrl: '/dashboard' },
  { key: 'role_request.document_requested', category: 'roles', title: 'Action needed on your Landlord application', body: 'Our reviewer needs your Proof of ownership and National ID to continue.', linkUrl: '/applications/role-requests', metadata: { requestedDocumentTypes: ['proof_of_ownership', 'national_id'] } },
  // Payouts
  { key: 'agent_payout.created', category: 'payouts', title: 'Commission scheduled', body: 'A commission for Lakeside Court was scheduled by the landlord.',  linkUrl: '/agent/payouts', metadata: { amount: 1850, currency: 'GHS' } },
  { key: 'agent_payout.paid',    category: 'payouts', title: 'Commission paid',      body: 'Your commission for Lakeside Court was marked as paid.',           linkUrl: '/agent/payouts', metadata: { amount: 1850, currency: 'GHS' } },
  { key: 'pm_payout.created',    category: 'payouts', title: 'Management fee scheduled', body: 'A management fee for Adabraka City Studios was scheduled.', linkUrl: '/pm/payouts',    metadata: { amount: 230,  currency: 'GHS' } },
  { key: 'pm_payout.paid',       category: 'payouts', title: 'Management fee paid',      body: 'Your management fee for Adabraka City Studios was paid.',   linkUrl: '/pm/payouts',    metadata: { amount: 230,  currency: 'GHS' } }
]

async function exerciseTemplates(userId: string): Promise<void> {
  log.section(`Notification templates (${EVENT_CASES.length} event keys)`)
  for (const tc of EVENT_CASES) {
    currentStep = tc.key
    const beforeCount = captured.length
    try {
      await createUserNotification(app, {
        userId,
        eventKey: tc.key,
        category: tc.category,
        title: tc.title,
        body: tc.body,
        linkUrl: tc.linkUrl,
        relatedService: 'email-smoke',
        relatedId: tc.key,
        metadata: tc.metadata
      })
      const after = captured.length
      const newMails = captured.slice(beforeCount, after)
      if (newMails.length === 0) {
        log.fail(tc.key, 'no mailer.create call captured (template/email pipeline may be disabled)')
        console.log(`  ${C.yel}?${C.reset} ${tc.key.padEnd(38)} no email captured`)
      } else {
        for (const m of newMails) {
          log.mail(tc.key, m.subject, m.htmlBytes, m.durationMs)
          const dur = m.durationMs ? `  ${C.dim}${m.durationMs}ms${C.reset}` : ''
          const okMark = m.ok ? `${C.green}✓${C.reset}` : `${C.red}✘${C.reset}`
          console.log(`  ${okMark} ${tc.key.padEnd(38)} "${m.subject.slice(0, 60)}"${dur}`)
          if (!m.ok && m.errMsg) console.log(`      ${C.red}${m.errMsg}${C.reset}`)
        }
      }
    } catch (err) {
      log.fail(tc.key, err)
      console.log(`  ${C.red}✘${C.reset} ${tc.key.padEnd(38)} ${(err as Error).message}`)
    }
  }
}

// ─── main ───────────────────────────────────────────────────────────
async function main(): Promise<number> {
  console.log(`${C.bold}CribHub email smoke test${C.reset}`)
  console.log(`  recipient : ${C.bold}${RECIPIENT_EMAIL}${C.reset}`)
  console.log(`  mode      : ${dryRun ? `${C.yel}DRY-RUN${C.reset} (no SMTP send)` : `${C.green}LIVE${C.reset} (real SMTP delivery)`}`)
  console.log(`  smtp      : ${smtpConfigured() ? `${C.green}configured${C.reset} via MAIL_HOST=${process.env.MAIL_HOST}` : `${C.red}NOT configured${C.reset}`}`)
  console.log(`  app name  : ${process.env.APP_NAME || 'CribHub'}`)
  console.log('')

  if (process.env.NOTIFICATION_EMAIL_DISABLED === 'true') {
    console.log(`${C.yel}!${C.reset} NOTIFICATION_EMAIL_DISABLED=true — the notification after-hook will short-circuit.`)
    console.log(`  Unset that env var to actually exercise the template emails.\n`)
  }

  await (app as any).get('mongodbClient')

  if (cleanupOnly) {
    await cleanupTestData()
    return 0
  }

  wireMailerSpy()

  const user = await ensureRecipientUser()

  if (!templatesOnly) await exerciseAuthManagement(user)
  if (!authOnly)      await exerciseTemplates(String(user._id))

  // ─── summary ────────────────────────────────────────────────────
  log.section('Summary')
  const okCount = results.filter((r) => r.ok).length
  const failCount = results.filter((r) => !r.ok).length
  console.log(`  total steps   : ${results.length}`)
  console.log(`  ${C.green}succeeded${C.reset}     : ${okCount}`)
  console.log(`  ${C.red}failed${C.reset}        : ${failCount}`)
  console.log(`  emails captured: ${captured.length}`)
  if (captured.length) {
    const totalBytes = captured.reduce((s, m) => s + m.htmlBytes + m.textBytes, 0)
    console.log(`  total payload  : ${(totalBytes / 1024).toFixed(1)} KiB across ${captured.length} messages`)
    const totalMs = captured.reduce((s, m) => s + (m.durationMs || 0), 0)
    if (!dryRun && totalMs > 0) console.log(`  total SMTP time: ${totalMs}ms (avg ${Math.round(totalMs / captured.length)}ms)`)
  }
  if (failCount > 0) {
    console.log(`\n${C.red}Failures:${C.reset}`)
    for (const r of results.filter((r) => !r.ok)) {
      console.log(`  ${C.red}✘${C.reset} ${r.step}: ${r.errMsg}`)
    }
  }
  console.log('')
  if (dryRun) {
    console.log(`${C.dim}Dry-run complete — no real emails were sent. Pass --live (or configure SMTP) to deliver them.${C.reset}`)
  } else {
    console.log(`Check ${C.bold}${RECIPIENT_EMAIL}${C.reset}'s inbox (and spam folder). Expected ${captured.length} messages.`)
  }
  console.log(`To remove the seeded user + notifications: ${C.cya}npm run email:smoke -- --cleanup${C.reset}`)

  return failCount === 0 ? 0 : 1
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`\n${C.red}FATAL: ${err?.message || err}${C.reset}`)
    console.error(err?.stack)
    process.exit(2)
  })
