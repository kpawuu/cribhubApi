/**
 * Comprehensive CribHub smoke test.
 *
 * Boots the Feathers app in-process and walks through EVERY major flow:
 *   • Users + roles + admin bootstrap
 *   • Role requests (request → approve → reject + welcome notifications)
 *   • Properties (create, patch, list with filters)
 *   • Profiles (agent + property-manager) + default fee rate cards
 *   • Listing requests (PM + agent): propose → counter → accept → assignment
 *   • Direct assignments (PM + agent) with welcome notifications + threads
 *   • Threads + chat messages + portfolio filters
 *   • Payouts (agent + PM): create → mark paid → notifications
 *   • Ratings (post, hide as admin, find as anon, unhide) — recompute summaries
 *   • Notification templates (renderEmailParts + renderSmsBody assertions)
 *   • Admin moderation (admin sees hidden; non-admin doesn't)
 *   • Admin data migration: backfill `acceptedTerms` (dry-run + apply)
 *   • Legacy compat: `commissionPercent` ↔ `acceptedTerms` mirroring
 *
 * Usage (from rentflow_api):
 *   npx ts-node scripts/smoke-test.ts
 *   # or, to also delete every record created by this run:
 *   npx ts-node scripts/smoke-test.ts --cleanup
 *
 * The test creates a unique run-tag (`smoke-<timestamp>`) so it never collides
 * with seeded data. Failed assertions are printed in red but the test continues
 * so you see a complete report. Exit code is non-zero if any check fails.
 */

import 'dotenv/config'
import { ObjectId } from 'mongodb'
import { app } from '../src/app'
import { renderEmailParts, renderSmsBody, getTemplate } from '../src/utils/notification-templates'

// ──────────────────────────────────────────────────────────────
// Output / results tracker
// ──────────────────────────────────────────────────────────────
const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const C = {
  reset: useColor ? '\x1b[0m'  : '',
  dim:   useColor ? '\x1b[2m'  : '',
  bold:  useColor ? '\x1b[1m'  : '',
  red:   useColor ? '\x1b[31m' : '',
  green: useColor ? '\x1b[32m' : '',
  yel:   useColor ? '\x1b[33m' : '',
  blu:   useColor ? '\x1b[34m' : '',
  mag:   useColor ? '\x1b[35m' : '',
  cya:   useColor ? '\x1b[36m' : ''
}

const results: { section: string; name: string; ok: boolean; note?: string }[] = []
let currentSection = '-'

function section(title: string): void {
  currentSection = title
  console.log(`\n${C.bold}${C.cya}━━ ${title} ━━${C.reset}`)
}
function pass(name: string, note?: string): void {
  results.push({ section: currentSection, name, ok: true, note })
  console.log(`  ${C.green}✔${C.reset} ${name}${note ? `  ${C.dim}— ${note}${C.reset}` : ''}`)
}
function fail(name: string, err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err)
  results.push({ section: currentSection, name, ok: false, note: msg })
  console.log(`  ${C.red}✘ ${name}${C.reset}\n    ${C.red}${msg}${C.reset}`)
}
async function check<T>(name: string, fn: () => Promise<T> | T): Promise<T | undefined> {
  try {
    const v = await fn()
    pass(name)
    return v
  } catch (e) {
    fail(name, e)
    return undefined
  }
}
function assert(cond: any, msg = 'assertion failed'): asserts cond {
  if (!cond) throw new Error(msg)
}

// ──────────────────────────────────────────────────────────────
// Internal call params helpers
// ──────────────────────────────────────────────────────────────
const internal = () => ({ provider: undefined } as any)
/**
 * Build params that impersonate `user`. By default, runs as a trusted
 * internal call (provider: undefined). Pass `{ provider: 'rest' }` in `extra`
 * to simulate an external HTTP call — we also set `authenticated: true` so
 * `authenticate('jwt')` hooks succeed without a real JWT.
 */
const asUser = (user: any, extra: Record<string, any> = {}) => {
  const isExternal = !!extra.provider
  return {
    provider: undefined,
    user,
    ...(isExternal ? { authenticated: true } : {}),
    ...extra
  } as any
}

const listOf = (res: any): any[] => (Array.isArray(res) ? res : res?.data || [])

/**
 * `service.find()` is variadic-by-mistake — Feathers only reads the FIRST
 * argument. Calling `find(query, params)` silently drops `params`. This helper
 * always merges them so `provider`, `user`, `authenticated`, etc. survive.
 */
const findAs = async (servicePath: string, params: any, query: any = {}) =>
  await (app as any).service(servicePath).find({ ...params, query })

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// Tag every record created by this run so we can cleanly delete on --cleanup.
const RUN_TAG = `smoke-${Date.now()}`
const tagged = (label: string) => `${RUN_TAG}-${label}`
const emailFor = (label: string) => `${tagged(label)}@cribhub-smoke.test`.toLowerCase()
const DEFAULT_PASSWORD = process.env.SEED_TEST_USERS_PASSWORD || 'CribHubTest1!'

// Track every created _id for cleanup
const created: Record<string, string[]> = {
  users: [],
  'user-roles': [],
  'role-requests': [],
  properties: [],
  'agent-profiles': [],
  'property-manager-profiles': [],
  'agent-listing-requests': [],
  'property-manager-listing-requests': [],
  'agent-assignments': [],
  'property-manager-assignments': [],
  threads: [],
  'chat-messages': [],
  'agent-payouts': [],
  'pm-payouts': [],
  'agent-ratings': [],
  'pm-ratings': [],
  'user-notifications': []
}
const track = (svc: string, doc: any): any => {
  const id = doc?._id?.toString?.() || (doc?._id ? String(doc._id) : '')
  if (id && created[svc]) created[svc].push(id)
  return doc
}

