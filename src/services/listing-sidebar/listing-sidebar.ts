import type { Application } from '../../declarations'

export const listingSidebarPath = 'listing-sidebar'

export type ListingSidebarLink = {
  label: string
  /** Flat string query params suitable for `/listings` URL query */
  query: Record<string, string>
}

const STATIC_POPULAR: ListingSidebarLink[] = [
  { label: 'Apartments for rent', query: { type: 'rent', propertyType: 'Apartment' } },
  { label: 'Villas for rent', query: { type: 'rent', propertyType: 'Villa' } },
  { label: 'Townhouses for rent', query: { type: 'rent', propertyType: 'Townhouse' } },
  { label: 'Penthouses for rent', query: { type: 'rent', propertyType: 'Penthouse' } },
  { label: 'Compounds for rent', query: { type: 'rent', propertyType: 'Villa' } },
  { label: 'Duplexes for rent', query: { type: 'rent', propertyType: 'Duplex' } },
  { label: '1 bedroom properties', query: { type: 'rent', bedsBaths: '1' } },
  { label: '2 bedroom properties', query: { type: 'rent', bedsBaths: '2' } },
  { label: '3 bedroom properties', query: { type: 'rent', bedsBaths: '3' } }
]

const FALLBACK_NEARBY: ListingSidebarLink[] = [
  { label: 'Apartments in Abelenkpe', query: { type: 'rent', propertyType: 'Apartment', location: 'Abelenkpe' } },
  { label: 'Villas in Dansoman', query: { type: 'rent', propertyType: 'Villa', location: 'Dansoman' } },
  { label: 'Penthouses in Achimota', query: { type: 'rent', propertyType: 'Penthouse', location: 'Achimota' } },
  { label: 'Duplexes in Spintex', query: { type: 'rent', propertyType: 'Duplex', location: 'Spintex' } },
  { label: 'Hotel apartments in East Legon', query: { type: 'rent', propertyType: 'Apartment', location: 'East Legon' } }
]

const NEARBY_LABEL_BUILDERS: Array<(place: string) => ListingSidebarLink> = [
  (place) => ({
    label: `Apartments in ${place}`,
    query: { type: 'rent', propertyType: 'Apartment', location: place }
  }),
  (place) => ({
    label: `Villas in ${place}`,
    query: { type: 'rent', propertyType: 'Villa', location: place }
  }),
  (place) => ({
    label: `Penthouses in ${place}`,
    query: { type: 'rent', propertyType: 'Penthouse', location: place }
  }),
  (place) => ({
    label: `Duplexes in ${place}`,
    query: { type: 'rent', propertyType: 'Duplex', location: place }
  }),
  (place) => ({
    label: `Townhouses in ${place}`,
    query: { type: 'rent', propertyType: 'Townhouse', location: place }
  })
]

export class ListingSidebarService {
  constructor(public app: Application) {}

  async find() {
    const popularSearches = STATIC_POPULAR.map((x) => ({ ...x, query: { ...x.query } }))
    let nearbyAreas: ListingSidebarLink[] = []

    try {
      const db = await this.app.get('mongodbClient')
      const rows = await db
        .collection('properties')
        .aggregate<{ _id: string; count: number }>([
          {
            $addFields: {
              placePre: {
                $cond: [
                  {
                    $gt: [{ $strLenCP: { $trim: { input: { $ifNull: ['$area', ''] } } } }, 0]
                  },
                  { $trim: { input: { $ifNull: ['$area', ''] } } },
                  { $trim: { input: { $ifNull: ['$neighborhood', ''] } } }
                ]
              }
            }
          },
          { $match: { placePre: { $nin: ['', null] } } },
          { $group: { _id: '$placePre', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
          { $limit: 10 }
        ])
        .toArray()

      nearbyAreas = rows.map((r, i) => NEARBY_LABEL_BUILDERS[i % NEARBY_LABEL_BUILDERS.length](String(r._id)))
    } catch {
      nearbyAreas = FALLBACK_NEARBY.map((x) => ({ ...x, query: { ...x.query } }))
    }

    if (nearbyAreas.length === 0) {
      nearbyAreas = FALLBACK_NEARBY.map((x) => ({ ...x, query: { ...x.query } }))
    }

    return { popularSearches, nearbyAreas }
  }
}

export const listingSidebar = (app: Application) => {
  app.use(listingSidebarPath, new ListingSidebarService(app) as any, {
    methods: ['find'],
    events: []
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [listingSidebarPath]: ListingSidebarService
  }
}
