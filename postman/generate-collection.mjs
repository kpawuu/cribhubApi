/**
 * Generates Rentflow-API.postman_collection.json (Postman Collection v2.1).
 * Run: node postman/generate-collection.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outPath = path.join(__dirname, 'Rentflow-API.postman_collection.json')

const bearer = [{ key: 'Authorization', value: 'Bearer {{accessToken}}', type: 'text' }]
const jsonAuth = [...bearer, { key: 'Content-Type', value: 'application/json', type: 'text' }]
const jsonPublic = [{ key: 'Content-Type', value: 'application/json', type: 'text' }]

/**
 * Postman shows and sends requests correctly when `url` includes protocol, host, port, path, and query —
 * not only `raw`. Variables: `apiProtocol`, `apiHost`, `apiPort` (see environment defaults).
 */
function buildPostmanUrl(relPath) {
  const trimmed = String(relPath || '').replace(/^\/+/, '')
  const qIdx = trimmed.indexOf('?')
  const pathPart = qIdx >= 0 ? trimmed.slice(0, qIdx) : trimmed
  const queryPart = qIdx >= 0 ? trimmed.slice(qIdx + 1) : ''

  const path = pathPart ? pathPart.split('/').filter(Boolean) : []

  const query = []
  if (queryPart) {
    for (const pair of queryPart.split('&')) {
      if (!pair) continue
      const eq = pair.indexOf('=')
      const key = eq >= 0 ? decodeURIComponent(pair.slice(0, eq)) : decodeURIComponent(pair)
      const value = eq >= 0 ? decodeURIComponent(pair.slice(eq + 1) || '') : ''
      query.push({ key, value })
    }
  }

  const pathStr = path.join('/')
  const raw =
    `{{apiProtocol}}://{{apiHost}}:{{apiPort}}` +
    (pathStr ? `/${pathStr}` : '/') +
    (queryPart ? `?${queryPart}` : '')

  return {
    raw,
    protocol: '{{apiProtocol}}',
    host: ['{{apiHost}}'],
    port: '{{apiPort}}',
    path,
    ...(query.length ? { query } : {})
  }
}

function req(name, method, relPath, opts = {}) {
  const { desc = '', body = undefined, headers = jsonAuth, noAuth = false, tests = null } = opts
  const h = noAuth ? headers.filter((x) => x.key !== 'Authorization') : headers
  const request = {
    method,
    header: h,
    url: buildPostmanUrl(relPath),
    description: desc
  }
  if (body !== undefined) {
    request.body = {
      mode: 'raw',
      raw: typeof body === 'string' ? body : JSON.stringify(body, null, 2),
      options: { raw: { language: 'json' } }
    }
  }
  const item = { name, request }
  if (tests && Array.isArray(tests)) {
    item.event = [{ listen: 'test', script: { exec: tests, type: 'text/javascript' } }]
  }
  return item
}

function folder(name, description, items) {
  return { name, description, item: items }
}

const loginTests = [
  'if (pm.response.code === 201 || pm.response.code === 200) {',
  '  const j = pm.response.json();',
  "  if (j.accessToken) pm.environment.set('accessToken', j.accessToken);",
  "  if (j.refreshToken) pm.environment.set('refreshToken', j.refreshToken);",
  '  const u = j.user || j.authentication?.user;',
  "  if (u && u._id) pm.environment.set('userId', String(u._id));",
  "  if (u && u.email) pm.environment.set('userEmail', u.email);",
  '}'
]

