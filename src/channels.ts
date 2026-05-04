// For more information about this file see https://dove.feathersjs.com/guides/cli/channels.html
import type { Application } from './declarations'

const SKIP_PUBLISH = new Set([
  'authentication',
  'paystack-webhook',
  'mailer',
  'auth-management',
  'delete-account',
  'dashboard',
  'ai'
])

/**
 * Wire Socket.IO publishers so clients receive CRUD events (realtime Pinia).
 * NOTE: Broadcasting most services to every authenticated socket is convenient for demos;
 * production apps should publish per-user or per-organization channels to avoid leaking payloads.
 */
function publishServiceEvents(application: Application) {
  const services = (application as any).services as Record<string, any>
  if (!services) return

  for (const path of Object.keys(services)) {
    if (SKIP_PUBLISH.has(path)) continue
    const service = services[path]
    if (!service || typeof service.publish !== 'function') continue

    const publisher = () => {
      if (path === 'properties' || path === 'site-pages') {
        return application.channel('anonymous', 'authenticated')
      }
      return application.channel('authenticated')
    }

    for (const event of ['created', 'updated', 'patched', 'removed'] as const) {
      try {
        service.publish(event, publisher)
      } catch {
        // ignore services that do not support this event
      }
    }
  }
}

export const channels = (app: Application) => {
  app.on('connection', (connection) => {
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult: any, { connection }: any) => {
    if (connection) {
      app.channel('anonymous').leave(connection)
      app.channel('authenticated').join(connection)
    }
  })

  publishServiceEvents(app)
}

