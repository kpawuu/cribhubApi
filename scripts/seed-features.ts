/**
 * Seeds realistic data for EVERY feature on top of the user/property seeders.
 *
 * Idempotent: every record is tagged with `seedTag: 'features-demo'` (or attached
 * via predictable email/displayName lookups) so re-running does NOT create
 * duplicates. Existing rows are reused or patched.
 *
 * Usage (from rentflow_api):
 *   npm run seed:test-users     # creates the 5 standard test users
 *   npm run seed:properties     # creates 55 properties + units (wipes those tables)
 *   npm run seed:features       # this script — adds profiles, requests,
 *                                 assignments, payouts, ratings, threads...
 *   # or do all three at once:
 *   npm run seed:all
 *
 * What it creates (in order):
 *   • Avatars on the 5 standard test users
 *   • A handful of extra agents, PMs, and tenants
 *   • Agent + PM profiles (with `defaultFee` rate cards, bios, regions)
 *   • Role requests in pending / approved / rejected states
 *   • Agent + PM listing requests in pending / countered / accepted states
 *     → counted, accepted ones provision assignments + welcome threads
 *   • Direct landlord-assigned PM + agent on selected properties
 *   • landlord-tenant chat threads with messages
 *   • Payouts (agent + PM) in pending and paid states
 *   • Ratings on the visible agents and PMs (mixture of 4★/5★ with comments)
 *
 * All notifications use the new templates from `utils/notification-templates`.
 * Set NOTIFICATION_EMAIL_DISABLED=true / NOTIFICATION_SMS_DISABLED=true in .env
 * to suppress outgoing email/SMS while seeding.
 */

import 'dotenv/config'
import { ObjectId } from 'mongodb'
import { app } from '../src/app'

const SEED_TAG = 'features-demo'

// ─── colors / output ────────────────────────────────────────────────
const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const C = {
  reset: useColor ? '\x1b[0m'  : '',
  dim:   useColor ? '\x1b[2m'  : '',
  bold:  useColor ? '\x1b[1m'  : '',
  green: useColor ? '\x1b[32m' : '',
  yel:   useColor ? '\x1b[33m' : '',
  red:   useColor ? '\x1b[31m' : '',
  cya:   useColor ? '\x1b[36m' : ''
}
const stats = { created: 0, reused: 0, patched: 0, errors: 0 }

const log = {
  section: (title: string) => console.log(`\n${C.bold}${C.cya}━━ ${title} ━━${C.reset}`),
  created: (label: string, note = '') => { stats.created++; console.log(`  ${C.green}+${C.reset} created ${label}${note ? `  ${C.dim}${note}${C.reset}` : ''}`) },
  reused:  (label: string, note = '') => { stats.reused++; console.log(`  ${C.dim}·${C.reset} reused  ${label}${note ? `  ${C.dim}${note}${C.reset}` : ''}`) },
  patched: (label: string, note = '') => { stats.patched++; console.log(`  ${C.yel}~${C.reset} patched ${label}${note ? `  ${C.dim}${note}${C.reset}` : ''}`) },
  warn:    (msg: string)              => { console.log(`  ${C.yel}!${C.reset} ${msg}`) },
  error:   (msg: string, err: unknown) => {
    stats.errors++
    const m = err instanceof Error ? err.message : String(err)
    console.log(`  ${C.red}✘ ${msg}: ${m}${C.reset}`)
  }
}

// ─── internal call helpers ──────────────────────────────────────────
const internal = () => ({ provider: undefined } as any)
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
const findAs = async (svc: string, params: any, query: any = {}) =>
  await (app as any).service(svc).find({ ...params, query })

// ─── avatars / pictures ─────────────────────────────────────────────
/** DiceBear avatar URL — fast, deterministic, no auth. */
const avatarFor = (seed: string, style = 'avataaars-neutral'): string =>
  `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`

// ─── data ───────────────────────────────────────────────────────────
const TEST_EMAIL = (slug: string) => `cribhub-test-${slug}@example.test`
const FEATURE_EMAIL = (slug: string) => `cribhub-${SEED_TAG}-${slug}@example.test`

const EXTRA_AGENTS = [
  { slug: 'agent-ama',  fullName: 'Ama Boateng',  agency: 'Boateng Realty',  bio: 'Specialist in East Legon, Cantonments, and Airport Residential.', regions: ['Accra', 'Airport Residential'], fee: { rent: { type: 'percent', value: 6 }, sale: { type: 'percent', value: 3 } } as any },
  { slug: 'agent-kofi', fullName: 'Kofi Asante',  agency: 'Asante Homes',   bio: 'Helps families relocate to Tema and Sakumono — over 10 years experience.', regions: ['Tema', 'Sakumono'],          fee: { rent: { type: 'months_rent', value: 0.5 } } as any },
  { slug: 'agent-akua', fullName: 'Akua Mensah',  agency: 'Mensah Brokers', bio: 'Luxury rentals and ridge-area family homes.',                              regions: ['Ridge', 'Cantonments'],     fee: { rent: { type: 'percent', value: 8 } } as any }
] as const