// ──────────────────────────────────────────────────────────────
// User / role helpers
// ──────────────────────────────────────────────────────────────
async function findUserByEmail(email: string): Promise<any | null> {
  const res = await app.service('users').find({ paginate: false, query: { email } } as any, internal())
  return listOf(res)[0] || null
}
async function ensureUser(label: string, fullName: string, extraRoles: string[] = []): Promise<any> {
  const email = emailFor(label)
  let user = await findUserByEmail(email)
  if (!user) {
    user = await app.service('users').create(
      { email, password: DEFAULT_PASSWORD, fullName } as any,
      internal()
    )
    await app.service('users').patch(String(user._id), { isVerified: true } as any, internal())
    track('users', user)
  }
  for (const role of extraRoles) {
    const existing = await app.service('user-roles').find(
      { paginate: false, query: { userId: String(user._id), role } } as any,
      internal()
    )
    if (!listOf(existing).length) {
      const r = await app.service('user-roles').create({ userId: String(user._id), role } as any, internal())
      track('user-roles', r)
    }
  }
  // Re-fetch with roles populated for downstream calls
  const fresh = await app.service('users').get(String(user._id), internal())
  const userRoles = listOf(
    await app.service('user-roles').find({ paginate: false, query: { userId: String(fresh._id) } } as any, internal())
  )
  ;(fresh as any).roles = userRoles.map((r: any) => r.role)
  return fresh
}