const collection = {
  info: {
    name: 'RentFlow / CribHub API (complete)',
    description:
      '**FeathersJS v5 + Koa** REST surface for `rentflow_api`. Default port **3036**.\n\n' +
      '**Auth**: Run **Authentication → Login (local)**; tests auto-save `accessToken`, `refreshToken`, `userId`, `userEmail` when present.\n\n' +
      '**URL**: Each request sets `protocol`, `host`, `port`, `path`, and `query` (not only `raw`) so Postman shows the endpoint after import. Use environment vars **`apiProtocol`**, **`apiHost`**, **`apiPort`**; optional **`baseUrl`** = `{{apiProtocol}}://{{apiHost}}:{{apiPort}}` for scripts.\n\n' +
      '**Real-time**: Socket.io shares the same base URL; this collection is **HTTP only**.\n\n' +
      '**Paystack webhook**: Requires raw body + `x-paystack-signature`; use Paystack CLI or dashboard replays for real tests.\n\n' +
      '**Multipart**: `POST …/files-uploader/file-upload` with form fields + file(s).\n\n' +
      '**OAuth** (optional): If configured, browser flows use `/oauth/google`, `/oauth/facebook` (see `@feathersjs/authentication-oauth`).\n\n' +
      '**Admin bootstrap**: `POST /admin-bootstrap` requires server env **`ADMIN_BOOTSTRAP_SECRET`** (≥16 chars) matching Postman **`{{adminBootstrapSecret}}`**. Then use **Create admin user** or **Grant admin to existing user**.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  variable: [
    { key: 'apiProtocol', value: 'http' },
    { key: 'apiHost', value: 'localhost' },
    { key: 'apiPort', value: '3036' },
    { key: 'baseUrl', value: 'http://localhost:3036' }
  ],
  item: [
    folder(
      'Authentication',
      '`POST /authentication` — strategies: `local`, `jwt`. Unverified users may receive 403 on login.',
      [
        req('Login (local)', 'POST', 'authentication', {
          body: { strategy: 'local', email: '{{userEmail}}', password: '{{userPassword}}' },
          headers: jsonPublic,
          noAuth: true,
          tests: loginTests
        }),
        req('Authenticate (JWT)', 'POST', 'authentication', {
          body: { strategy: 'jwt', accessToken: '{{accessToken}}' },
          headers: jsonPublic,
          noAuth: true
        })
      ]
    ),
    folder(
      'Admin bootstrap',
      '**Public** `POST /admin-bootstrap` (no JWT). Server must set **`ADMIN_BOOTSTRAP_SECRET`** (min 16 characters). Postman **`adminBootstrapSecret`** must match exactly.\n\n' +
        '- **Create admin user**: new account; gets **tenant** (default signup) + **admin**; **isVerified** set true so login works.\n' +
        '- **Grant admin to existing user**: `mode: promote` + email; marks verified and adds **admin** if missing.',
      [
        req('Create admin user (new account)', 'POST', 'admin-bootstrap', {
          desc: 'Set `adminBootstrapSecret` in Postman environment = `ADMIN_BOOTSTRAP_SECRET` on the API. Then run Login with the new email/password.',
          body: {
            secret: '{{adminBootstrapSecret}}',
            mode: 'create',
            email: 'admin@example.com',
            password: 'ChangeMe_Str0ng!',
            fullName: 'Site Admin',
            phone: '+233200000000'
          },
          headers: jsonPublic,
          noAuth: true
        }),
        req('Grant admin to existing user', 'POST', 'admin-bootstrap', {
          body: {
            secret: '{{adminBootstrapSecret}}',
            mode: 'promote',
            email: '{{userEmail}}'
          },
          headers: jsonPublic,
          noAuth: true
        })
      ]
    ),
    folder(
      'Refresh tokens',
      '`POST` exchanges refresh token. `PATCH` / `DELETE` require JWT per hooks.',
      [
        req('Create (exchange refresh)', 'POST', 'refresh-tokens', {
          body: { refreshToken: '{{refreshToken}}' },
          headers: jsonPublic,
          noAuth: true
        }),
        req('Find', 'GET', 'refresh-tokens?$limit=25'),
        req('Get', 'GET', 'refresh-tokens/{{refreshTokenRowId}}'),
        req('Patch', 'PATCH', 'refresh-tokens/{{refreshTokenRowId}}', { body: { isValid: false } }),
        req('Remove', 'DELETE', 'refresh-tokens/{{refreshTokenRowId}}')
      ]
    ),
    folder(
      'Users',
      '**create** is public signup. External **find/get/patch/remove** scoped to self (non-admin).',
      [
        req('Find', 'GET', 'users?$limit=10'),
        req('Get', 'GET', 'users/{{userId}}'),
        req('Create (signup)', 'POST', 'users', {
          body: {
            email: 'demo+postman@example.com',
            password: 'Str0ngP@ssw0rd!',
            fullName: 'Postman User',
            phone: '+233200000000',
            requestedRole: 'tenant'
          },
          headers: jsonPublic,
          noAuth: true
        }),
        req('Patch (self)', 'PATCH', 'users/{{userId}}', {
          body: { fullName: 'Updated Name', defaultCurrency: 'GHS' }
        }),
        req('Remove (self)', 'DELETE', 'users/{{userId}}')
      ]
    ),
    folder(
      'User roles',
      'External **create**: only **tenant** self-assign. Other roles via admin / approved **role-requests**.',
      [
        req('Find', 'GET', 'user-roles?$limit=100&userId={{userId}}'),
        req('Get', 'GET', 'user-roles/{{userRoleId}}'),
        req('Create (self tenant)', 'POST', 'user-roles', {
          body: { userId: '{{userId}}', role: 'tenant' },
          headers: jsonAuth,
          noAuth: false
        }),
        req('Patch', 'PATCH', 'user-roles/{{userRoleId}}', { body: {} }),
        req('Remove', 'DELETE', 'user-roles/{{userRoleId}}')
      ]
    ),
    folder(
      'Role requests',
      '',
      [
        req('Find', 'GET', 'role-requests?$limit=50'),
        req('Get', 'GET', 'role-requests/{{roleRequestId}}'),
        req('Create', 'POST', 'role-requests', {
          body: { userId: '{{userId}}', role: 'landlord' }
        }),
        req('Patch', 'PATCH', 'role-requests/{{roleRequestId}}', {
          body: { status: 'approved', notes: 'Approved via Postman' }
        }),
        req('Remove', 'DELETE', 'role-requests/{{roleRequestId}}')
      ]
    ),
    folder(
      'Auth management',
      '`feathers-authentication-management` — POST `{ action, value }`.',
      [
        req('checkUnique', 'POST', 'auth-management', {
          body: { action: 'checkUnique', value: { email: 'new@example.com' } },
          headers: jsonPublic,
          noAuth: true
        }),
        req('sendResetPwd', 'POST', 'auth-management', {
          body: { action: 'sendResetPwd', value: { email: '{{userEmail}}' } },
          headers: jsonPublic,
          noAuth: true
        }),
        req('resetPwdLong', 'POST', 'auth-management', {
          body: { action: 'resetPwdLong', value: { token: 'TOKEN_FROM_EMAIL', password: 'NewStr0ng!' } },
          headers: jsonPublic,
          noAuth: true
        }),
        req('resetPwdShort', 'POST', 'auth-management', {
          body: {
            action: 'resetPwdShort',
            value: { user: { email: '{{userEmail}}' }, token: '000000', password: 'NewStr0ng!' }
          },
          headers: jsonPublic,
          noAuth: true
        }),
        req('passwordChange', 'POST', 'auth-management', {
          body: {
            action: 'passwordChange',
            value: { user: { email: '{{userEmail}}' }, oldPassword: '{{userPassword}}', password: 'NewStr0ng!' }
          },
          headers: jsonPublic,
          noAuth: true
        }),
        req('verifySignupLong', 'POST', 'auth-management', {
          body: { action: 'verifySignupLong', value: { token: 'VERIFY_TOKEN_FROM_EMAIL' } },
          headers: jsonPublic,
          noAuth: true
        }),
        req('resendVerifySignup', 'POST', 'auth-management', {
          body: { action: 'resendVerifySignup', value: { email: '{{userEmail}}' } },
          headers: jsonPublic,
          noAuth: true
        })
      ]
    ),
    folder(
      'Delete account',
      'JWT + `{ password }`.',
      [req('Create', 'POST', 'delete-account', { body: { password: '{{userPassword}}' } })]
    ),
    folder(
      'Dashboard',
      '`find` returns one summary object (role-scoped counts).',
      [req('Find', 'GET', 'dashboard?$limit=1')]
    ),
    folder(
      'Listing sidebar',
      'Public `find` — no auth.',
      [
        req('Find', 'GET', 'listing-sidebar', {
          desc: 'Returns `popularSearches` and `nearbyAreas` for UI sidebars.',
          headers: [],
          noAuth: true
        })
      ]
    ),
    folder(
      'Properties',
      'Listing queries support `$search`, `type`, `superAgent`, `mine`, etc. (see `properties` service + schema).',
      [
        req('Find (catalog)', 'GET', 'properties?$limit=12&$sort[createdAt]=-1'),
        req('Find (mine)', 'GET', 'properties?mine=true&$limit=50'),
        req('Find (search)', 'GET', 'properties?$limit=12&$search=East+Legon'),
        req('Get', 'GET', 'properties/{{propertyId}}'),
        req('Create', 'POST', 'properties', {
          body: {
            name: 'Postman Tower',
            address: '1 Test Street',
            city: 'Accra',
            country: 'Ghana',
            propertyType: 'Apartment',
            description: 'Seed from Postman',
            area: 'East Legon',
            bedrooms: 2,
            bathrooms: 2,
            price: 3500,
            priceCurrency: 'GHS',
            pricePeriod: 'monthly'
          }
        }),
        req('Patch', 'PATCH', 'properties/{{propertyId}}', { body: { description: 'Updated via Postman' } }),
        req('Remove', 'DELETE', 'properties/{{propertyId}}')
      ]
    ),
    folder(
      'Units',
      '',
      [
        req('Find', 'GET', 'units?$limit=50&propertyId={{propertyId}}'),
        req('Get', 'GET', 'units/{{unitId}}'),
        req('Create', 'POST', 'units', {
          body: {
            propertyId: '{{propertyId}}',
            unitNumber: 'A-101',
            bedrooms: 2,
            bathrooms: 2,
            rentAmount: 2500,
            rentCurrency: 'GHS',
            status: 'vacant'
          }
        }),
        req('Patch', 'PATCH', 'units/{{unitId}}', { body: { status: 'occupied' } }),
        req('Remove', 'DELETE', 'units/{{unitId}}')
      ]
    ),
    folder(
      'Rental applications',
      '',
      [
        req('Find', 'GET', 'rental-applications?$limit=50'),
        req('Get', 'GET', 'rental-applications/{{rentalApplicationId}}'),
        req('Create', 'POST', 'rental-applications', {
          body: {
            unitId: '{{unitId}}',
            applicationData: { employment: 'demo', monthlyIncome: 5000 },
            documents: []
          }
        }),
        req('Patch', 'PATCH', 'rental-applications/{{rentalApplicationId}}', {
          body: { status: 'approved', reviewNotes: 'Welcome' }
        }),
        req('Remove', 'DELETE', 'rental-applications/{{rentalApplicationId}}')
      ]
    ),
    folder(
      'Rental contracts',
      '',
      [
        req('Find', 'GET', 'rental-contracts?$limit=50'),
        req('Get', 'GET', 'rental-contracts/{{rentalContractId}}'),
        req('Create', 'POST', 'rental-contracts', {
          body: {
            unitId: '{{unitId}}',
            landlordId: '{{landlordUserId}}',
            tenantId: '{{tenantUserId}}',
            startDate: '2026-01-01',
            endDate: '2026-12-31',
            monthlyRent: 2500,
            rentCurrency: 'GHS',
            status: 'draft'
          }
        }),
        req('Patch', 'PATCH', 'rental-contracts/{{rentalContractId}}', { body: { status: 'sent' } }),
        req('Remove', 'DELETE', 'rental-contracts/{{rentalContractId}}')
      ]
    ),
    folder(
      'Maintenance requests',
      'Create attaches `tenantId` from JWT. `category` required.',
      [
        req('Find', 'GET', 'maintenance-requests?$limit=50'),
        req('Get', 'GET', 'maintenance-requests/{{maintenanceRequestId}}'),
        req('Create', 'POST', 'maintenance-requests', {
          body: {
            unitId: '{{unitId}}',
            title: 'Leaky tap',
            description: 'Kitchen tap drips',
            category: 'plumbing',
            priority: 'medium'
          }
        }),
        req('Patch', 'PATCH', 'maintenance-requests/{{maintenanceRequestId}}', { body: { status: 'in_progress' } }),
        req('Remove', 'DELETE', 'maintenance-requests/{{maintenanceRequestId}}')
      ]
    ),
    folder(
      'Communications',
      '`landlordId` attached on create. Body: `fromName`, `property`, `message`.',
      [
        req('Find', 'GET', 'communications?$limit=50'),
        req('Get', 'GET', 'communications/{{communicationId}}'),
        req('Create', 'POST', 'communications', {
          body: {
            fromName: 'Landlord Demo',
            property: '{{propertyId}}',
            message: 'Portfolio update for tenants',
            type: 'notice'
          }
        }),
        req('Patch', 'PATCH', 'communications/{{communicationId}}', { body: { isRead: true } }),
        req('Remove', 'DELETE', 'communications/{{communicationId}}')
      ]
    ),
    folder(
      'Notices',
      '`landlordId` + `author` attached from user when missing.',
      [
        req('Find', 'GET', 'notices?$limit=50'),
        req('Get', 'GET', 'notices/{{noticeId}}'),
        req('Create', 'POST', 'notices', {
          body: {
            title: 'Water shutdown',
            content: 'Scheduled maintenance Tuesday 10am.',
            type: 'building',
            author: 'Property Office'
          }
        }),
        req('Patch', 'PATCH', 'notices/{{noticeId}}', { body: { title: 'Updated title' } }),
        req('Remove', 'DELETE', 'notices/{{noticeId}}')
      ]
    ),
    folder(
      'Exchange rates',
      '`landlordId` attached on create. Data: `targetCurrency`, `rate`, optional `baseCurrency`.',
      [
        req('Find', 'GET', 'exchange-rates?$limit=50'),
        req('Get', 'GET', 'exchange-rates/{{exchangeRateId}}'),
        req('Create', 'POST', 'exchange-rates', {
          body: { targetCurrency: 'USD', rate: 0.065, baseCurrency: 'GHS' }
        }),
        req('Patch', 'PATCH', 'exchange-rates/{{exchangeRateId}}', { body: { rate: 0.066 } }),
        req('Remove', 'DELETE', 'exchange-rates/{{exchangeRateId}}')
      ]
    ),
    folder(
      'Payments',
      '**Manual entry** (landlord): body uses `paymentDataSchema` — `tenantId`, `unitId`, `amount` (+ optional fields); `landlordId` + `reference` auto.\n\n' +
        '**Paystack**: `create` with `action: initialize` or `action: verify`.',
      [
        req('Find', 'GET', 'payments?$limit=50'),
        req('Get', 'GET', 'payments/{{paymentId}}'),
        req('Create (manual entry)', 'POST', 'payments', {
          body: {
            tenantId: '{{tenantUserId}}',
            unitId: '{{unitId}}',
            amount: 100,
            currency: 'GHS',
            payerName: 'Tenant Demo',
            payerPhone: '+233200000000'
          }
        }),
        req('Create (Paystack initialize)', 'POST', 'payments', {
          body: {
            action: 'initialize',
            email: '{{userEmail}}',
            amount: 100,
            currency: 'GHS',
            unitId: '{{unitId}}',
            landlordId: '{{landlordUserId}}'
          }
        }),
        req('Create (Paystack verify)', 'POST', 'payments', {
          body: { action: 'verify', reference: 'paystack_reference_from_checkout' }
        }),
        req('Patch', 'PATCH', 'payments/{{paymentId}}', {
          body: { metadata: { note: 'postman' } }
        }),
        req('Remove (admin)', 'DELETE', 'payments/{{paymentId}}')
      ]
    ),
    folder(
      'Paystack webhook',
      'Public `POST`. Signature = HMAC-SHA512(raw JSON body, `PAYSTACK_SECRET_KEY`).',
      [
        req('Create (sample — expect 403 without valid signature)', 'POST', 'paystack-webhook', {
          body: {
            event: 'charge.success',
            data: {
              reference: 'ref_postman_test',
              amount: 10000,
              currency: 'GHS',
              channel: 'card',
              paid_at: '2026-01-01T12:00:00Z',
              metadata: {
                tenant_id: '{{tenantUserId}}',
                landlord_id: '{{landlordUserId}}',
                unit_id: '{{unitId}}'
              }
            }
          },
          headers: jsonPublic,
          noAuth: true
        })
      ]
    ),
    folder(
      'Legal documents',
      '`userId` attached from JWT on create.',
      [
        req('Find', 'GET', 'legal-documents?$limit=50'),
        req('Get', 'GET', 'legal-documents/{{legalDocumentId}}'),
        req('Create', 'POST', 'legal-documents', {
          body: {
            title: 'Notice to quit (draft)',
            documentType: 'notice',
            jurisdiction: 'Ghana',
            content: 'Draft body…'
          }
        }),
        req('Patch', 'PATCH', 'legal-documents/{{legalDocumentId}}', { body: { title: 'Renamed' } }),
        req('Remove', 'DELETE', 'legal-documents/{{legalDocumentId}}')
      ]
    ),
    folder(
      'Virtual viewing requests',
      '',
      [
        req('Find', 'GET', 'virtual-viewing-requests?$limit=50'),
        req('Get', 'GET', 'virtual-viewing-requests/{{virtualViewingRequestId}}'),
        req('Create', 'POST', 'virtual-viewing-requests', {
          body: {
            unitId: '{{unitId}}',
            name: 'Jane Viewer',
            email: 'jane@example.com',
            phone: '+233200000001',
            preferredDate: '2026-06-01',
            preferredTime: '14:00',
            message: 'Weekend preferred'
          }
        }),
        req('Patch', 'PATCH', 'virtual-viewing-requests/{{virtualViewingRequestId}}', { body: { status: 'confirmed' } }),
        req('Remove', 'DELETE', 'virtual-viewing-requests/{{virtualViewingRequestId}}')
      ]
    ),
    folder(
      'Verification documents',
      '',
      [
        req('Find', 'GET', 'verification-documents?$limit=50'),
        req('Get', 'GET', 'verification-documents/{{verificationDocumentId}}'),
        req('Create', 'POST', 'verification-documents', {
          body: {
            roleRequestId: '{{roleRequestId}}',
            documentType: 'national_id',
            documentUrl: 'https://example.com/id-scan.pdf'
          }
        }),
        req('Patch', 'PATCH', 'verification-documents/{{verificationDocumentId}}', { body: { documentType: 'national_id' } }),
        req('Remove', 'DELETE', 'verification-documents/{{verificationDocumentId}}')
      ]
    ),
    folder(
      'SMS (mnotify)',
      'Roles: admin | landlord | property_manager.',
      [
        req('Create', 'POST', 'sms', {
          body: {
            recipient: ['233200000000'],
            message: 'RentFlow test SMS',
            sender: 'RentFlow',
            is_schedule: false,
            schedule_date: ''
          }
        })
      ]
    ),
    folder(
      'AI',
      'Actions: `generate-contract`, `generate-legal-document`.',
      [
        req('Create — generate-contract', 'POST', 'ai', {
          body: { action: 'generate-contract', contractId: '{{rentalContractId}}' }
        }),
        req('Create — generate-legal-document', 'POST', 'ai', {
          body: {
            action: 'generate-legal-document',
            title: 'Draft rider',
            documentType: 'rider',
            jurisdiction: 'Ghana',
            prompt: 'Short bullet terms'
          }
        })
      ]
    ),
    folder(
      'Files',
      '',
      [
        req('Find', 'GET', 'files?$limit=50'),
        req('Get', 'GET', 'files/{{fileId}}'),
        req('Create', 'POST', 'files', {
          body: {
            entityId: '{{propertyId}}',
            entityType: 'properties',
            fileName: 'doc.pdf',
            fileType: 'application/pdf',
            fileSize: 1024,
            fileUrl: 'https://example.com/doc.pdf',
            tags: ['postman']
          }
        }),
        req('Patch', 'PATCH', 'files/{{fileId}}', { body: { tags: ['postman', 'v2'] } }),
        req('Remove', 'DELETE', 'files/{{fileId}}')
      ]
    ),
    folder(
      'Files uploader',
      'Koa route **POST /files-uploader/file-upload** (multipart). Feathers service path **POST /files-uploader** delegates to `create` with parsed files.',
      [
        {
          name: 'Multipart POST /files-uploader/file-upload',
          request: {
            method: 'POST',
            header: bearer,
            body: {
              mode: 'formdata',
              formdata: [
                { key: 'entityType', value: 'properties', type: 'text' },
                { key: 'entityId', value: '{{propertyId}}', type: 'text' },
                { key: 'purpose', value: 'gallery', type: 'text' },
                { key: 'files', type: 'file', src: [] }
              ]
            },
            url: buildPostmanUrl('files-uploader/file-upload'),
            description: 'JWT required. Match field names to `koa-body` / formidable setup.'
          }
        },
        req('Create (service path — prefer multipart route)', 'POST', 'files-uploader', {
          body: { note: 'Prefer /files-uploader/file-upload for real uploads' }
        })
      ]
    ),
    folder(
      'Agent profiles',
      '`displayName` required on create.',
      [
        req('Find', 'GET', 'agent-profiles?$limit=50'),
        req('Get', 'GET', 'agent-profiles/{{agentProfileId}}'),
        req('Create', 'POST', 'agent-profiles', {
          body: {
            displayName: 'Kwame Agent',
            agency: 'Demo Realty',
            phone: '+233200000002',
            bio: 'Postman seed profile',
            regions: ['Greater Accra'],
            languages: ['en']
          }
        }),
        req('Patch', 'PATCH', 'agent-profiles/{{agentProfileId}}', { body: { bio: 'Updated bio' } }),
        req('Remove', 'DELETE', 'agent-profiles/{{agentProfileId}}')
      ]
    ),
    folder(
      'Agent assignments',
      '',
      [
        req('Find', 'GET', 'agent-assignments?$limit=100'),
        req('Get', 'GET', 'agent-assignments/{{agentAssignmentId}}'),
        req('Create', 'POST', 'agent-assignments', {
          body: { propertyId: '{{propertyId}}', agentUserId: '{{agentUserId}}' }
        }),
        req('Patch', 'PATCH', 'agent-assignments/{{agentAssignmentId}}', { body: {} }),
        req('Remove', 'DELETE', 'agent-assignments/{{agentAssignmentId}}')
      ]
    ),
    folder(
      'Inquiries',
      '',
      [
        req('Find', 'GET', 'inquiries?$limit=50'),
        req('Get', 'GET', 'inquiries/{{inquiryId}}'),
        req('Create', 'POST', 'inquiries', {
          body: {
            propertyId: '{{propertyId}}',
            name: 'Lead',
            email: 'lead@example.com',
            message: 'Is this still available?',
            contactMethod: 'email'
          }
        }),
        req('Patch', 'PATCH', 'inquiries/{{inquiryId}}', { body: { status: 'contacted' } }),
        req('Remove', 'DELETE', 'inquiries/{{inquiryId}}')
      ]
    ),
    folder(
      'Favorites',
      '`userId` attached from JWT on create.',
      [
        req('Find', 'GET', 'favorites?$limit=50'),
        req('Get', 'GET', 'favorites/{{favoriteId}}'),
        req('Create', 'POST', 'favorites', { body: { propertyId: '{{propertyId}}' } }),
        req('Patch', 'PATCH', 'favorites/{{favoriteId}}', { body: {} }),
        req('Remove', 'DELETE', 'favorites/{{favoriteId}}')
      ]
    ),
    folder(
      'User notifications',
      'Create typically **admin/internal**; consumers usually **find/patch**.',
      [
        req('Find', 'GET', 'user-notifications?$limit=50'),
        req('Get', 'GET', 'user-notifications/{{userNotificationId}}'),
        req('Create', 'POST', 'user-notifications', {
          body: {
            userId: '{{userId}}',
            eventKey: 'postman.test',
            category: 'system',
            title: 'Test',
            body: 'Hello from Postman',
            linkUrl: '/dashboard'
          }
        }),
        req('Patch (mark read)', 'PATCH', 'user-notifications/{{userNotificationId}}', {
          body: { readAt: '2026-01-01T12:00:00.000Z' }
        }),
        req('Remove', 'DELETE', 'user-notifications/{{userNotificationId}}')
      ]
    ),
    folder(
      'Mailer',
      '`feathers-mailer` — nodemailer-shaped **create**. Often internal-only in production.',
      [
        req('Create (send)', 'POST', 'mailer', {
          body: {
            from: '"RentFlow" <no-reply@example.com>',
            to: 'you@example.com',
            subject: 'Postman test',
            text: 'Hello',
            html: '<p>Hello</p>'
          },
          headers: jsonPublic,
          noAuth: true
        })
      ]
    ),
    folder(
      'OAuth (optional)',
      'If Google/Facebook OAuth is enabled in config, flows redirect via Feathers OAuth middleware (browser).',
      [
        req('Example — start Google (browser)', 'GET', 'oauth/google', {
          desc: 'Open in browser when OAuth is configured; not a JSON API.',
          headers: [],
          noAuth: true
        }),
        req('Example — start Facebook (browser)', 'GET', 'oauth/facebook', {
          headers: [],
          noAuth: true
        })
      ]
    ),
    folder(
      'Root / static',
      'Koa `serveStatic` — may return files from `public/`.',
      [req('GET /', 'GET', '', { desc: 'Empty path = base URL + /', headers: [], noAuth: true })]
    )
  ]
}

fs.writeFileSync(outPath, JSON.stringify(collection, null, 2), 'utf8')
console.log('Wrote', outPath)
