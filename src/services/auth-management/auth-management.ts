import type { Application } from '../../declarations'
import { AuthenticationManagementService } from 'feathers-authentication-management'
import { authNotifier } from './notifier'

export const authManagementPath = 'auth-management'

export const authManagement = (app: Application) => {
  const options = {
    service: 'users',
    notifier: authNotifier(app),
    longTokenLen: 15,
    shortTokenLen: 6,
    shortTokenDigits: true,
    delay: 5 * 24 * 60 * 60 * 1000, // 5 days
    resetDelay: 2 * 60 * 60 * 1000, // 2 hours
    resetAttempts: 3
  }

  app.use(authManagementPath, new (AuthenticationManagementService as any)(app, options))

  // Keep parity with inventorsocial: no special hooks required here for now.
}

declare module '../../declarations' {
  interface ServiceTypes {
    [authManagementPath]: any
  }
}

