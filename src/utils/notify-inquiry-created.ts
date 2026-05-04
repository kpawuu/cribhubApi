import type { Application } from '../declarations'
import emailMessage from './emailMessage'

const smtpConfigured = () =>
  Boolean(process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD)

const emailFrom = () => {
  const appName = process.env.APP_NAME || 'RentFlow'
  return `"${appName}" <${process.env.MAIL_SENT_FROM || process.env.MAIL_USERNAME || 'no-reply@localhost'}>`
}

const normalizePhone = (p?: string) => {
  if (!p || typeof p !== 'string') return ''
  const digits = p.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0') && digits.length === 10) return `233${digits.slice(1)}`
  if (digits.length >= 9) return digits
  return ''
}

/**
 * After an inquiry is created, notify landlord (and assigned agent) by email;
 * optional SMS via existing `sms` service when MNOTIFY_API_KEY is set.
 * Failures are logged and never thrown (create must succeed).
 */
export async function notifyInquiryCreated(app: Application, inquiry: Record<string, any>): Promise<void> {
  const landlordId = inquiry?.landlordId
  const propertyId = inquiry?.propertyId
  const agentUserId = inquiry?.agentUserId

  let propertyName = ''
  try {
    if (propertyId) {
      const prop = await app.service('properties').get(propertyId, { provider: undefined } as any)
      propertyName = (prop as any)?.name || (prop as any)?.title || String(propertyId)
    }
  } catch {
    // ignore
  }

  const leadBits = [
    inquiry?.name ? `<b>Name:</b> ${inquiry.name}` : '',
    inquiry?.email ? `<b>Email:</b> ${inquiry.email}` : '',
    inquiry?.phone ? `<b>Phone:</b> ${inquiry.phone}` : '',
    inquiry?.contactMethod ? `<b>Preferred contact:</b> ${inquiry.contactMethod}` : '',
    inquiry?.message ? `<p><b>Message</b></p><p>${String(inquiry.message).replace(/</g, '&lt;')}</p>` : ''
  ]
    .filter(Boolean)
    .join('<br/>')

  const bodyIntro = `A new property inquiry was submitted for <b>${propertyName || 'your listing'}</b>.`
  const htmlBase = `${bodyIntro}<br/><br/>${leadBits}`

  const sendEmail = async (to: string, subject: string, html: string) => {
    if (!smtpConfigured() || !to) return
    await app.service('mailer').create(
      {
        from: emailFrom(),
        to,
        subject,
        html
      },
      { provider: undefined } as any
    )
  }

  const sendSms = async (phone: string, message: string) => {
    const n = normalizePhone(phone)
    if (!n || !process.env.MNOTIFY_API_KEY) return
    try {
      await app.service('sms').create({ recipient: [n], message }, { provider: undefined } as any)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[inquiries] SMS notify failed', e)
    }
  }

  try {
    let landlordEmail = ''
    let landlordPhone = ''
    if (landlordId) {
      try {
        const lu = await app.service('users').get(landlordId, { provider: undefined } as any)
        landlordEmail = (lu as any)?.email || ''
        landlordPhone = (lu as any)?.phone || ''
      } catch {
        // ignore
      }
    }

    const appName = process.env.APP_NAME || 'RentFlow'
    const dashboardUrl = process.env.APP_URL ? `${process.env.APP_URL.replace(/\/$/, '')}/inquiries` : undefined

    if (landlordEmail) {
      const msg = `${htmlBase}<br/><br/>You can review and update the lead status in ${appName}.`
      await sendEmail(landlordEmail, `${appName}: new inquiry`, await emailMessage(msg, dashboardUrl))
    }
    if (landlordPhone) {
      await sendSms(
        landlordPhone,
        `${appName}: New inquiry for ${propertyName || 'your property'}. Check your email or dashboard.`
      )
    }

    if (agentUserId && agentUserId !== landlordId) {
      let agentEmail = ''
      let agentPhone = ''
      try {
        const au = await app.service('users').get(agentUserId, { provider: undefined } as any)
        agentEmail = (au as any)?.email || ''
        agentPhone = (au as any)?.phone || ''
      } catch {
        // ignore
      }
      if (agentEmail) {
        const msg = `${htmlBase}<br/><br/>This lead is routed to you as the assigned agent.`
        await sendEmail(agentEmail, `${appName}: new inquiry (assigned)`, await emailMessage(msg, dashboardUrl))
      }
      if (agentPhone) {
        await sendSms(agentPhone, `${appName}: New assigned inquiry — ${propertyName || 'property'}.`)
      }
    }

    if (!landlordEmail && !agentUserId) {
      // eslint-disable-next-line no-console
      console.log('[inquiries] Notify skipped: no landlord email / agent', { landlordId, agentUserId })
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[inquiries] notifyInquiryCreated failed', e)
  }
}
