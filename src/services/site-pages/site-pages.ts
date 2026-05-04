import { hooks as schemaHooks } from '@feathersjs/schema'
import { errors } from '@feathersjs/errors'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { authenticateIfJwtPresent } from '../../hooks/authenticate-if-jwt-present'
import { requireRole } from '../../hooks/require-role'
import { populateRoles } from '../../hooks/populate-roles'
import { mergeQuery } from '../../hooks/merge-query'

import { SitePagesService, getOptions } from './site-pages.class'
import {
  sitePageResolver,
  sitePageExternalResolver,
  sitePageDataValidator,
  sitePageDataResolver,
  sitePagePatchValidator,
  sitePagePatchResolver,
  sitePageQueryValidator,
  sitePageQueryResolver
} from './site-pages.schema'

export const sitePagesPath = 'site-pages'
export const sitePagesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

const populateRolesIfAuthed = async (context: HookContext) => {
  const user = context.params.user as any
  if (!user?._id) return context
  return await populateRoles(context)
}

/** Non-admins only ever see published pages (external traffic). */
const mergePublishedForNonAdmin = async (context: HookContext) => {
  if (!context.params.provider) return context
  const roles: string[] = Array.isArray((context.params.user as any)?.roles)
    ? ((context.params.user as any).roles as string[])
    : []
  if (roles.includes('admin')) return context
  mergeQuery(context, { status: 'published' })
  return context
}

const ensurePublishedAtWhenPublished = async (context: HookContext) => {
  const d = context.data as any
  if (d?.status === 'published' && !d.publishedAt) {
    d.publishedAt = new Date().toISOString()
  }
  return context
}

const hideUnpublishedFromExternalGet = async (context: HookContext) => {
  if (!context.params.provider) return context
  const roles: string[] = Array.isArray((context.params.user as any)?.roles)
    ? ((context.params.user as any).roles as string[])
    : []
  if (roles.includes('admin')) return context
  const r = context.result as any
  if (r && r.status !== 'published') {
    throw new errors.NotFound('Page not found')
  }
  return context
}

const DEFAULT_SITE_PAGES: Array<{
  slug: string
  title: string
  section: 'legal' | 'marketing' | 'blog' | 'explore' | 'tools' | 'footer'
  status: 'draft' | 'published'
  body: string
  metaTitle?: string
  metaDescription?: string
}> = [
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    section: 'legal',
    status: 'published',
    metaTitle: 'Terms of Service — CribHub',
    metaDescription: 'Terms governing use of CribHub.',
    body: '# Terms of Service\n\n**Placeholder content.** Admins should replace this with the final legal text in the CMS (Dashboard → Site pages).\n\n- Acceptance of terms\n- Use of the platform\n- Limitation of liability\n- Contact for legal notices\n'
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    section: 'legal',
    status: 'published',
    metaTitle: 'Privacy Policy — CribHub',
    metaDescription: 'How CribHub collects and uses personal data.',
    body: '# Privacy Policy\n\n**Placeholder content.** Describe data collection, cookies, retention, and user rights. Replace via admin CMS.\n'
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    section: 'legal',
    status: 'published',
    metaTitle: 'Cookie Policy — CribHub',
    metaDescription: 'Information about cookies on CribHub.',
    body: '# Cookie Policy\n\n**Placeholder content.** List essential vs analytics cookies and consent controls.\n'
  },
  {
    slug: 'about-us',
    title: 'About Us',
    section: 'marketing',
    status: 'published',
    metaTitle: 'About CribHub',
    metaDescription: 'Learn about CribHub and our mission.',
    body: '# About CribHub\n\n**Placeholder.** Add your company story, mission, and team overview here through the admin CMS.\n'
  },
  {
    slug: 'contact',
    title: 'Contact',
    section: 'marketing',
    status: 'published',
    metaTitle: 'Contact — CribHub',
    metaDescription: 'Get in touch with CribHub.',
    body: '# Contact\n\n**Placeholder.** Add support email, phone, office address, and business hours. Admins can edit this page anytime.\n'
  },
  {
    slug: 'price-calculator',
    title: 'Price Calculator',
    section: 'tools',
    status: 'published',
    body: '# Rent affordability calculator\n\nUse the calculator on this page (below the intro) to estimate monthly affordability. **This introduction is editable by admins.**\n\n> Tip: adjust assumptions for taxes and insurance in your region.\n'
  },
  {
    slug: 'market-trends',
    title: 'Market Trends',
    section: 'tools',
    status: 'published',
    body: '# Market trends\n\n**Placeholder.** Summarize how you source trend data (listings volume, median rent, time-on-market). Link to live dashboards or embed charts as you expand the product.\n'
  },
  {
    slug: 'valuation',
    title: 'Property Valuation',
    section: 'tools',
    status: 'published',
    body: '# Valuation overview\n\n**Placeholder.** Explain how users can request or interpret valuations. Connect to your operations workflow in a future iteration.\n'
  },
  {
    slug: 'neighborhoods',
    title: 'Neighborhoods',
    section: 'explore',
    status: 'published',
    body: '# Explore neighborhoods\n\n**Placeholder.** Curate area guides and link to filtered searches (e.g. East Legon, Cantonments). Admins maintain this copy.\n'
  },
  {
    slug: 'virtual-tours',
    title: 'Virtual Tours',
    section: 'explore',
    status: 'published',
    body: '# Virtual tours\n\n**Placeholder.** Describe how virtual tours work on CribHub and highlight listings that support 360° or video tours.\n'
  },
  {
    slug: 'welcome-to-the-cribhub-blog',
    title: 'Welcome to the CribHub blog',
    section: 'blog',
    status: 'published',
    body: '# Welcome\n\nThis is your first **blog post** placeholder. Admins can publish new articles from **Dashboard → Site pages** (section: blog).\n\n## What you can write about\n\n- Market insights\n- Moving tips\n- Landlord and tenant guides\n'
  }
]

