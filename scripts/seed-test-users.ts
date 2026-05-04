/**
 * Creates one verified test user per role for local/QA (shared password).
 *
 * Usage (from rentflow_api):
 *   npm run seed:test-users
 *
 * Password: `SEED_TEST_USERS_PASSWORD` in .env, or default `CribHubTest1!` (min 8 chars).
 * Emails (lowercase):
 *   cribhub-test-tenant@example.test
 *   cribhub-test-landlord@example.test
 *   cribhub-test-agent@example.test
 *   cribhub-test-pm@example.test
 *   cribhub-test-admin@example.test
 *
 * Idempotent: skips create if email exists; ensures `isVerified` and each listed role on `user-roles`.
 * Signup always grants `tenant`; extra roles are added after create.
 */

import 'dotenv/config'
import { app } from '../src/app'

/** Internal service calls (no HTTP provider). */
const internalParams = () => ({ provider: undefined } as any)

const DEFAULT_PASSWORD = 'CribHubTest1!'

type ExtraRole = 'landlord' | 'property_manager' | 'agent' | 'admin'

const TEST_USERS: { email: string; fullName: string; extraRoles: ExtraRole[]; note: string }[] = [
  { email: 'cribhub-test-tenant@example.test', fullName: 'CribHub Test Tenant', extraRoles: [], note: 'tenant only (default)' },
  { email: 'cribhub-test-landlord@example.test', fullName: 'CribHub Test Landlord', extraRoles: ['landlord'], note: 'tenant + landlord' },
  { email: 'cribhub-test-agent@example.test', fullName: 'CribHub Test Agent', extraRoles: ['agent'], note: 'tenant + agent' },
  { email: 'cribhub-test-pm@example.test', fullName: 'CribHub Test Property Manager', extraRoles: ['property_manager'], note: 'tenant + property_manager' },
  { email: 'cribhub-test-admin@example.test', fullName: 'CribHub Test Admin', extraRoles: ['admin'], note: 'tenant + admin' }
]

const listFromFind = (res: any): any[] => {
  if (Array.isArray(res)) return res
  return res?.data || []
}

async function hasRole(userId: string, role: string): Promise<boolean> {
  const res = (await app.service('user-roles').find(
    { paginate: false, query: { userId, role } } as any,
    internalParams()
  )) as any
  return listFromFind(res).length > 0
}

async function ensureRole(userId: string, role: ExtraRole | 'tenant'): Promise<void> {
  if (await hasRole(userId, role)) return
  await app.service('user-roles').create({ userId, role } as any, internalParams())
}

async function main() {
  await app.get('mongodbClient')

  const password = String(process.env.SEED_TEST_USERS_PASSWORD || DEFAULT_PASSWORD)
  if (password.length < 8) {
    throw new Error('SEED_TEST_USERS_PASSWORD must be at least 8 characters.')
  }

  console.log('Seeding test users (password from SEED_TEST_USERS_PASSWORD or default for dev only).')

  for (const def of TEST_USERS) {
    const email = def.email.toLowerCase()
    const existingRes = (await app.service('users').find({ paginate: false, query: { email } } as any, internalParams())) as any
    const existing = listFromFind(existingRes)[0]

    let userId: string

    if (existing) {
      userId = existing._id?.toString?.() ? existing._id.toString() : String(existing._id)
      console.log(`[exists] ${email} — ${def.note}`)
      await app.service('users').patch(userId, { isVerified: true } as any, internalParams())
      await app.service('users').patch(userId, { password } as any, internalParams())
    } else {
      const created = (await app.service('users').create(
        { email, password, fullName: def.fullName } as any,
        internalParams()
      )) as any
      userId = created._id?.toString?.() ? created._id.toString() : String(created._id)
      await app.service('users').patch(userId, { isVerified: true } as any, internalParams())
      console.log(`[created] ${email} — ${def.note}`)
    }

    for (const role of def.extraRoles) {
      await ensureRole(userId, role)
    }
  }

  console.log('Done. Log in with the emails above and the configured password.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
