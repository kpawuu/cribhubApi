import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

/** Inline union only — do not set `$id` here or Ajv sees duplicate refs when this is embedded in SitePage, SitePageData, and SitePagePatch. */
export const sitePageSectionSchema = Type.Union([
  Type.Literal('legal'),
  Type.Literal('marketing'),
  Type.Literal('blog'),
  Type.Literal('explore'),
  Type.Literal('tools'),
  Type.Literal('footer')
])

export const sitePageStatusSchema = Type.Union([Type.Literal('draft'), Type.Literal('published')])

export const sitePageSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    slug: Type.String({ minLength: 2, maxLength: 160, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }),
    title: Type.String({ minLength: 1, maxLength: 300 }),
    body: Type.String({ minLength: 1, maxLength: 500000 }),
    section: sitePageSectionSchema,
    status: sitePageStatusSchema,
    metaTitle: Type.Optional(Type.String({ maxLength: 200 })),
    metaDescription: Type.Optional(Type.String({ maxLength: 500 })),
    publishedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'SitePage', additionalProperties: false }
)

export type SitePage = Static<typeof sitePageSchema>
export const sitePageValidator = getValidator(sitePageSchema, dataValidator)
export const sitePageResolver = resolve<SitePage, HookContext>({})
export const sitePageExternalResolver = resolve<SitePage, HookContext>({})

export const sitePageDataSchema = Type.Object(
  {
    slug: Type.String({ minLength: 2, maxLength: 160, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }),
    title: Type.String({ minLength: 1, maxLength: 300 }),
    body: Type.String({ minLength: 1, maxLength: 500000 }),
    section: sitePageSectionSchema,
    status: Type.Optional(sitePageStatusSchema),
    metaTitle: Type.Optional(Type.String({ maxLength: 200 })),
    metaDescription: Type.Optional(Type.String({ maxLength: 500 }))
  },
  { $id: 'SitePageData', additionalProperties: false }
)

export type SitePageData = Static<typeof sitePageDataSchema>
export const sitePageDataValidator = getValidator(sitePageDataSchema, dataValidator)
export const sitePageDataResolver = resolve<SitePage, HookContext>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString(),
  status: async (value) => (value ?? 'draft') as any
})

export const sitePagePatchSchema = Type.Partial(
  Type.Omit(sitePageSchema, ['_id', 'slug', 'createdAt']),
  { $id: 'SitePagePatch' }
)
export type SitePagePatch = Static<typeof sitePagePatchSchema>
export const sitePagePatchValidator = getValidator(sitePagePatchSchema, dataValidator)
export const sitePagePatchResolver = resolve<SitePage, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const sitePageQueryProperties = Type.Pick(sitePageSchema, [
  '_id',
  'slug',
  'section',
  'status',
  'title',
  'publishedAt',
  'createdAt',
  /** Allows `$sort` / filters on last edit (admin CMS list). */
  'updatedAt'
])
export const sitePageQuerySchema = Type.Intersect(
  [querySyntax(sitePageQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type SitePageQuery = Static<typeof sitePageQuerySchema>
export const sitePageQueryValidator = getValidator(sitePageQuerySchema, queryValidator)
export const sitePageQueryResolver = resolve<SitePageQuery, HookContext>({})