const EXTRA_PMS = [
  { slug: 'pm-yaa',     fullName: 'Yaa Owusu',    company: 'Owusu Property Care', bio: 'Boutique manager for owner-occupied compounds. Tenant screening + monthly statements.', services: ['Leasing', 'Maintenance', 'Rent collection'], regions: ['Cantonments', 'Airport'], fee: { rent: { type: 'percent_rent_collected', value: 10 } } as any },
  { slug: 'pm-nii',     fullName: 'Nii Armah',    company: 'Armah Estates',       bio: 'Multi-unit specialists. Handles 80+ doors across Accra & Tema.',                          services: ['Leasing', 'Maintenance', 'Accounting', 'Evictions'],     regions: ['Accra', 'Tema'],          fee: { rent: { type: 'percent_rent_collected', value: 8 } } as any }
] as const

const EXTRA_TENANTS = [
  { slug: 'tenant-esi',   fullName: 'Esi Quaye',   phone: '+233200000051' },
  { slug: 'tenant-kweku', fullName: 'Kweku Bediako', phone: '+233200000052' },
  { slug: 'tenant-naa',   fullName: 'Naa Adoley',  phone: '+233200000053' }
] as const

const PASSWORD = process.env.SEED_TEST_USERS_PASSWORD || 'CribHubTest1!'

// ─── helpers ────────────────────────────────────────────────────────
async function findUserByEmail(email: string): Promise<any | null> {
  const res = await findAs('users', internal(), { email: email.toLowerCase() })
  return listOf(res)[0] || null
}

async function ensureUser(email: string, fullName: string, extraRoles: string[] = [], extras: Partial<{ avatarUrl: string; phone: string }> = {}): Promise<any> {
  email = email.toLowerCase()
  let user = await findUserByEmail(email)
  if (!user) {
    user = await app.service('users').create(
      { email, password: PASSWORD, fullName } as any,
      internal()
    )
    log.created(`user ${email}`)
  } else {
    log.reused(`user ${email}`)
  }
  const patches: any = { isVerified: true }
  if (extras.avatarUrl && !user.avatarUrl) patches.avatarUrl = extras.avatarUrl
  if (extras.phone && !user.phone) patches.phone = extras.phone
  if (Object.keys(patches).length) {
    user = await app.service('users').patch(String(user._id), patches, internal())
  }
  for (const role of extraRoles) {
    const existing = listOf(await findAs('user-roles', internal(), { userId: String(user._id), role }))
    if (!existing.length) {
      await app.service('user-roles').create({ userId: String(user._id), role } as any, internal())
    }
  }
  const userRoles = listOf(await findAs('user-roles', internal(), { userId: String(user._id) }))
  ;(user as any).roles = userRoles.map((r: any) => r.role)
  return user
}

async function getOrCreateAgentProfile(user: any, data: Partial<{ displayName: string; agency: string; bio: string; regions: string[]; defaultFee: any }>): Promise<any> {
  const existing = listOf(await findAs('agent-profiles', internal(), { userId: String(user._id) }))
  if (existing[0]) {
    log.reused(`agent-profile ${user.email}`)
    return existing[0]
  }
  const profile = await app.service('agent-profiles').create(
    {
      displayName: data.displayName || user.fullName,
      agency: data.agency,
      bio: data.bio,
      phone: user.phone,
      regions: data.regions || [],
      languages: ['English'],
      avatarUrl: user.avatarUrl,
      defaultFee: data.defaultFee
    } as any,
    asUser(user)
  )
  log.created(`agent-profile ${user.email}`)
  return profile
}

async function getOrCreatePmProfile(user: any, data: Partial<{ displayName: string; companyName: string; bio: string; services: string[]; regions: string[]; defaultFee: any }>): Promise<any> {
  const existing = listOf(await findAs('property-manager-profiles', internal(), { userId: String(user._id) }))
  if (existing[0]) {
    log.reused(`pm-profile ${user.email}`)
    return existing[0]
  }
  const profile = await app.service('property-manager-profiles').create(
    {
      displayName: data.displayName || user.fullName,
      companyName: data.companyName,
      bio: data.bio,
      phone: user.phone,
      services: data.services || ['Leasing', 'Maintenance'],
      regions: data.regions || [],
      languages: ['English'],
      avatarUrl: user.avatarUrl,
      defaultFee: data.defaultFee
    } as any,
    asUser(user)
  )
  log.created(`pm-profile ${user.email}`)
  return profile
}

