import { feathers, HookContext } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import dotenv from 'dotenv'
import { koa, rest, errorHandler, parseAuthentication, cors } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import path from 'path'
import { serveStatic } from '@feathersjs/koa'
import koaBody from 'koa-body'

import type { Application } from './declarations'
import { configurationValidator } from './configuration'
import { mongodb } from './mongodb'
import { authentication } from './authentication'
import { services } from './services'
import { channels } from './channels'
import { logger } from './logger'

const app: Application = koa(feathers())

dotenv.config()

app.configure(configuration(configurationValidator))

app.use(cors())
app.use(serveStatic(path.resolve(app.get('public'))))
app.use(errorHandler())
app.use(parseAuthentication())

app.use(
  koaBody({
    includeUnparsed: true,
    multipart: true,
    formidable: {
      keepExtensions: true,
      multiples: true,
      maxFileSize: 50 * 1024 * 1024,
      uploadDir: path.join(process.cwd(), 'public', 'files', 'upload')
    }
  })
)

// Expose rawBody for webhook signature verification
app.use(async (ctx, next) => {
  const unparsed = (ctx.request as any)?.body?.[Symbol.for('unparsedBody')]
  if (unparsed) {
    ;(ctx.feathers as any).rawBody = unparsed.toString()
  }
  ;(ctx.feathers as any).headers = ctx.request.headers
  await next()
})

app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins') || '*'
    }
  })
)

app.configure(mongodb)
app.configure(authentication)
app.configure(services)
app.configure(channels)

app.hooks({
  error: {
    all: [
      async (context: HookContext) => {
        const err = context.error as Error & { data?: unknown; cause?: unknown }
        const cause = err?.cause instanceof Error ? err.cause.message : err?.cause ? String(err.cause) : ''
        logger.error(
          `${context.path} ${context.method} error: ${err?.message}${cause ? ` (cause: ${cause})` : ''}${err?.stack ? `\n${err.stack}` : ''}`
        )
        return context
      }
    ]
  }
})

export { app }

