import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import type { Application } from '../../declarations'

export type Sms = any
export type SmsData = {
  recipient: string[]
  message: string
  sender?: string
  is_schedule?: boolean
  schedule_date?: string
  sms_type?: 'otp'
}
export type SmsPatch = any
export type SmsQuery = any

export interface SmsServiceOptions {
  app: Application
}

export interface SmsParams extends Params<SmsQuery> {}

export class SmsService<ServiceParams extends SmsParams = SmsParams>
  implements ServiceInterface<Sms, SmsData, ServiceParams, SmsPatch>
{
  constructor(public options: SmsServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Sms[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Sms> {
    return { id }
  }

  async create(data: SmsData, _params?: ServiceParams): Promise<Sms> {
    const key = process.env.MNOTIFY_API_KEY
    if (!key) {
      return { status: 'skipped', reason: 'MNOTIFY_API_KEY not set' }
    }

    const sender = data.sender || process.env.MNOTIFY_SENDER_ID || 'RentFlow'

    const res = await fetch(`https://api.mnotify.com/api/sms/quick?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: data.recipient,
        sender,
        message: data.message,
        is_schedule: data.is_schedule ?? false,
        schedule_date: data.schedule_date ?? '',
        ...(data.sms_type ? { sms_type: data.sms_type } : {})
      })
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { status: 'error', httpStatus: res.status, body: json }
    }
    return json
  }

  async update(_id: NullableId, data: SmsData, params?: ServiceParams): Promise<Sms> {
    return this.create(data, params)
  }

  async patch(id: NullableId, data: SmsPatch, _params?: ServiceParams): Promise<Sms> {
    return { id, ...data }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Sms> {
    return { id, removed: true }
  }
}

export const getOptions = (app: Application) => ({ app })