// ─── MAIN ───────────────────────────────────────────────────────────
async function main(): Promise<number> {
  console.log(`${C.bold}CribHub feature seed${C.reset} ${C.dim}(tag: ${SEED_TAG})${C.reset}\n`)
  await app.get('mongodbClient')

  // ────────────────────────────────────────────────────────────
  log.section('1. Standard test users (avatars)')
  // ────────────────────────────────────────────────────────────
  const std = {
    tenant:   await ensureUser(TEST_EMAIL('tenant'),   'CribHub Test Tenant',           [],                     { avatarUrl: avatarFor('tenant') }),
    landlord: await ensureUser(TEST_EMAIL('landlord'), 'CribHub Test Landlord',         ['landlord'],           { avatarUrl: avatarFor('landlord') }),
    agent:    await ensureUser(TEST_EMAIL('agent'),    'CribHub Test Agent',            ['agent'],              { avatarUrl: avatarFor('agent') }),
    pm:       await ensureUser(TEST_EMAIL('pm'),       'CribHub Test Property Manager', ['property_manager'],   { avatarUrl: avatarFor('pm') }),
    admin:    await ensureUser(TEST_EMAIL('admin'),    'CribHub Test Admin',            ['admin'],              { avatarUrl: avatarFor('admin') })
  }

  // ────────────────────────────────────────────────────────────
  log.section('2. Extra agents / PMs / tenants')
  // ────────────────────────────────────────────────────────────
  const agents: Record<string, any> = { primary: std.agent }
  for (const a of EXTRA_AGENTS) {
    agents[a.slug] = await ensureUser(FEATURE_EMAIL(a.slug), a.fullName, ['agent'], { avatarUrl: avatarFor(a.slug) })
  }
  const pms: Record<string, any> = { primary: std.pm }
  for (const p of EXTRA_PMS) {
    pms[p.slug] = await ensureUser(FEATURE_EMAIL(p.slug), p.fullName, ['property_manager'], { avatarUrl: avatarFor(p.slug) })
  }
  const tenants: Record<string, any> = { primary: std.tenant }
  for (const t of EXTRA_TENANTS) {
    tenants[t.slug] = await ensureUser(FEATURE_EMAIL(t.slug), t.fullName, [], { avatarUrl: avatarFor(t.slug), phone: t.phone })
  }

  // ────────────────────────────────────────────────────────────
  log.section('3. Agent + PM profiles (rate cards)')
  // ────────────────────────────────────────────────────────────
  const agentProfiles: Record<string, any> = {}
  agentProfiles.primary = await getOrCreateAgentProfile(std.agent, {
    displayName: std.agent.fullName,
    agency: 'CribHub Demo Realty',
    bio: 'Friendly local agent for short-term rentals and family homes.',
    regions: ['Accra', 'East Legon', 'Cantonments'],
    defaultFee: { rent: { type: 'percent', value: 7 }, sale: { type: 'percent', value: 3 } }
  })
  for (const a of EXTRA_AGENTS) {
    agentProfiles[a.slug] = await getOrCreateAgentProfile(agents[a.slug], {
      displayName: a.fullName,
      agency: a.agency,
      bio: a.bio,
      regions: [...a.regions],
      defaultFee: a.fee
    })
  }
  const pmProfiles: Record<string, any> = {}
  pmProfiles.primary = await getOrCreatePmProfile(std.pm, {
    displayName: std.pm.fullName,
    companyName: 'CribHub Demo Property Mgmt',
    bio: 'Full-service property management — leasing, collections, maintenance.',
    services: ['Leasing', 'Maintenance', 'Rent collection', 'Reporting'],
    regions: ['Accra'],
    defaultFee: { rent: { type: 'percent_rent_collected', value: 10 } }
  })
  for (const p of EXTRA_PMS) {
    pmProfiles[p.slug] = await getOrCreatePmProfile(pms[p.slug], {
      displayName: p.fullName,
      companyName: p.company,
      bio: p.bio,
      services: [...p.services],
      regions: [...p.regions],
      defaultFee: p.fee
    })
  }

  // ────────────────────────────────────────────────────────────
  log.section('4. Role requests (pending / approved / rejected demo rows)')
  // ────────────────────────────────────────────────────────────
  const newAgent  = await ensureUser(FEATURE_EMAIL('applicant-agent'),  'Applicant Adjoa (pending)',  [], { avatarUrl: avatarFor('applicant-agent') })
  const newPm     = await ensureUser(FEATURE_EMAIL('applicant-pm'),     'Applicant Kwame (approved)', [], { avatarUrl: avatarFor('applicant-pm') })
  const newLand   = await ensureUser(FEATURE_EMAIL('applicant-landlord'), 'Applicant Yaw (rejected)', [], { avatarUrl: avatarFor('applicant-landlord') })

  await ensureRoleRequest(newAgent, 'agent',            'pending',  'I am a licensed agent in Accra.', undefined,                       std.admin)
  await ensureRoleRequest(newPm,    'property_manager', 'approved', 'Run an existing property management firm.', undefined,             std.admin)
  await ensureRoleRequest(newLand,  'landlord',         'rejected', 'I have 3 properties to list.', 'Need to provide proof of ownership documents.', std.admin)

  // ────────────────────────────────────────────────────────────
  log.section('5. Listing requests (agent + PM) in various states')
  // ────────────────────────────────────────────────────────────
  const landlordProps = listOf(await findAs('properties', internal(), { landlordId: String(std.landlord._id), $limit: 200, $sort: { createdAt: 1 } }))
  if (landlordProps.length === 0) {
    log.warn('No properties owned by the demo landlord — run `npm run seed:properties` first.')
    return 1
  }
  console.log(`  ${C.dim}using ${landlordProps.length} demo-landlord properties${C.reset}`)

  // pending agent request from Ama on prop[3]
  await ensureAgentListingRequest({
    property: landlordProps[3],
    agent:    agents['agent-ama'],
    landlord: std.landlord,
    admin:    std.admin,
    proposal: { rent: { type: 'percent', value: 6 } },
    finalStatus: 'pending'
  })

  // countered agent request from Kofi on prop[4]
  await ensureAgentListingRequest({
    property: landlordProps[4],
    agent:    agents['agent-kofi'],
    landlord: std.landlord,
    admin:    std.admin,
    proposal: { rent: { type: 'months_rent', value: 1 } },
    counter:  { rent: { type: 'months_rent', value: 0.5 } },
    finalStatus: 'countered'
  })

  // accepted agent request: Akua on prop[5] (creates assignment)
  await ensureAgentListingRequest({
    property: landlordProps[5],
    agent:    agents['agent-akua'],
    landlord: std.landlord,
    admin:    std.admin,
    proposal: { rent: { type: 'percent', value: 10 } },
    counter:  { rent: { type: 'percent', value: 8 } },
    finalStatus: 'accepted'
  })

  // rejected agent request: primary agent on prop[6]
  await ensureAgentListingRequest({
    property: landlordProps[6],
    agent:    std.agent,
    landlord: std.landlord,
    admin:    std.admin,
    proposal: { rent: { type: 'percent', value: 15 } }, // too high
    finalStatus: 'rejected'
  })

  // pending PM request from Yaa on prop[7]
  await ensurePmListingRequest({
    property: landlordProps[7],
    manager:  pms['pm-yaa'],
    landlord: std.landlord,
    admin:    std.admin,
    proposal: { rent: { type: 'percent_rent_collected', value: 12 } },
    finalStatus: 'pending'
  })

  // countered PM request from Nii on prop[8]
  await ensurePmListingRequest({
    property: landlordProps[8],
    manager:  pms['pm-nii'],
    landlord: std.landlord,
    admin:    std.admin,
    proposal: { rent: { type: 'percent_rent_collected', value: 12 } },
    counter:  { rent: { type: 'percent_rent_collected', value: 9 } },
    finalStatus: 'countered'
  })

  // accepted PM request: primary PM on prop[9] (creates PM assignment)
  await ensurePmListingRequest({
    property: landlordProps[9],
    manager:  std.pm,
    landlord: std.landlord,
    admin:    std.admin,
    proposal: { rent: { type: 'percent_rent_collected', value: 10 } },
    finalStatus: 'accepted'
  })

  // ────────────────────────────────────────────────────────────
  log.section('6. Direct assignments (landlord without request)')
  // ────────────────────────────────────────────────────────────
  // Direct agent assignment: primary agent on prop[0]
  await ensureAgentAssignment({
    property:      landlordProps[0],
    agent:         std.agent,
    landlord:      std.landlord,
    acceptedTerms: { rent: { type: 'percent', value: 5 } }
  })
  // Direct PM assignment: pm-yaa on prop[1]
  await ensurePmAssignment({
    property:      landlordProps[1],
    manager:       pms['pm-yaa'],
    landlord:      std.landlord,
    acceptedTerms: { rent: { type: 'percent_rent_collected', value: 9 } }
  })

  // ────────────────────────────────────────────────────────────
  log.section('7. Landlord-tenant threads + chat messages')
  // ────────────────────────────────────────────────────────────
  for (const [propIdx, tenantKey, body] of [
    [0, 'tenant-esi',   'Hi, is unit A4 still available for this month?'],
    [1, 'tenant-kweku', 'Could we tour the property on Saturday?'],
    [2, 'tenant-naa',   'Is the rent negotiable for a 12-month lease?']
  ] as const) {
    const prop = landlordProps[propIdx]
    if (!prop) continue
    const tenant = tenants[tenantKey]
    const thread = await ensureThread('landlord-tenant', prop, [std.landlord, tenant], `Inquiry: ${prop.name}`)
    if (thread) {
      await ensureChat(thread, tenant,        body)
      await ensureChat(thread, std.landlord, 'Yes, it is available. Happy to coordinate a viewing this weekend!')
      await ensureChat(thread, tenant,        'Sounds good — can we do Saturday 10am?')
    }
  }

  // ────────────────────────────────────────────────────────────
  log.section('8. Payouts (agent + PM — pending and paid)')
  // ────────────────────────────────────────────────────────────
  // The accepted-from-request assignments AND direct assignments are eligible.
  const agentAssignmentsForLandlord = listOf(await findAs('agent-assignments', internal(), { $limit: 100 }))
    .filter((a: any) => landlordProps.some((p: any) => String(p._id) === String(a.propertyId)))
  const pmAssignmentsForLandlord = listOf(await findAs('property-manager-assignments', internal(), { landlordId: String(std.landlord._id), $limit: 100 }))

  for (let i = 0; i < Math.min(agentAssignmentsForLandlord.length, 3); i++) {
    const asg = agentAssignmentsForLandlord[i]
    const prop = landlordProps.find((p: any) => String(p._id) === String(asg.propertyId))
    if (!prop) continue
    await ensureAgentPayout({
      property:    prop,
      assignment:  asg,
      landlord:    std.landlord,
      amount:      Math.round(Number(prop.price || 2500) * 0.07),
      baseAmount:  Number(prop.price || 2500),
      currency:    String(prop.priceCurrency || 'GHS'),
      trigger:     i === 0 ? 'rent_consummated' : i === 1 ? 'first_month_paid' : 'each_renewal',
      markPaid:    i === 0
    })
  }
  for (let i = 0; i < Math.min(pmAssignmentsForLandlord.length, 2); i++) {
    const asg = pmAssignmentsForLandlord[i]
    const prop = landlordProps.find((p: any) => String(p._id) === String(asg.propertyId))
    if (!prop) continue
    await ensurePmPayout({
      property:   prop,
      assignment: asg,
      landlord:   std.landlord,
      amount:     Math.round(Number(prop.price || 2500) * 0.09),
      baseAmount: Number(prop.price || 2500),
      currency:   String(prop.priceCurrency || 'GHS'),
      trigger:    'monthly_rent_collected',
      markPaid:   i === 0
    })
  }

  // ────────────────────────────────────────────────────────────
  log.section('9. Ratings (visible + one hidden by admin)')
  // ────────────────────────────────────────────────────────────
  // Each tenant rates the primary agent + a chosen PM (deduped via the
  // unique (userId, profileId) check the rating service enforces).
  const ratingPairs: Array<[any, any, number, string]> = [
    [tenants['tenant-esi'],   agentProfiles.primary,     5, 'Quick to respond and arranged a viewing same day.'],
    [tenants['tenant-kweku'], agentProfiles['agent-ama'], 4, 'Solid agent — good knowledge of East Legon market.'],
    [tenants['tenant-naa'],   agentProfiles['agent-akua'], 5, 'Found us a great long-term let.']
  ]
  for (const [tenant, profile, rating, comment] of ratingPairs) {
    await ensureAgentRating(tenant, profile, rating, comment)
  }
  await ensurePmRating(tenants['tenant-esi'],   pmProfiles.primary,    5, 'Maintenance requests are handled within hours.')
  await ensurePmRating(tenants['tenant-kweku'], pmProfiles['pm-yaa'],  4, 'Monthly statements arrive on time and are clearly itemised.')

  // Hide one rating as admin (demonstrates moderation)
  const ratingsToHide = listOf(await findAs('agent-ratings', internal(), {
    agentProfileId: String(agentProfiles['agent-akua']._id),
    userId: String(tenants['tenant-naa']._id),
    $limit: 1
  }))
  if (ratingsToHide[0] && !ratingsToHide[0].hidden) {
    await app.service('agent-ratings').patch(
      String(ratingsToHide[0]._id),
      { hidden: true, moderationNote: 'Demo: temporarily hidden to showcase moderation UI' } as any,
      asUser(std.admin, { provider: 'rest' })
    )
    log.patched(`agent-rating ${ratingsToHide[0]._id}`, '→ hidden')
  }

  // ────────────────────────────────────────────────────────────
  log.section('Summary')
  // ────────────────────────────────────────────────────────────
  console.log(`  ${C.green}+${C.reset} created: ${stats.created}`)
  console.log(`  ${C.dim}·${C.reset} reused:  ${stats.reused}`)
  console.log(`  ${C.yel}~${C.reset} patched: ${stats.patched}`)
  if (stats.errors) console.log(`  ${C.red}✘${C.reset} errors:  ${stats.errors}`)
  console.log('')
  console.log(`Log in at the frontend with any of the test accounts (password: ${PASSWORD}):`)
  for (const u of Object.values(std)) {
    console.log(`  ${C.dim}•${C.reset} ${u.email}  ${C.dim}(${(u as any).roles?.join(', ')})${C.reset}`)
  }
  console.log('')
  return stats.errors === 0 ? 0 : 1
}

