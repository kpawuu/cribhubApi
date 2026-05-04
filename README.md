# RentFlow API (FeathersJS + MongoDB)

This API follows the **same FeathersJS structure and auth-management approach** used in `inventorsocial_api_backup`, but tailored for RentFlow / CribHub.

## Setup

### 1) Install

```bash
cd /Users/kpawuu/Documents/apps/rentflow_api
npm install
```

### 2) Environment

Set these variables (or rely on `config/custom-environment-variables.json`):

- **`PORT`**: server port (default `3036`)
- **`HOSTNAME`**: host (default `localhost`)
- **`MONGODB_URL`**: Mongo connection string (default `mongodb://127.0.0.1:27017/rentflow_api`)
- **`FEATHERS_SECRET`**: JWT secret (**required** for production)

### 3) Run

```bash
npm run dev
```

## Authentication

- **`POST /authentication`**: Local login (`strategy=local`, `email`, `password`)
- **`POST /users`**: Signup

## Authentication Management (verification/reset)

Implemented using `feathers-authentication-management` via the `auth-management` service (mirrors `inventorsocial_api_backup`).

### Signup verification flow (current)

On `POST /users`:
- `addVerification('auth-management')` adds verification fields/tokens to the user.
- After create, `users` service triggers a `resendVerifySignup` action through `auth-management`.
- `removeVerification()` removes sensitive verification fields from the external response.

**Note**: The notifier is currently a safe no-op logger (`src/services/auth-management/notifier.ts`). Wire it to an email/SMS provider when ready.

### Common `auth-management` actions

Call:

`POST /auth-management`

with payloads like:

- **Resend signup OTP / verify token**
  - `{ "action": "resendVerifySignup", "value": { "email": "user@example.com" } }`
- **Verify signup**
  - `{ "action": "verifySignupShort", "value": { "user": { "email": "user@example.com" }, "token": "123456" } }`
- **Request password reset**
  - `{ "action": "sendResetPwd", "value": { "email": "user@example.com" } }`
- **Reset password (short token)**
  - `{ "action": "resetPwdShort", "value": { "user": { "email": "user@example.com" }, "token": "123456", "password": "new-password" } }`

(These are the standard `feathers-authentication-management` actions; you can keep parity with the flows already used in `inventorsocial_api_backup`.)

## Roles

### Default on signup (`POST /users`)

- Every new user receives the **tenant** role immediately via the `user-roles` service (`ensureDefaultTenantRole` in `src/services/users/users.ts`).
- `isOnboarded` starts as `false` until the client marks onboarding complete (see user patch / product flows).

### Optional `requestedRole` on `POST /users`

- **Shape:** optional field on the create payload, one of `tenant` | `landlord` | `property_manager` | `agent` (see `userDataSchema` in `src/services/users/users.schema.ts`).
- **Behavior:** if `requestedRole` is **omitted** or **`tenant`**, no extra row is created (the user already has tenant).
- If `requestedRole` is **`landlord`**, **`agent`**, or **`property_manager`**, the API creates a **`role-requests`** document with `status: 'pending'`. The role is **not** granted on `user-roles` until an admin (or your approval flow) accepts the request.
- **CribHub UI:** the primary client no longer sends `requestedRole` at signup; users choose non-tenant roles during in-app onboarding, which also creates pending `role-requests`. The field remains supported for **legacy clients**, **mobile**, **Postman**, or **server-to-server** signup if you need the same behavior without the onboarding UI.

### Related client behavior (CribHub)

- Session onboarding helpers may store `roleRequestId` / redirect hints in `sessionStorage`; the app clears those on **logout** so a different user on the same browser does not inherit state.

