import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { resolveEntityFiles } from '../../utils/resolveEntityFiles'

export const propertySchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    landlordId: Type.String(),
    // Listing / details page parity
    listingLabel: Type.Optional(Type.String()), // e.g. "APARTMENT FOR RENT IN ..."
    listingType: Type.Optional(Type.Union([Type.Literal('rent'), Type.Literal('buy'), Type.Literal('commercial'), Type.Literal('new')])),
    title: Type.Optional(Type.String()), // e.g. "Fully Furnished | ..."
    verified: Type.Optional(Type.Boolean()),
    price: Type.Optional(Type.Number()),
    priceCurrency: Type.Optional(Type.String()),
    pricePeriod: Type.Optional(Type.String()), // e.g. "yearly", "monthly"
    estimatedMortgageMonthly: Type.Optional(Type.Number()),
    mortgageCurrency: Type.Optional(Type.String()),

    name: Type.String(),
    address: Type.String(),
    city: Type.String(),
    state: Type.Optional(Type.String()),
    country: Type.String(),
    postalCode: Type.Optional(Type.String()),
    area: Type.Optional(Type.String()), // e.g. "Spintex"
    neighborhood: Type.Optional(Type.String()), // e.g. "Tema"
    buildingName: Type.Optional(Type.String()), // e.g. "Tower 108"
    geo: Type.Optional(
      Type.Object(
        {
          lat: Type.Number(),
          lng: Type.Number()
        },
        { additionalProperties: false }
      )
    ),
    propertyType: Type.String(),
    totalUnits: Type.Optional(Type.Number({ default: 1 })),
    sizeSqft: Type.Optional(Type.Number()),
    sizeSqm: Type.Optional(Type.Number()),
    propertyAgeYears: Type.Optional(Type.Number()),
    bedrooms: Type.Optional(Type.Number()),
    bathrooms: Type.Optional(Type.Number()),
    description: Type.Optional(Type.String()),
    amenities: Type.Optional(Type.Array(Type.String())),
    images: Type.Optional(Type.Array(Type.String())),
    files: Type.Optional(Type.Array(Type.Any())),
    // Computed helpers for details.html gallery
    coverImageUrl: Type.Optional(Type.String()),
    photosCount: Type.Optional(Type.Number()),
    // Optional embed of units for a details page (when requested)
    units: Type.Optional(Type.Array(Type.Any())),
    /** Denormalised from the first active agent-assignment; null when unassigned. */
    agentUserId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    agent: Type.Optional(
      Type.Object(
        {
          name: Type.String(),
          agency: Type.Optional(Type.String()),
          avatarUrl: Type.Optional(Type.String()),
          listingsCount: Type.Optional(Type.Number()),
          responseTimeMinutes: Type.Optional(Type.Number())
        },
        { additionalProperties: false }
      )
    ),
    priceTrendsNote: Type.Optional(Type.String()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'Property', additionalProperties: false }
)

export type Property = Static<typeof propertySchema>
export const propertyValidator = getValidator(propertySchema, dataValidator)
export const propertyResolver = resolve<Property, HookContext>({})
export const propertyExternalResolver = resolve<Property, HookContext>({
  files: async (_value, property, context) => {
    const id = (property as any)?._id?.toString?.() ?? ''
    if (!id) return []
    return await resolveEntityFiles(context.app, 'properties', id)
  },
  coverImageUrl: async (_value, property) => {
    const images = Array.isArray((property as any).images) ? ((property as any).images as string[]) : []
    return images[0]
  },
  photosCount: async (_value, property) => {
    const images = Array.isArray((property as any).images) ? ((property as any).images as string[]) : []
    return images.length
  },
  units: async (_value, property, context) => {
    const includeUnits = (context.params as any)?.$includeUnits === true
    if (!includeUnits) return undefined
    const id = (property as any)?._id?.toString?.() ?? ''
    if (!id) return []
    const res = (await context.app.service('units').find(
      { paginate: false, query: { propertyId: id } } as any,
      { provider: undefined } as any
    )) as any
    return Array.isArray(res) ? res : res?.data || []
  },
  agent: async (_value, property, context) => {
    if ((property as any).agent) return (property as any).agent

    const includeAgent = (context.params as any)?.$includeAgent === true
    if (!includeAgent) return undefined

    // Fast path: agentUserId is now stored directly on the property.
    // Fall back to an agent-assignments lookup for rows written before the migration.
    let agentUserId: string | null | undefined = (property as any).agentUserId
    if (!agentUserId) {
      const propertyId = (property as any)?._id?.toString?.() ?? ''
      if (!propertyId) return undefined
      const assignments = (await context.app.service('agent-assignments').find(
        { paginate: false, query: { propertyId } } as any,
        { provider: undefined } as any
      )) as any
      const list = Array.isArray(assignments) ? assignments : assignments?.data || []
      agentUserId = list[0]?.agentUserId
    }
    if (!agentUserId) return undefined

    // Try agent profile first (full details)
    const profiles = (await context.app.service('agent-profiles').find(
      { paginate: false, query: { userId: agentUserId } } as any,
      { provider: undefined } as any
    )) as any
    const pList = Array.isArray(profiles) ? profiles : profiles?.data || []
    const profile = pList[0]
    if (profile) {
      return {
        name: profile.displayName,
        agency: profile.agency,
        avatarUrl: profile.avatarUrl,
        listingsCount: profile.listingsCount,
        responseTimeMinutes: profile.responseTimeMinutes
      }
    }

    // Fallback: agent exists but has not created a profile yet — use user record
    try {
      const u = (await context.app.service('users').get(
        agentUserId,
        { provider: undefined } as any
      )) as any
      if (!u) return undefined
      return { name: u.email || 'Agent' }
    } catch {
      return undefined
    }
  }
})