// ────────────────────────────────────────────────────────────
// Idempotent ensure-* helpers
// ────────────────────────────────────────────────────────────
async function ensureRoleRequest(
  user: any, role: 'landlord' | 'property_manager' | 'agent',
  finalStatus: 'pending' | 'approved' | 'rejected', message: string, notes: string | undefined, admin: any
): Promise<void> {
  try {
    let existing = listOf(await findAs('role-requests', asUser(admin), { userId: String(user._id), role }))[0]
    if (!existing) {
      existing = await app.service('role-requests').create(
        { userId: String(user._id), role, message } as any,
        asUser(user)
      )
      log.created(`role-request ${role} for ${user.email}`)
    } else {
      log.reused(`role-request ${role} for ${user.email}`)
    }
    if (existing.status !== finalStatus && finalStatus !== 'pending') {
      await app.service('role-requests').patch(
        String(existing._id),
        { status: finalStatus, ...(notes ? { notes } : {}) } as any,
        asUser(admin, { provider: 'rest' })
      )
      log.patched(`role-request ${role} for ${user.email}`, `→ ${finalStatus}`)
    }
  } catch (e) {
    log.error(`role-request ${role} for ${user.email}`, e)
  }
}

type FeeProposal = { rent?: any; sale?: any; notes?: string }

