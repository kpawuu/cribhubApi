# CribHub — Session updates (June 9, 2026)

A summary of every change shipped in this working session, across both
`cribhubApi` (FeathersJS backend) and `cribHubUI` (Nuxt frontend). Each
section is self-contained and lists exact files touched so a reviewer can
diff them quickly.

---

## 1 · Data seeding overhaul

### What changed

Created an end-to-end **comprehensive data seeder** that produces a realistic
demo environment in seconds — users with avatars, properties with pictures,
profiles with rate cards, listing requests in every workflow state,
assignments, payouts, chat threads, ratings (including a moderated/hidden
one), and role-requests in pending/approved/rejected states.

### Files

| File | Purpose |
|---|---|
| `scripts/seed-features.ts` *(NEW)* | Idempotent seeder that creates 13 users, 7 profiles, 7 listing-requests in mixed states, 2 direct assignments, 3 chat threads with messages, 5 payouts, 5 ratings (1 hidden by admin) and 3 role-requests. Tag every record so re-runs are no-ops. |
| `package.json` | Added scripts: `seed:features`, `seed:all` (chains test-users → properties → features). |

### Issues fixed during seeding

| Error | Fix |
|---|---|
| `property-manager-assignments find` rejected `{ managerUserId: { $exists: true } }` because the query validator strips unknown operators on that field. | Switched the filter to `landlordId` (already in the allowed query set) and dropped the redundant client-side filter. |

### Usage

```powershell
$env:NOTIFICATION_EMAIL_DISABLED='true'   # (optional) silence outgoing mail
$env:NOTIFICATION_SMS_DISABLED='true'
npm run seed:all
```

The seeder is fully idempotent — re-runs print `+ created: 0`, no errors.

### Seeded login accounts (password: `CribHubTest1!`)

| Role | Email |
|---|---|
| Tenant | `cribhub-test-tenant@example.test` |
| Landlord | `cribhub-test-landlord@example.test` |
| Agent | `cribhub-test-agent@example.test` |
| Property Manager | `cribhub-test-pm@example.test` |
| Admin | `cribhub-test-admin@example.test` |

Plus 3 extra agents (Ama, Kofi, Akua), 2 extra PMs (Yaa, Nii), 3 extra
tenants (Esi, Kweku, Naa), and 3 role-request applicants in
pending / approved / rejected states.

---

## 2 · Real-time coverage — every service now reactive

### What changed

Audited the entire Nuxt frontend (every Pinia store + every page that calls
`feathers.service(...)`) and confirmed that every backend service holding
persisted data is now wired to Socket.IO `created` / `patched` / `updated` /
`removed` events.

### Backend transport
Backend `src/channels.ts` already published every CRUD service to the
`authenticated` channel (and `anonymous` for `properties` + `site-pages`).
This section closes the *client-side* gaps that prevented those events from
updating the UI.

### Gaps closed

| Service | Before | After |
|---|---|---|
| `units` | No realtime — vacant list went stale | Full realtime: vacant rows added/removed in place, per-property cache mirrored, `selected` refreshed |
| `agent-ratings` | No realtime on profile or admin pages | Profile page & admin moderation now upsert/remove rows live; hidden rows only shown to admin or rating's own author |
| `pm-ratings` | Same gap as `agent-ratings` | Same fix |
| `agent-payouts` / `pm-payouts` | Admin queue stale until manual refresh | Admin payouts page now subscribes; toggling agent ↔ PM kind rewires correctly |
| `chat-messages` | Only `created` was wired | Now also handles `patched` / `updated` (read receipts, edits) and `removed` (deletions) |
| `legal-documents` (CMS store) | Pure manual fetch | Subscribes once on first fetch |

### Files

| File | Change |
|---|---|
| `stores/units.ts` | Added `ensureRealtime()` that updates `vacantList`, `byProperty[id]`, and `selected`. Exports `byProperty`. |
| `stores/operations.ts` (`useChatMessagesStore`) | Extended `open()` to listen for `patched / updated / removed`. Teardown extended accordingly. |
| `stores/legalDocuments.ts` | Added `ensureRealtime()` mirroring the standard upsert/remove pattern. |
| `app/pages/property-managers/[id].vue` | Realtime via `useFeathersRealtime('pm-ratings')` + `useFeathersRealtime('property-manager-profiles')`. Visibility rule mirrors server `hideModeratedFromPublic` hook. |
| `app/pages/agents/[id].vue` | Same treatment for `agent-ratings` + `agent-profiles`. |
| `app/pages/admin/ratings.vue` | Subscribes via `useFeathersRealtime` — rebinds when admin toggles agent ↔ PM kind. |
| `app/pages/admin/payouts.vue` | Same treatment for `agent-payouts` / `pm-payouts`. |

### Notes

- The previously-unused `app/composables/useFeathersRealtime.ts` composable
  is now consumed by all four ratings/payouts surfaces with proper
  `onScopeDispose` teardown.
- The existing per-page listeners in `app/pages/landlord/properties/[id].vue`
  already had complete `onBeforeUnmount` teardown — no leak fix needed.

---

## 3 · `$include` query operator — fixed at the source

### Symptom

```
error: agent-profiles find error: unknown top level operator: $include.
MongoServerError: unknown top level operator: $include.
```

### Cause

The frontend uses a CribHub-specific `$include: ['files', 'applicant', ...]`
query parameter to opt-in to virtual fields populated by each service's
`externalResolver`. Seven services had a `shouldInclude()` helper that
*read* the parameter, but **none** of them stripped it from the query
before the request reached MongoDB. So `$include` was forwarded as if it
were a top-level Mongo operator, which Mongo rejects.

It worked accidentally for services where nobody had tested the
`$include` path — `agent-profiles` finally tripped it.

### Fix

