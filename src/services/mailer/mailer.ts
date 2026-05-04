import type { Application } from '../../declarations'
import Mail from 'feathers-mailer'

export const mailerPath = 'mailer'

export const mailer = (app: Application) => {
  const port = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : undefined
  const secure = (process.env.MAIL_SECURE ?? 'true') === 'true'

  const transporter = {
    host: `${process.env.MAIL_HOST}`,
    port,
    secure,
    requireTLS: true,
    auth: {
      user: `${process.env.MAIL_USERNAME}`,
      pass: `${process.env.MAIL_PASSWORD}`
    }
  }

  app.use(mailerPath, new (Mail as any)(transporter))
}

declare module '../../declarations' {
  interface ServiceTypes {
    [mailerPath]: any
  }
}