async function ensureAgentListingRequest(args: {
  property: any; agent: any; landlord: any; admin: any
  proposal: FeeProposal; counter?: FeeProposal
  finalStatus: 'pending' | 'countered' | 'accepted' | 'rejected'
}): Promise<void> {
  const label = `agent-listing-request ${args.agent.email} → ${args.property.name}`
  try {
    let row = listOf(await findAs('agent-listing-requests', asUser(args.admin), {
      propertyId: String(args.property._id),
      agentUserId: String(args.agent._id),
      $limit: 1
    }))[0]
    if (!row) {
      row = await app.service('agent-listing-requests').create(
        { propertyId: String(args.property._id), proposal: args.proposal, message: 'Demo seed request.' } as any,
        asUser(args.agent, { provider: 'rest' })
      )
      log.created(label)
    } else {
      log.reused(label)
    }
    if (args.finalStatus === 'pending') return

    if (args.counter && row.status === 'pending') {
      await app.service('agent-listing-requests').patch(
        String(row._id),
        { status: 'countered', counter: args.counter } as any,
        asUser(args.landlord, { provider: 'rest' })
      )
      log.patched(label, '→ countered')
    }
    if (args.finalStatus === 'countered') return

    if (args.finalStatus === 'accepted' && row.status !== 'accepted') {
      // If countered, agent accepts; otherwise landlord accepts directly.
      const accepter = row.status === 'countered' || args.counter ? args.agent : args.landlord
      await app.service('agent-listing-requests').patch(
        String(row._id),
        { status: 'accepted' } as any,
        asUser(accepter, { provider: 'rest' })
      )
      log.patched(label, '→ accepted')
    } else if (args.finalStatus === 'rejected' && row.status !== 'rejected') {
      await app.service('agent-listing-requests').patch(
        String(row._id),
        { status: 'rejected' } as any,
        asUser(args.landlord, { provider: 'rest' })
      )
      log.patched(label, '→ rejected')
    }
  } catch (e) {
    log.error(label, e)
  }
}