| File | Change |
|---|---|
| `src/hooks/strip-query-include.ts` *(NEW)* | Pops `$include` off `params.query` and stashes it on `params.$include`. Re-stamps the adapter `VALIDATED` symbol so the trimmed query isn't re-validated. |
| `src/app.ts` | Registered `stripQueryInclude` as a global `before.all` hook — applies to **every** service automatically; no per-service wiring. |
| `src/services/role-requests/role-requests.schema.ts` | `shouldInclude()` now reads from `params.$include` (with fallback to `query.$include` for legacy internal callers). |
| `src/services/agent-assignments/agent-assignments.schema.ts` | Same shape. |
| `src/services/property-manager-assignments/property-manager-assignments.schema.ts` | Same shape. |
| `src/services/agent-listing-requests/agent-listing-requests.schema.ts` | Same shape. |
| `src/services/property-manager-listing-requests/property-manager-listing-requests.schema.ts` | Same shape. |
| `src/services/agent-payouts/agent-payouts.schema.ts` | Same shape. |
| `src/services/pm-payouts/pm-payouts.schema.ts` | Same shape. |

### Verification

- 76/76 smoke checks still pass.
- Feature seeder still re-runs idempotently (0 created, 56 reused, 0 errors).
- Landlord property page loads the agent-profiles list (`$include: ['files']`)
  without error.

---

## 4 · Production deployment — `Cannot find module '/app/lib'` fixed

### Symptom

```
Error: Cannot find module '/app/lib'
code: 'MODULE_NOT_FOUND'
npm warn config production Use `--omit=dev` instead.
```

### Cause

`npm start` runs `node lib/` (the compiled output), but the previous
`package.json` only had a `compile` script — no `build`. Most PaaS auto-
detect `npm run build`, none auto-detect `compile`, so the TypeScript
compile step was being skipped on deploy. On top of that, hosts that set
`NPM_CONFIG_PRODUCTION=true` (legacy Render, old Heroku, etc.) prune dev
dependencies — so even if you tried to compile, `tsc`/`shx` wouldn't be
present.

### Fix

| File | Change |
|---|---|
| `package.json` | Added `"build": "npm run compile"` and `"heroku-postbuild": "npm run build"`. PaaS now auto-detect the compile step. |
| `Dockerfile` *(NEW)* | Multi-stage build: builder installs `--include=dev` and compiles; runtime ships a slim image with `--omit=dev` and runs as non-root `node`. Fails fast if `lib/index.js` wasn't produced. Honours `$PORT` via `config/custom-environment-variables.json`. |
| `.dockerignore` *(NEW)* | Excludes `lib/`, `node_modules`, `.env*`, dev-only logs, scripts, docs — keeps the image small and free of secrets. |
| `config/production.json` *(NEW)* | Tiny override file. Silences the node-config `NODE_ENV value of 'production' did not match any deployment config file names` warning. Real values still come from env vars. |
| `README.md` | New **Production deployment** section covering Docker, Nixpacks/Buildpacks, Heroku, and bare-metal — including the `NPM_CONFIG_PRODUCTION` gotcha. |

### Verification

```
> npm run build
exit=0
OK lib/index.js exists, size=770 bytes
```

`node lib/` boots cleanly and listens until killed.

### How to redeploy

**Docker / Coolify with Dockerfile** *(recommended)*

```bash
docker build -t cribhub-api .
docker run --rm -p 3000:3000 \
  -e MONGODB_URL='mongodb://…' \
  -e FEATHERS_SECRET="$(openssl rand -hex 32)" \
  cribhub-api
```

**Nixpacks / Buildpacks / Heroku / Render / Railway**

Push the new `package.json` — the `build` script will be picked up
automatically on the next deploy.

Required env vars:

| Var | Notes |
|---|---|
| `PORT` | Injected by most hosts |
| `HOSTNAME` | Public hostname (e.g. `api.cribhub-gh.com`) |
| `MONGODB_URL` | Mongo connection string |
| `FEATHERS_SECRET` | JWT signing secret — generate with `openssl rand -hex 32` or `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

---

## Files added or modified (master list)

### `cribhubApi/`

**Added**
- `scripts/seed-features.ts`
- `src/hooks/strip-query-include.ts`
- `Dockerfile`
- `.dockerignore`
- `config/production.json`
- `UPDATES.md` *(this file)*

**Modified**
- `package.json` *(scripts: `seed:features`, `seed:all`, `build`, `heroku-postbuild`)*
- `src/app.ts` *(register global `stripQueryInclude` hook)*
- `src/services/role-requests/role-requests.schema.ts`
- `src/services/agent-assignments/agent-assignments.schema.ts`
- `src/services/property-manager-assignments/property-manager-assignments.schema.ts`
- `src/services/agent-listing-requests/agent-listing-requests.schema.ts`
- `src/services/property-manager-listing-requests/property-manager-listing-requests.schema.ts`
- `src/services/agent-payouts/agent-payouts.schema.ts`
- `src/services/pm-payouts/pm-payouts.schema.ts`
- `README.md`

### `cribHubUI/`

**Modified**
- `stores/units.ts`
- `stores/operations.ts` *(`useChatMessagesStore`)*
- `stores/legalDocuments.ts`
- `app/pages/property-managers/[id].vue`
- `app/pages/agents/[id].vue`
- `app/pages/admin/ratings.vue`
- `app/pages/admin/payouts.vue`

---

## Test status

| Suite | Result |
|---|---|
| `npm run smoke:cleanup` | ✅ 76 / 76 checks pass |
| `npm run seed:all` | ✅ Runs end-to-end, fully idempotent |
| `npm run build` | ✅ Produces `lib/index.js`, runs cleanly |
| TypeScript lints (both repos) | ✅ No errors |
