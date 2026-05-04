import type { Application } from '../../declarations'
import { SmsService, getOptions } from './sms.class'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { requireRole } from '../../hooks/require-role'

export const smsPath = 'sms'
export const smsMethods: Array<keyof SmsService> = ['create']

export const sms = (app: Application) => {
  app.use(smsPath, new SmsService(getOptions(app)), {
    methods: smsMethods as any,
    events: []
  })

  app.service(smsPath).hooks({
    before: {
      create: [authenticateIfExternal('jwt'), requireRole('admin', 'landlord', 'property_manager')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [smsPath]: SmsService
  }
}