export const propertyDataSchema = Type.Object(
  {
    listingLabel: Type.Optional(Type.String()),
    listingType: Type.Optional(Type.Union([Type.Literal('rent'), Type.Literal('buy'), Type.Literal('commercial'), Type.Literal('new')])),
    title: Type.Optional(Type.String()),
    verified: Type.Optional(Type.Boolean()),
    price: Type.Optional(Type.Number()),
    priceCurrency: Type.Optional(Type.String()),
    pricePeriod: Type.Optional(Type.String()),
    estimatedMortgageMonthly: Type.Optional(Type.Number()),
    mortgageCurrency: Type.Optional(Type.String()),

    name: Type.String(),
    address: Type.String(),
    city: Type.String(),
    state: Type.Optional(Type.String()),
    country: Type.String(),
    postalCode: Type.Optional(Type.String()),
    area: Type.Optional(Type.String()),
    neighborhood: Type.Optional(Type.String()),
    buildingName: Type.Optional(Type.String()),
    geo: Type.Optional(
      Type.Object(
        {
          lat: Type.Number(),
          lng: Type.Number()
        },
        { additionalProperties: false }
      )
    ),
    propertyType: Type.String(),
    totalUnits: Type.Optional(Type.Number()),
    sizeSqft: Type.Optional(Type.Number()),
    sizeSqm: Type.Optional(Type.Number()),
    propertyAgeYears: Type.Optional(Type.Number()),
    bedrooms: Type.Optional(Type.Number()),
    bathrooms: Type.Optional(Type.Number()),
    description: Type.Optional(Type.String()),
    amenities: Type.Optional(Type.Array(Type.String())),
    images: Type.Optional(Type.Array(Type.String())),
    agent: Type.Optional(
      Type.Object(
        {
          name: Type.String(),
          agency: Type.Optional(Type.String()),
          avatarUrl: Type.Optional(Type.String()),
          listingsCount: Type.Optional(Type.Number()),
          responseTimeMinutes: Type.Optional(Type.Number())
        },
        { additionalProperties: false }
      )
    ),
    priceTrendsNote: Type.Optional(Type.String())
  },
  { $id: 'PropertyData', additionalProperties: false }
)

export type PropertyData = Static<typeof propertyDataSchema>
export const propertyDataValidator = getValidator(propertyDataSchema, dataValidator)
export const propertyDataResolver = resolve<Property, HookContext>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const propertyPatchSchema = Type.Partial(Type.Omit(propertySchema, ['_id', 'landlordId', 'createdAt']), { $id: 'PropertyPatch' })
export type PropertyPatch = Static<typeof propertyPatchSchema>
export const propertyPatchValidator = getValidator(propertyPatchSchema, dataValidator)
export const propertyPatchResolver = resolve<Property, HookContext>({
  updatedAt: async () => new Date().toISOString()
})

export const propertyQueryProperties = Type.Pick(propertySchema, [
  '_id',
  'landlordId',
  'agentUserId',
  'city',
  'country',
  'propertyType',
  'listingType',
  'verified',
  'area',
  'neighborhood',
  'name',
  'address',
  'state',
  'buildingName',
  'bedrooms',
  'bathrooms',
  'price',
  'pricePeriod',
  'propertyAgeYears',
  'createdAt',
  'updatedAt'
])

const listingVirtualQuery = Type.Object(
  {
    $search: Type.Optional(Type.String()),
    type: Type.Optional(Type.Union([Type.Literal('buy'), Type.Literal('rent'), Type.Literal('commercial'), Type.Literal('new')])),
    superAgent: Type.Optional(Type.Union([Type.Boolean(), Type.String()])),
    /** PM-only: when true, `properties.find` is scoped to assigned properties (portfolio hub). Omit for public catalog. */
    pmPortfolio: Type.Optional(Type.Union([Type.Boolean(), Type.String()])),
    /** Agent-only: when true, `properties.find` is scoped to assigned properties. */
    agentPortfolio: Type.Optional(Type.Union([Type.Boolean(), Type.String()]))
  },
  { additionalProperties: true }
)

export const propertyQuerySchema = Type.Intersect(
  [querySyntax(propertyQueryProperties), listingVirtualQuery, Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type PropertyQuery = Static<typeof propertyQuerySchema>
export const propertyQueryValidator = getValidator(propertyQuerySchema, queryValidator)
export const propertyQueryResolver = resolve<PropertyQuery, HookContext>({})