// ──────────────────────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────────────────────
async function main(): Promise<number> {
  console.log(`${C.bold}${C.mag}CribHub smoke test${C.reset} ${C.dim}(${RUN_TAG})${C.reset}\n`)

  // ────────────────────────────────────────────────────────────
  section('Bootstrap: app + MongoDB')
  // ────────────────────────────────────────────────────────────
  await check('mongodb client ready', async () => {
    const db = await app.get('mongodbClient')
    assert(db, 'no mongo client')
  })

  // ────────────────────────────────────────────────────────────
  section('Users + roles')
  // ────────────────────────────────────────────────────────────
  let admin: any, landlord: any, agent: any, pm: any, tenant: any, agent2: any, pm2: any
  await check('seed admin', async () => { admin    = await ensureUser('admin',    'Smoke Admin',    ['admin']) })
  await check('seed landlord', async () => { landlord = await ensureUser('landlord', 'Smoke Landlord', ['landlord']) })
  await check('seed agent', async () => { agent    = await ensureUser('agent',    'Smoke Agent',    ['agent']) })
  await check('seed agent2', async () => { agent2   = await ensureUser('agent2',   'Smoke Agent 2',  ['agent']) })
  await check('seed pm', async () => { pm       = await ensureUser('pm',       'Smoke PM',       ['property_manager']) })
  await check('seed pm2', async () => { pm2      = await ensureUser('pm2',      'Smoke PM 2',     ['property_manager']) })
  await check('seed tenant', async () => { tenant   = await ensureUser('tenant',   'Smoke Tenant',   []) })
  await check('all users have expected roles', async () => {
    assert(admin.roles.includes('admin'), 'admin missing')
    assert(landlord.roles.includes('landlord'), 'landlord missing')
    assert(agent.roles.includes('agent'), 'agent missing')
    assert(pm.roles.includes('property_manager'), 'pm missing')
    assert(tenant.roles.length === 1 && tenant.roles[0] === 'tenant', `tenant has ${tenant.roles.join(',')}`)
  })

  // ────────────────────────────────────────────────────────────
  section('Role requests (apply → approve / reject → welcome notification)')
  // ────────────────────────────────────────────────────────────
  // Use a brand-new user so the request actually transitions roles
  let applicantAgent: any, applicantRejected: any
  await check('create tenant applicants', async () => {
    applicantAgent    = await ensureUser('applicant-agent',    'Smoke Applicant Agent',    [])
    applicantRejected = await ensureUser('applicant-rejected', 'Smoke Applicant Rejected', [])
  })

  let rrApproved: any, rrRejected: any
  await check('applicant requests agent role', async () => {
    rrApproved = await app.service('role-requests').create(
      { userId: String(applicantAgent._id), role: 'agent', message: 'I would like to be an agent.' } as any,
      asUser(applicantAgent)
    )
    track('role-requests', rrApproved)
    assert(rrApproved.status === 'pending', 'expected pending')
  })
  await check('admin approves role request → user-roles patched + notification', async () => {
    const patched = await app.service('role-requests').patch(
      String(rrApproved._id),
      { status: 'approved' } as any,
      asUser(admin)
    )
    assert(patched.status === 'approved')
    const ur = listOf(await app.service('user-roles').find(
      { paginate: false, query: { userId: String(applicantAgent._id), role: 'agent' } } as any,
      internal()
    ))
    assert(ur.length === 1, 'agent role not granted')
    // Welcome notification
    const notifs = listOf(await app.service('user-notifications').find(
      { paginate: false, query: { userId: String(applicantAgent._id), eventKey: 'role_request.approved' } } as any,
      internal()
    ))
    assert(notifs.length >= 1, 'no role_request.approved notification')
    notifs.forEach((n) => track('user-notifications', n))
  })
  await check('admin rejects another applicant → rejection notification', async () => {
    rrRejected = await app.service('role-requests').create(
      { userId: String(applicantRejected._id), role: 'landlord' } as any,
      asUser(applicantRejected)
    )
    track('role-requests', rrRejected)
    const patched = await app.service('role-requests').patch(
      String(rrRejected._id),
      { status: 'rejected', notes: 'Need more details.' } as any,
      asUser(admin)
    )
    assert(patched.status === 'rejected')
    const notifs = listOf(await app.service('user-notifications').find(
      { paginate: false, query: { userId: String(applicantRejected._id), eventKey: 'role_request.rejected' } } as any,
      internal()
    ))
    assert(notifs.length >= 1, 'no rejection notification')
    notifs.forEach((n) => track('user-notifications', n))
  })

  // ────────────────────────────────────────────────────────────
  section('Properties: create + patch + list')
  // ────────────────────────────────────────────────────────────
  let propA: any, propB: any, propC: any
  await check('landlord creates 3 properties', async () => {
    const base = (i: number) => ({
      name: `${tagged('prop')}-${i}`,
      address: `${i} Smoke St`,
      city: 'Accra',
      country: 'Ghana',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      price: 2500 + i * 100,
      priceCurrency: 'GHS',
      pricePeriod: 'monthly',
      listingType: 'rent' as const,
      description: 'Smoke-test property',
      amenities: ['Wi-Fi', 'Parking']
    })
    propA = track('properties', await app.service('properties').create(base(1) as any, asUser(landlord)))
    propB = track('properties', await app.service('properties').create(base(2) as any, asUser(landlord)))
    propC = track('properties', await app.service('properties').create(base(3) as any, asUser(landlord)))
    assert(String(propA.landlordId) === String(landlord._id), `landlordId not set (got ${propA.landlordId})`)
  })
  await check('patch property (price update)', async () => {
    const patched = await app.service('properties').patch(String(propA._id), { price: 2999 } as any, asUser(landlord))
    assert(patched.price === 2999, `expected 2999, got ${patched.price}`)
  })
  await check('public catalog find returns the new properties', async () => {
    const res = await app.service('properties').find({
      query: { landlordId: String(landlord._id), $limit: 50 }
    } as any, internal())
    const ids = listOf(res).map((p: any) => String(p._id))
    assert(ids.includes(String(propA._id)) && ids.includes(String(propB._id)) && ids.includes(String(propC._id)))
  })

  // ────────────────────────────────────────────────────────────
  section('Agent + PM profiles (with default fee rate cards)')
  // ────────────────────────────────────────────────────────────
  let agentProfile: any, agent2Profile: any, pmProfile: any, pm2Profile: any
  await check('agent creates profile with defaultFee', async () => {
    agentProfile = track('agent-profiles', await app.service('agent-profiles').create(
      {
        displayName: 'Smoke Agent ' + RUN_TAG,
        agency: 'Smoke Realty',
        bio: 'Top agent for smoke tests.',
        phone: '+233200000001',
        regions: ['Accra'],
        languages: ['English'],
        defaultFee: { rent: { type: 'percent', value: 8 }, sale: { type: 'percent', value: 3 } }
      } as any,
      asUser(agent)
    ))
    assert((agentProfile.defaultFee?.rent?.value ?? 0) === 8)
  })
  await check('agent2 creates profile', async () => {
    agent2Profile = track('agent-profiles', await app.service('agent-profiles').create(
      { displayName: 'Smoke Agent 2 ' + RUN_TAG, agency: 'Counter Realty' } as any,
      asUser(agent2)
    ))
  })
  await check('pm creates profile with defaultFee', async () => {
    pmProfile = track('property-manager-profiles', await app.service('property-manager-profiles').create(
      {
        displayName: 'Smoke PM ' + RUN_TAG,
        companyName: 'Smoke Property Co',
        bio: 'Reliable manager for smoke tests.',
        services: ['Leasing', 'Maintenance'],
        regions: ['Accra'],
        languages: ['English'],
        portfolioSize: 5,
        defaultFee: { rent: { type: 'percent_rent_collected', value: 10 } }
      } as any,
      asUser(pm)
    ))
    assert((pmProfile.defaultFee?.rent?.value ?? 0) === 10)
  })
  await check('pm2 creates profile', async () => {
    pm2Profile = track('property-manager-profiles', await app.service('property-manager-profiles').create(
      { displayName: 'Smoke PM 2 ' + RUN_TAG, companyName: 'Counter Property Co' } as any,
      asUser(pm2)
    ))
  })

  // ────────────────────────────────────────────────────────────
  section('Agent listing request (propose → counter → accept → assignment)')
  // ────────────────────────────────────────────────────────────
  let agentReq: any, agentAssignmentFromReq: any
  await check('agent submits a listing request with a percent proposal', async () => {
    agentReq = track('agent-listing-requests', await app.service('agent-listing-requests').create(
      {
        propertyId: String(propA._id),
        message: 'I would like to represent this property.',
        proposal: { rent: { type: 'percent', value: 9 } }
      } as any,
      asUser(agent)
    ))
    assert(agentReq.status === 'pending')
    assert(String(agentReq.landlordId) === String(landlord._id))
    assert(agentReq.proposal?.rent?.value === 9)
  })
  await check('landlord counters with 7%', async () => {
    const patched = await app.service('agent-listing-requests').patch(
      String(agentReq._id),
      { status: 'countered', counter: { rent: { type: 'percent', value: 7 } } } as any,
      asUser(landlord, { provider: 'rest' })
    )
    assert(patched.status === 'countered')
    assert(patched.counter?.rent?.value === 7)
  })
  await check('agent accepts the counter → acceptedTerms set + assignment created', async () => {
    const before = listOf(await app.service('agent-assignments').find(
      { paginate: false, query: { propertyId: String(propA._id), agentUserId: String(agent._id) } } as any,
      internal()
    )).length
    const patched = await app.service('agent-listing-requests').patch(
      String(agentReq._id),
      { status: 'accepted' } as any,
      asUser(agent, { provider: 'rest' })
    )
    assert(patched.status === 'accepted')
    assert(patched.acceptedTerms?.rent?.value === 7, `acceptedTerms not auto-derived: ${JSON.stringify(patched.acceptedTerms)}`)
    const after = listOf(await app.service('agent-assignments').find(
      { paginate: false, query: { propertyId: String(propA._id), agentUserId: String(agent._id) } } as any,
      internal()
    ))
    assert(after.length > before, 'no agent-assignment created on accept')
    agentAssignmentFromReq = after[after.length - 1]
    track('agent-assignments', agentAssignmentFromReq)
    assert(agentAssignmentFromReq.acceptedTerms?.rent?.value === 7, 'assignment did not inherit acceptedTerms')
    assert(agentAssignmentFromReq.commissionPercent === 7, `legacy commissionPercent not mirrored (${agentAssignmentFromReq.commissionPercent})`)
  })

  // ────────────────────────────────────────────────────────────
  section('PM listing request (propose → counter → accept → assignment)')
  // ────────────────────────────────────────────────────────────
  let pmReq: any, pmAssignmentFromReq: any
  await check('pm submits listing request', async () => {
    pmReq = track('property-manager-listing-requests', await app.service('property-manager-listing-requests').create(
      {
        propertyId: String(propB._id),
        message: 'I can manage this property.',
        proposal: { rent: { type: 'percent_rent_collected', value: 12 } }
      } as any,
      asUser(pm)
    ))
    assert(pmReq.status === 'pending')
    assert(String(pmReq.landlordId) === String(landlord._id))
  })
  await check('landlord counters at 10% rent collected', async () => {
    const patched = await app.service('property-manager-listing-requests').patch(
      String(pmReq._id),
      { status: 'countered', counter: { rent: { type: 'percent_rent_collected', value: 10 } } } as any,
      asUser(landlord, { provider: 'rest' })
    )
    assert(patched.status === 'countered')
  })
  await check('pm accepts → assignment created with acceptedTerms', async () => {
    const patched = await app.service('property-manager-listing-requests').patch(
      String(pmReq._id),
      { status: 'accepted' } as any,
      asUser(pm, { provider: 'rest' })
    )
    assert(patched.status === 'accepted')
    const list = listOf(await app.service('property-manager-assignments').find(
      { paginate: false, query: { propertyId: String(propB._id), managerUserId: String(pm._id) } } as any,
      internal()
    ))
    assert(list.length > 0, 'no PM assignment created on accept')
    pmAssignmentFromReq = list[list.length - 1]
    track('property-manager-assignments', pmAssignmentFromReq)
    assert(pmAssignmentFromReq.acceptedTerms?.rent?.value === 10, 'PM assignment terms missing')
  })

  // ────────────────────────────────────────────────────────────
  section('Direct assignments (landlord assigns without a request)')
  // ────────────────────────────────────────────────────────────
  let directPmAssignment: any, directAgentAssignment: any
  await check('landlord directly assigns pm2 to propC → welcome notif + landlord-pm thread', async () => {
    directPmAssignment = track('property-manager-assignments', await app.service('property-manager-assignments').create(
      { propertyId: String(propC._id), managerUserId: String(pm2._id) } as any,
      asUser(landlord)
    ))
    assert(String(directPmAssignment.landlordId) === String(landlord._id), 'landlordId not auto-resolved')
    const notifs = listOf(await app.service('user-notifications').find(
      { paginate: false, query: { userId: String(pm2._id), eventKey: 'pm_assignment.created' } } as any,
      internal()
    ))
    assert(notifs.length >= 1, 'pm_assignment.created notification missing')
    notifs.forEach((n) => track('user-notifications', n))
    const thread = listOf(await app.service('threads').find(
      { paginate: false, query: {
        kind: 'landlord-pm',
        propertyId: String(propC._id),
        participantIds: { $all: [String(landlord._id), String(pm2._id)] }
      } } as any,
      internal()
    ))
    assert(thread.length >= 1, 'no landlord-pm thread created')
    thread.forEach((t) => track('threads', t))
  })
  await check('landlord directly assigns agent2 to propC → welcome notif + landlord-agent thread', async () => {
    directAgentAssignment = track('agent-assignments', await app.service('agent-assignments').create(
      {
        propertyId: String(propC._id),
        agentUserId: String(agent2._id),
        acceptedTerms: { rent: { type: 'percent', value: 6 } }
      } as any,
      asUser(landlord)
    ))
    assert(directAgentAssignment.commissionPercent === 6, 'legacy commissionPercent mirror failed')
    const notifs = listOf(await app.service('user-notifications').find(
      { paginate: false, query: { userId: String(agent2._id), eventKey: 'agent_assignment.created' } } as any,
      internal()
    ))
    assert(notifs.length >= 1, 'agent_assignment.created notification missing')
    notifs.forEach((n) => track('user-notifications', n))
    const thread = listOf(await app.service('threads').find(
      { paginate: false, query: {
        kind: 'landlord-agent',
        propertyId: String(propC._id),
        participantIds: { $all: [String(landlord._id), String(agent2._id)] }
      } } as any,
      internal()
    ))
    assert(thread.length >= 1, 'no landlord-agent thread created')
    thread.forEach((t) => track('threads', t))
  })

  // ────────────────────────────────────────────────────────────
  section('Backward compat: commissionPercent → acceptedTerms auto-synth')
  // ────────────────────────────────────────────────────────────
  let legacyAgentAssignment: any
  await check('legacy assignment created with only commissionPercent → acceptedTerms synthesised', async () => {
    legacyAgentAssignment = track('agent-assignments', await app.service('agent-assignments').create(
      {
        propertyId: String(propB._id),
        agentUserId: String(agent2._id),
        commissionPercent: 4.5
      } as any,
      asUser(landlord)
    ))
    assert(legacyAgentAssignment.commissionPercent === 4.5)
    assert(legacyAgentAssignment.acceptedTerms?.rent?.type === 'percent', 'acceptedTerms.rent.type missing')
    assert(legacyAgentAssignment.acceptedTerms?.rent?.value === 4.5)
  })

  // ────────────────────────────────────────────────────────────
  section('Threads + chat messages')
  // ────────────────────────────────────────────────────────────
  let openThread: any
  await check('landlord opens a thread with the agent', async () => {
    openThread = track('threads', await app.service('threads').create(
      {
        kind: 'landlord-agent',
        subject: { type: 'property', id: String(propA._id) },
        propertyId: String(propA._id),
        participantIds: [String(landlord._id), String(agent._id)],
        title: `Discussion: ${tagged('thread')}`
      } as any,
      asUser(landlord)
    ))
  })
  await check('both parties exchange messages', async () => {
    const m1 = track('chat-messages', await app.service('chat-messages').create(
      { threadId: String(openThread._id), body: 'Hi from landlord' } as any,
      asUser(landlord)
    ))
    const m2 = track('chat-messages', await app.service('chat-messages').create(
      { threadId: String(openThread._id), body: 'Reply from agent' } as any,
      asUser(agent)
    ))
    assert(m1.body === 'Hi from landlord')
    assert(m2.body === 'Reply from agent')
    const all = listOf(await app.service('chat-messages').find(
      { paginate: false, query: { threadId: String(openThread._id), $sort: { createdAt: 1 } } } as any,
      internal()
    ))
    assert(all.length >= 2, `expected ≥ 2 messages, got ${all.length}`)
  })

  // ────────────────────────────────────────────────────────────
  section('Portfolio filters (pmPortfolio + agentPortfolio)')
  // ────────────────────────────────────────────────────────────
  await check('properties.find with pmPortfolio=true returns only assigned (as pm)', async () => {
    const res = await findAs('properties', asUser(pm, { provider: 'rest' }), { pmPortfolio: true, $limit: 100 })
    const ids = listOf(res).map((p: any) => String(p._id))
    assert(ids.includes(String(propB._id)), `PM portfolio missing propB. got=[${ids.join(',')}]`)
    assert(ids.length < 50, `unexpected listings: ${ids.length}`)
  })
  await check('properties.find with agentPortfolio=true returns only assigned (as agent)', async () => {
    const res = await findAs('properties', asUser(agent, { provider: 'rest' }), { agentPortfolio: true, $limit: 100 })
    const ids = listOf(res).map((p: any) => String(p._id))
    assert(ids.includes(String(propA._id)), `agent portfolio missing propA. got=[${ids.join(',')}]`)
  })

  // ────────────────────────────────────────────────────────────
  section('Payouts: agent + PM (create as landlord → mark paid → notification)')
  // ────────────────────────────────────────────────────────────
  let agentPayout: any, pmPayout: any
  await check('landlord schedules agent commission payout', async () => {
    assert(agentAssignmentFromReq?._id, `precondition: agentAssignmentFromReq is ${typeof agentAssignmentFromReq}`)
    agentPayout = track('agent-payouts', await app.service('agent-payouts').create(
      {
        propertyId: String(propA._id),
        agentUserId: String(agent._id),
        assignmentId: String(agentAssignmentFromReq._id),
        amount: 175,
        baseAmount: 2500,
        currency: 'GHS',
        trigger: 'rent_consummated'
      } as any,
      asUser(landlord, { provider: 'rest' })
    ))
    assert(agentPayout.status === 'pending')
  })
  await check('landlord marks agent payout paid → agent gets a templated notification', async () => {
    const patched = await app.service('agent-payouts').patch(
      String(agentPayout._id),
      { status: 'paid', paidAt: new Date().toISOString(), paidNote: 'Paid via bank transfer' } as any,
      asUser(landlord, { provider: 'rest' })
    )
    assert(patched.status === 'paid', `expected paid, got ${patched.status}`)
    const notifs = listOf(await app.service('user-notifications').find(
      { paginate: false, query: { userId: String(agent._id), eventKey: 'agent_payout.paid' } } as any,
      internal()
    ))
    assert(notifs.length >= 1, 'agent_payout.paid notification missing')
    notifs.forEach((n) => track('user-notifications', n))
  })
  await check('landlord schedules + marks PM payout paid', async () => {
    assert(pmAssignmentFromReq?._id, `precondition: pmAssignmentFromReq is ${typeof pmAssignmentFromReq}`)
    pmPayout = track('pm-payouts', await app.service('pm-payouts').create(
      {
        propertyId: String(propB._id),
        managerUserId: String(pm._id),
        assignmentId: String(pmAssignmentFromReq._id),
        amount: 350,
        baseAmount: 3500,
        currency: 'GHS',
        trigger: 'monthly_rent_collected'
      } as any,
      asUser(landlord, { provider: 'rest' })
    ))
    const patched = await app.service('pm-payouts').patch(
      String(pmPayout._id),
      { status: 'paid', paidAt: new Date().toISOString() } as any,
      asUser(landlord, { provider: 'rest' })
    )
    assert(patched.status === 'paid')
    const notifs = listOf(await app.service('user-notifications').find(
      { paginate: false, query: { userId: String(pm._id), eventKey: 'pm_payout.paid' } } as any,
      internal()
    ))
    assert(notifs.length >= 1, 'pm_payout.paid notification missing')
    notifs.forEach((n) => track('user-notifications', n))
  })

  // ────────────────────────────────────────────────────────────
  section('Notification templates: renderEmailParts + renderSmsBody')
  // ────────────────────────────────────────────────────────────
  await check('agent_payout.paid template renders subject, heading, sms text', async () => {
    const parts = renderEmailParts(
      {
        userId: '1', eventKey: 'agent_payout.paid', category: 'payment',
        title: 'Commission marked as paid', body: 'GHS 175 was marked as paid.',
        linkUrl: '/agent/payouts', metadata: { amount: 175, currency: 'GHS' }
      },
      'Agent'
    )
    assert(/marked as paid/i.test(parts.subject), `subject: ${parts.subject}`)
    assert(/Commission/i.test(parts.heading), `heading: ${parts.heading}`)
    assert(parts.innerHtml.includes('175'), 'amount missing in inner html')
    const sms = renderSmsBody({
      userId: '1', eventKey: 'agent_payout.paid', category: 'payment',
      title: 'Commission marked as paid', metadata: { amount: 175, currency: 'GHS' }
    })
    assert(sms && /175/.test(sms), `sms: ${sms}`)
  })
  await check('role_request.approved sends a templated welcome email', async () => {
    const parts = renderEmailParts(
      { userId: '1', eventKey: 'role_request.approved', category: 'roles', title: 'Agent role approved' },
      'Test User'
    )
    assert(/approved/i.test(parts.subject))
    assert(parts.ctaLabel === 'Get started', `cta: ${parts.ctaLabel}`)
  })
  await check('role_request.created has SMS disabled by default', async () => {
    const tpl = getTemplate('role_request.created')
    assert(tpl?.smsDisabled?.({ userId: '1', eventKey: 'role_request.created', category: 'roles', title: 't' }) === true)
  })
  await check('unknown event key falls back to generic subject/body', async () => {
    const parts = renderEmailParts(
      { userId: '1', eventKey: 'some.unknown.event', category: 'general', title: 'Hello world', body: 'A message.' },
      'Friend'
    )
    assert(parts.subject.includes('Hello world'))
  })

  // ────────────────────────────────────────────────────────────
  section('Ratings: post + admin hide + summary recompute + visibility filter')
  // ────────────────────────────────────────────────────────────
  let agentReview: any, pmReview: any
  await check('tenant posts a 5★ review for the agent', async () => {
    agentReview = track('agent-ratings', await app.service('agent-ratings').create(
      { agentProfileId: String(agentProfile._id), rating: 5, comment: 'Amazing!' } as any,
      asUser(tenant)
    ))
    assert(agentReview.rating === 5)
  })
  await check('agent profile gets ratingAvg=5 + ratingCount=1', async () => {
    await wait(50) // let the hook finish
    const fresh = await app.service('agent-profiles').get(String(agentProfile._id), internal())
    assert(Number(fresh.ratingAvg) === 5, `ratingAvg: ${fresh.ratingAvg}`)
    assert(Number(fresh.ratingCount) === 1, `ratingCount: ${fresh.ratingCount}`)
  })
  await check('admin hides the review (sets hidden=true + moderation note)', async () => {
    const patched = await app.service('agent-ratings').patch(
      String(agentReview._id),
      { hidden: true, moderationNote: 'Smoke-test moderation' } as any,
      asUser(admin, { provider: 'rest' })
    )
    assert(patched.hidden === true)
    assert(typeof patched.hiddenAt === 'string', `hiddenAt not stamped: ${JSON.stringify(patched.hiddenAt)}`)
    assert(String(patched.hiddenBy) === String(admin._id), `hiddenBy not stamped: ${patched.hiddenBy}`)
  })
  await check('agent profile summary recomputed → ratingAvg=0, ratingCount=0 (after hide)', async () => {
    await wait(80)
    const fresh = await app.service('agent-profiles').get(String(agentProfile._id), internal())
    assert(Number(fresh.ratingAvg) === 0, `ratingAvg should be 0, got ${fresh.ratingAvg}`)
    assert(Number(fresh.ratingCount) === 0, `ratingCount should be 0, got ${fresh.ratingCount}`)
  })
  await check('anonymous public find does NOT see hidden review', async () => {
    const res = await findAs('agent-ratings', { provider: 'rest' }, { agentProfileId: String(agentProfile._id), $limit: 100 })
    const ids = listOf(res).map((r: any) => String(r._id))
    assert(!ids.includes(String(agentReview._id)), 'hidden review leaked to anonymous reader')
  })
  await check('reviewer DOES see their own hidden review (own-content exception)', async () => {
    const res = await findAs('agent-ratings', asUser(tenant, { provider: 'rest' }), { agentProfileId: String(agentProfile._id), $limit: 100 })
    const ids = listOf(res).map((r: any) => String(r._id))
    assert(ids.includes(String(agentReview._id)), 'reviewer cannot see their own hidden review')
  })
  await check('admin sees the hidden review', async () => {
    const res = await findAs('agent-ratings', asUser(admin, { provider: 'rest' }), { agentProfileId: String(agentProfile._id), $limit: 100 })
    const ids = listOf(res).map((r: any) => String(r._id))
    assert(ids.includes(String(agentReview._id)), 'admin should see hidden review')
  })
  await check('admin unhides → hiddenAt/hiddenBy cleared', async () => {
    const patched = await app.service('agent-ratings').patch(
      String(agentReview._id),
      { hidden: false } as any,
      asUser(admin, { provider: 'rest' })
    )
    assert(patched.hidden === false)
    assert(!patched.hiddenAt, `hiddenAt not cleared: ${patched.hiddenAt}`)
  })
  await check('PM ratings flow works too (post + admin hide)', async () => {
    pmReview = track('pm-ratings', await app.service('pm-ratings').create(
      { pmProfileId: String(pmProfile._id), rating: 4, comment: 'Solid PM.' } as any,
      asUser(tenant)
    ))
    const hidden = await app.service('pm-ratings').patch(
      String(pmReview._id),
      { hidden: true } as any,
      asUser(admin, { provider: 'rest' })
    )
    assert(hidden.hidden === true)
    await app.service('pm-ratings').patch(String(pmReview._id), { hidden: false } as any, asUser(admin, { provider: 'rest' }))
  })
  await check('non-admin patches that try to set hidden are stripped', async () => {
    // Patch as the tenant (owner) — moderation fields must be stripped, comment must still apply.
    const patched = await app.service('agent-ratings').patch(
      String(agentReview._id),
      { hidden: true, comment: 'Edited by reviewer' } as any,
      asUser(tenant, { provider: 'rest' })
    )
    assert(patched.hidden !== true, 'reviewer was able to hide their own review')
    assert(patched.comment === 'Edited by reviewer')
  })

  // ────────────────────────────────────────────────────────────
  section('Admin moderation: cross-role payouts visibility')
  // ────────────────────────────────────────────────────────────
  await check('admin can see all agent-payouts across landlords', async () => {
    const res = await findAs('agent-payouts', asUser(admin, { provider: 'rest' }), { _id: String(agentPayout._id), $limit: 10 })
    assert(listOf(res).length === 1)
  })
  await check('admin can see all pm-payouts', async () => {
    const res = await findAs('pm-payouts', asUser(admin, { provider: 'rest' }), { _id: String(pmPayout._id), $limit: 10 })
    assert(listOf(res).length === 1)
  })

  // ────────────────────────────────────────────────────────────
  section('Admin migration: backfill acceptedTerms (dry-run + apply)')
  // ────────────────────────────────────────────────────────────
  // Seed an old-shape doc directly into mongo (commissionPercent only, no acceptedTerms)
  const legacySeedIds: ObjectId[] = []
  await check('seed legacy assignment rows missing acceptedTerms', async () => {
    const db = await app.get('mongodbClient')
    const r1 = await db.collection('agent_assignments').insertOne({
      propertyId: String(propA._id),
      agentUserId: String(agent2._id),
      commissionPercent: 3.5,
      assignedBy: String(landlord._id),
      createdAt: new Date().toISOString()
    } as any)
    const r2 = await db.collection('property_manager_assignments').insertOne({
      propertyId: String(propB._id),
      managerUserId: String(pm2._id),
      landlordId: String(landlord._id),
      commissionPercent: 6,
      createdAt: new Date().toISOString()
    } as any)
    legacySeedIds.push(r1.insertedId, r2.insertedId)
    created['agent-assignments'].push(String(r1.insertedId))
    created['property-manager-assignments'].push(String(r2.insertedId))
  })
  let dryReport: any, applyReport: any
  await check('admin-migrations dry-run reports candidates without writing', async () => {
    dryReport = await app.service('admin-migrations').create(
      { action: 'backfill-accepted-terms', dryRun: true } as any,
      asUser(admin)
    )
    assert(dryReport.action === 'backfill-accepted-terms')
    assert(dryReport.dryRun === true)
    assert(dryReport.totalUpdated >= 1, `expected ≥ 1 candidate, got ${dryReport.totalUpdated}`)
  })
  await check('legacy rows are untouched after dry-run', async () => {
    const db = await app.get('mongodbClient')
    const a = await db.collection('agent_assignments').findOne({ _id: legacySeedIds[0] } as any)
    const p = await db.collection('property_manager_assignments').findOne({ _id: legacySeedIds[1] } as any)
    assert(!a?.acceptedTerms, 'dry-run wrote acceptedTerms to agent_assignment')
    assert(!p?.acceptedTerms, 'dry-run wrote acceptedTerms to pm_assignment')
  })
  await check('admin-migrations apply writes acceptedTerms with rent.percent', async () => {
    applyReport = await app.service('admin-migrations').create(
      { action: 'backfill-accepted-terms', dryRun: false } as any,
      asUser(admin)
    )
    assert(applyReport.dryRun === false)
    assert(applyReport.totalUpdated >= 1)
    assert((applyReport.errors || []).length === 0, `errors: ${JSON.stringify(applyReport.errors)}`)
  })
  await check('legacy rows now have acceptedTerms.rent.percent matching commissionPercent', async () => {
    const db = await app.get('mongodbClient')
    const a = await db.collection('agent_assignments').findOne({ _id: legacySeedIds[0] } as any) as any
    const p = await db.collection('property_manager_assignments').findOne({ _id: legacySeedIds[1] } as any) as any
    assert(a?.acceptedTerms?.rent?.type === 'percent', 'agent acceptedTerms not synthesized')
    assert(a?.acceptedTerms?.rent?.value === 3.5, `agent value: ${a?.acceptedTerms?.rent?.value}`)
    assert(p?.acceptedTerms?.rent?.type === 'percent')
    assert(p?.acceptedTerms?.rent?.value === 6)
  })
  await check('re-running migration is idempotent (no further updates)', async () => {
    const again = await app.service('admin-migrations').create(
      { action: 'backfill-accepted-terms', dryRun: false } as any,
      asUser(admin)
    )
    assert(again.totalUpdated === 0, `expected 0 updates on rerun, got ${again.totalUpdated}`)
  })
  await check('non-admin cannot run migrations (forbidden)', async () => {
    let threw = false
    try {
      await app.service('admin-migrations').create(
        { action: 'backfill-accepted-terms', dryRun: true } as any,
        asUser(landlord, { provider: 'rest' })
      )
    } catch (e: any) {
      threw = e?.code === 403 || /forbidden/i.test(e?.message || '')
    }
    assert(threw, 'expected non-admin migration call to be forbidden')
  })

  // ────────────────────────────────────────────────────────────
  section('Cleanup')
  // ────────────────────────────────────────────────────────────
  const shouldCleanup = process.argv.includes('--cleanup')
  if (!shouldCleanup) {
    console.log(`  ${C.dim}(skipping cleanup — pass --cleanup to delete every record created by this run)${C.reset}`)
  } else {
    await cleanup()
  }

  // ────────────────────────────────────────────────────────────
  // Summary
  // ────────────────────────────────────────────────────────────
  const total = results.length
  const passed = results.filter((r) => r.ok).length
  const failed = total - passed
  const bySection = new Map<string, { p: number; f: number }>()
  for (const r of results) {
    if (!bySection.has(r.section)) bySection.set(r.section, { p: 0, f: 0 })
    const s = bySection.get(r.section)!
    if (r.ok) s.p++; else s.f++
  }
  console.log(`\n${C.bold}━━ Summary ━━${C.reset}`)
  for (const [name, s] of bySection.entries()) {
    const tag = s.f === 0
      ? `${C.green}✔ all ${s.p} ok${C.reset}`
      : `${C.red}✘ ${s.f} failed${C.reset} ${C.dim}(${s.p} ok)${C.reset}`
    console.log(`  ${tag}  ${C.dim}—${C.reset} ${name}`)
  }
  console.log(`\n  ${C.bold}${passed}/${total} checks passed${C.reset}${failed ? `  ${C.red}(${failed} failed)${C.reset}` : ''}\n`)
  return failed === 0 ? 0 : 1
}