async function ensurePmListingRequest(args: {
  property: any; manager: any; landlord: any; admin: any
  proposal: FeeProposal; counter?: FeeProposal
  finalStatus: 'pending' | 'countered' | 'accepted' | 'rejected'
}): Promise<void> {
  const label = `pm-listing-request ${args.manager.email} → ${args.property.name}`
  try {
    let row = listOf(await findAs('property-manager-listing-requests', asUser(args.admin), {
      propertyId:    String(args.property._id),
      managerUserId: String(args.manager._id),
      $limit: 1
    }))[0]
    if (!row) {
      row = await app.service('property-manager-listing-requests').create(
        { propertyId: String(args.property._id), proposal: args.proposal, message: 'Demo seed request.' } as any,
        asUser(args.manager, { provider: 'rest' })
      )
      log.created(label)
    } else {
      log.reused(label)
    }
    if (args.finalStatus === 'pending') return

    if (args.counter && row.status === 'pending') {
      await app.service('property-manager-listing-requests').patch(
        String(row._id),
        { status: 'countered', counter: args.counter } as any,
        asUser(args.landlord, { provider: 'rest' })
      )
      log.patched(label, '→ countered')
    }
    if (args.finalStatus === 'countered') return

    if (args.finalStatus === 'accepted' && row.status !== 'accepted') {
      const accepter = row.status === 'countered' || args.counter ? args.manager : args.landlord
      await app.service('property-manager-listing-requests').patch(
        String(row._id),
        { status: 'accepted' } as any,
        asUser(accepter, { provider: 'rest' })
      )
      log.patched(label, '→ accepted')
    } else if (args.finalStatus === 'rejected' && row.status !== 'rejected') {
      await app.service('property-manager-listing-requests').patch(
        String(row._id),
        { status: 'rejected' } as any,
        asUser(args.landlord, { provider: 'rest' })
      )
      log.patched(label, '→ rejected')
    }
  } catch (e) {
    log.error(label, e)
  }
}