async function ensureIndexesAndSeed(app: Application) {
  const db = await app.get('mongodbClient')
  const col = db.collection('site_pages')
  try {
    await col.createIndex({ slug: 1 }, { unique: true })
    await col.createIndex({ section: 1, status: 1, publishedAt: -1 })
    await col.createIndex({ status: 1, publishedAt: -1 })
  } catch (e) {
    console.error('[site-pages] index creation failed:', e)
  }

  const n = await col.countDocuments({})
  if (n > 0) return

  const now = new Date().toISOString()
  const docs = DEFAULT_SITE_PAGES.map((p) => ({
    ...p,
    publishedAt: p.status === 'published' ? now : undefined,
    createdAt: now,
    updatedAt: now
  }))
  try {
    await col.insertMany(docs as any[])
    console.info(`[site-pages] seeded ${docs.length} default pages`)
  } catch (e) {
    console.error('[site-pages] seed failed:', e)
  }
}

export const sitePages = (app: Application) => {
  app.use(sitePagesPath, new SitePagesService(getOptions(app)), {
    methods: sitePagesMethods as any,
    events: []
  })

  app.service(sitePagesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(sitePageExternalResolver), schemaHooks.resolveResult(sitePageResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(sitePageQueryValidator), schemaHooks.resolveQuery(sitePageQueryResolver)],
      find: [authenticateIfJwtPresent(), populateRolesIfAuthed, mergePublishedForNonAdmin],
      get: [authenticateIfJwtPresent(), populateRolesIfAuthed],
      create: [
        authenticateIfExternal('jwt'),
        populateRolesIfAuthed,
        requireRole('admin'),
        schemaHooks.validateData(sitePageDataValidator),
        schemaHooks.resolveData(sitePageDataResolver),
        ensurePublishedAtWhenPublished
      ],
      patch: [
        authenticateIfExternal('jwt'),
        populateRolesIfAuthed,
        requireRole('admin'),
        schemaHooks.validateData(sitePagePatchValidator),
        schemaHooks.resolveData(sitePagePatchResolver),
        ensurePublishedAtWhenPublished
      ],
      remove: [authenticateIfExternal('jwt'), populateRolesIfAuthed, requireRole('admin')]
    },
    after: {
      get: [hideUnpublishedFromExternalGet]
    }
  })

  void ensureIndexesAndSeed(app)
}

declare module '../../declarations' {
  interface ServiceTypes {
    [sitePagesPath]: SitePagesService
  }
}