async function cleanup(): Promise<void> {
  const db = await app.get('mongodbClient')
  // Use raw mongo deletes to avoid auth-gated removes.
  const tables: Array<[string, string]> = [
    ['user-notifications', 'user_notifications'],
    ['chat-messages', 'chat_messages'],
    ['threads', 'threads'],
    ['agent-payouts', 'agent_payouts'],
    ['pm-payouts', 'pm_payouts'],
    ['agent-ratings', 'agent_ratings'],
    ['pm-ratings', 'pm_ratings'],
    ['agent-listing-requests', 'agent_listing_requests'],
    ['property-manager-listing-requests', 'property_manager_listing_requests'],
    ['agent-assignments', 'agent_assignments'],
    ['property-manager-assignments', 'property_manager_assignments'],
    ['agent-profiles', 'agent_profiles'],
    ['property-manager-profiles', 'property_manager_profiles'],
    ['properties', 'properties'],
    ['role-requests', 'role_requests'],
    ['user-roles', 'user_roles'],
    ['users', 'users']
  ]
  for (const [svc, col] of tables) {
    const ids = created[svc] || []
    if (!ids.length) continue
    const oids: any[] = []
    const strs: any[] = []
    for (const id of ids) {
      if (ObjectId.isValid(id) && id.length === 24) oids.push(new ObjectId(id))
      else strs.push(id)
    }
    const filter: any = { $or: [] }
    if (oids.length) filter.$or.push({ _id: { $in: oids } })
    if (strs.length) filter.$or.push({ _id: { $in: strs } })
    const res = await db.collection(col).deleteMany(filter)
    pass(`cleanup ${svc}`, `deleted ${res.deletedCount} of ${ids.length}`)
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`\n${C.red}FATAL: ${err?.message || err}${C.reset}`)
    console.error(err?.stack)
    process.exit(2)
  })