async function ensureAgentAssignment(args: { property: any; agent: any; landlord: any; acceptedTerms: any }): Promise<any | null> {
  const label = `agent-assignment ${args.agent.email} → ${args.property.name}`
  try {
    const existing = listOf(await findAs('agent-assignments', internal(), {
      propertyId:  String(args.property._id),
      agentUserId: String(args.agent._id),
      $limit: 1
    }))[0]
    if (existing) { log.reused(label); return existing }
    const created = await app.service('agent-assignments').create(
      {
        propertyId:    String(args.property._id),
        agentUserId:   String(args.agent._id),
        acceptedTerms: args.acceptedTerms
      } as any,
      asUser(args.landlord)
    )
    log.created(label)
    return created
  } catch (e) { log.error(label, e); return null }
}

async function ensurePmAssignment(args: { property: any; manager: any; landlord: any; acceptedTerms: any }): Promise<any | null> {
  const label = `pm-assignment ${args.manager.email} → ${args.property.name}`
  try {
    const existing = listOf(await findAs('property-manager-assignments', internal(), {
      propertyId:    String(args.property._id),
      managerUserId: String(args.manager._id),
      $limit: 1
    }))[0]
    if (existing) { log.reused(label); return existing }
    const created = await app.service('property-manager-assignments').create(
      {
        propertyId:    String(args.property._id),
        managerUserId: String(args.manager._id),
        acceptedTerms: args.acceptedTerms
      } as any,
      asUser(args.landlord)
    )
    log.created(label)
    return created
  } catch (e) { log.error(label, e); return null }
}

async function ensureThread(
  kind: 'landlord-pm' | 'landlord-agent' | 'landlord-tenant',
  property: any,
  participants: any[],
  title: string
): Promise<any | null> {
  const label = `thread ${kind} on ${property.name}`
  try {
    const participantIds = participants.map((u) => String(u._id))
    const db = await app.get('mongodbClient')
    const existing = await db.collection('threads').findOne({
      kind,
      propertyId: String(property._id),
      participantIds: { $size: participantIds.length, $all: participantIds }
    } as any)
    if (existing) { log.reused(label); return existing }
    const created = await app.service('threads').create(
      {
        kind,
        subject:        { type: 'property', id: String(property._id) },
        propertyId:     String(property._id),
        participantIds,
        title
      } as any,
      asUser(participants[0])
    )
    log.created(label)
    return created
  } catch (e) { log.error(label, e); return null }
}

async function ensureChat(thread: any, sender: any, body: string): Promise<void> {
  try {
    const existing = listOf(await findAs('chat-messages', internal(), {
      threadId:     String(thread._id),
      senderUserId: String(sender._id),
      $limit: 200
    }))
    if (existing.some((m: any) => m.body === body)) {
      log.reused(`chat ${sender.email} → "${body.slice(0, 30)}..."`)
      return
    }
    await app.service('chat-messages').create(
      { threadId: String(thread._id), body } as any,
      asUser(sender, { provider: 'rest', authenticated: true })
    )
    log.created(`chat ${sender.email} → "${body.slice(0, 30)}..."`)
  } catch (e) { log.error(`chat ${sender.email}`, e) }
}

async function ensureAgentPayout(args: {
  property: any; assignment: any; landlord: any
  amount: number; baseAmount: number; currency: string
  trigger: 'rent_consummated' | 'sale_consummated' | 'first_month_paid' | 'each_renewal' | 'monthly_rent_collected' | 'manual'
  markPaid: boolean
}): Promise<void> {
  const label = `agent-payout ${args.property.name} (${args.trigger})`
  try {
    const existing = listOf(await findAs('agent-payouts', internal(), {
      propertyId:   String(args.property._id),
      assignmentId: String(args.assignment._id),
      trigger:      args.trigger,
      $limit: 1
    }))[0]
    let payout = existing
    if (!payout) {
      payout = await app.service('agent-payouts').create(
        {
          propertyId:   String(args.property._id),
          agentUserId:  String(args.assignment.agentUserId),
          assignmentId: String(args.assignment._id),
          amount:       args.amount,
          baseAmount:   args.baseAmount,
          currency:     args.currency,
          trigger:      args.trigger
        } as any,
        asUser(args.landlord, { provider: 'rest' })
      )
      log.created(label)
    } else {
      log.reused(label)
    }
    if (args.markPaid && payout.status !== 'paid') {
      await app.service('agent-payouts').patch(
        String(payout._id),
        { status: 'paid', paidAt: new Date().toISOString(), paidNote: 'Demo paid via mobile money' } as any,
        asUser(args.landlord, { provider: 'rest' })
      )
      log.patched(label, '→ paid')
    }
  } catch (e) { log.error(label, e) }
}

async function ensurePmPayout(args: {
  property: any; assignment: any; landlord: any
  amount: number; baseAmount: number; currency: string
  trigger: 'rent_consummated' | 'sale_consummated' | 'first_month_paid' | 'each_renewal' | 'monthly_rent_collected' | 'manual'
  markPaid: boolean
}): Promise<void> {
  const label = `pm-payout ${args.property.name} (${args.trigger})`
  try {
    const existing = listOf(await findAs('pm-payouts', internal(), {
      propertyId:   String(args.property._id),
      assignmentId: String(args.assignment._id),
      trigger:      args.trigger,
      $limit: 1
    }))[0]
    let payout = existing
    if (!payout) {
      payout = await app.service('pm-payouts').create(
        {
          propertyId:    String(args.property._id),
          managerUserId: String(args.assignment.managerUserId),
          assignmentId:  String(args.assignment._id),
          amount:        args.amount,
          baseAmount:    args.baseAmount,
          currency:      args.currency,
          trigger:       args.trigger
        } as any,
        asUser(args.landlord, { provider: 'rest' })
      )
      log.created(label)
    } else {
      log.reused(label)
    }
    if (args.markPaid && payout.status !== 'paid') {
      await app.service('pm-payouts').patch(
        String(payout._id),
        { status: 'paid', paidAt: new Date().toISOString(), paidNote: 'Demo paid via bank transfer' } as any,
        asUser(args.landlord, { provider: 'rest' })
      )
      log.patched(label, '→ paid')
    }
  } catch (e) { log.error(label, e) }
}

async function ensureAgentRating(tenant: any, profile: any, rating: number, comment: string): Promise<void> {
  const label = `agent-rating ${tenant.email} → ${profile.displayName}`
  try {
    const existing = listOf(await findAs('agent-ratings', internal(), {
      agentProfileId: String(profile._id),
      userId:         String(tenant._id),
      $limit: 1
    }))[0]
    if (existing) { log.reused(label); return }
    await app.service('agent-ratings').create(
      { agentProfileId: String(profile._id), rating, comment } as any,
      asUser(tenant)
    )
    log.created(label)
  } catch (e) { log.error(label, e) }
}

async function ensurePmRating(tenant: any, profile: any, rating: number, comment: string): Promise<void> {
  const label = `pm-rating ${tenant.email} → ${profile.displayName}`
  try {
    const existing = listOf(await findAs('pm-ratings', internal(), {
      pmProfileId: String(profile._id),
      userId:      String(tenant._id),
      $limit: 1
    }))[0]
    if (existing) { log.reused(label); return }
    await app.service('pm-ratings').create(
      { pmProfileId: String(profile._id), rating, comment } as any,
      asUser(tenant)
    )
    log.created(label)
  } catch (e) { log.error(label, e) }
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`\n${C.red}FATAL: ${err?.message || err}${C.reset}`)
    console.error(err?.stack)
    process.exit(2)
  })
