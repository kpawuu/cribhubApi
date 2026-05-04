/**
 * Wipes listing-related collections and inserts realistic Ghana-area properties + vacant units.
 * Each property gets PROPERTY_IMAGES_COUNT (5) distinct image URLs; each unit gets the same count.
 * Images use Unsplash (images.unsplash.com) — interiors / rooms from the real-estate-interior corpus
 * (see https://unsplash.com/s/photos/real-estate-interior ) plus verified interior-design results.
 * Each seed slot uses a unique URL string (`cb` cache-bust) while rotating the same photo pool. At least 50 properties total.
 *
 * Usage (from rentflow_api):
 *   npx ts-node scripts/seed-properties.ts
 *
 * Requires MONGODB_URL in .env (or process.env). Uses first user with role `landlord`
 * as owner; if none exists, uses the first user in `users` and logs a warning.
 */

import 'dotenv/config'
import type { Db, Document } from 'mongodb'
import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rentflow_api'

/**
 * Unsplash photo slugs (`photo-{slug}` path segment only, without `photo-` prefix).
 * Verified HTTP 200 as `https://images.unsplash.com/photo-{slug}?auto=format&fit=crop&w=1600&q=80`.
 * Sourced from https://unsplash.com/s/photos/real-estate-interior and interior-design results.
 */
const UNSPLASH_REAL_ESTATE_INTERIOR_PHOTO_SLUGS = [
  '1560448204-e02f11c3d0e2',
  '1593696140826-c58b021acf8b',
  '1503174971373-b1f69850bded',
  '1560185127-6ed189bf02f4',
  '1554995207-c18c203602cb',
  '1560185007-cde436f6a4d0',
  '1516455590571-18256e5bb9ff',
  '1560185009-dddeb820c7b7',
  '1505691938895-1758d7feb511',
  '1635108197198-63277d473c68',
  '1601086540476-7d9fa9dd6023',
  '1522708323590-d24dbb6b0267',
  '1484154218962-a197022b5858',
  '1502672260266-1c1ef2d93688',
  '1600596542815-ffad4c1539a9',
  '1600585154340-be6161a56a0c',
  '1600607687939-ce8a6c25118c',
  '1600566753190-17f0baa2a6c3',
  '1618221195710-dd6b41faaea6',
  '1616594039964-ae9021a400a0',
  '1615529182904-14819c35db37',
  '1617806118233-18e1de247200',
  '1618773928121-c32242e63f39',
  '1556911220-e15b29be8c8f',
  '1600210492486-724fe5c67fb0',
  '1600607687920-4e2a09cf159d',
  '1519710164239-da123dc03ef4',
  '1570129477492-45c003edd2be',
  '1679105796578-aa48a4d7dea3',
  '1679105796568-6ff0b24670a5',
  '1635108198418-584af95a2b6f',
  '1635108199650-8115b597e283',
  '1586023492125-27b2c045efd7',
  '1618220179428-22790b461013',
  '1606744837616-56c9a5c6a6eb',
  '1616046229478-9901c5536a45',
  '1564078516393-cf04bd966897',
  '1606744824163-985d376605aa',
  '1583847268964-b28dc8f51f92',
  '1567016376408-0226e4d0c1ea',
  '1606744888344-493238951221',
  '1618219908412-a29a1bb7b86e',
] as const

const UNSPLASH_IMAGE_BASE_PARAMS = 'auto=format&fit=crop&w=1600&q=80'

/** 120 gallery URLs: rotate Unsplash interiors; `cb` keeps each string unique for seed rotation logic. */
const SEED_PROPERTY_IMAGE_URLS: string[] = Array.from({ length: 120 }, (_, i) => {
  const slug = UNSPLASH_REAL_ESTATE_INTERIOR_PHOTO_SLUGS[i % UNSPLASH_REAL_ESTATE_INTERIOR_PHOTO_SLUGS.length]
  return `https://images.unsplash.com/photo-${slug}?${UNSPLASH_IMAGE_BASE_PARAMS}&cb=${i}`
})

/** Each property document gets this many distinct image URLs in `images`. */
const PROPERTY_IMAGES_COUNT = 5
/** Each unit document gets the same count for listing galleries. */
const UNIT_IMAGES_COUNT = 5

/**
 * Exactly `PROPERTY_IMAGES_COUNT` unique images per property, rotated by index so listings differ.
 */
function propertyGalleryImages(propertyIndex: number): string[] {
  const n = SEED_PROPERTY_IMAGE_URLS.length
  if (PROPERTY_IMAGES_COUNT > n) {
    throw new Error(`Extend SEED_PROPERTY_IMAGE_URLS: need at least ${PROPERTY_IMAGES_COUNT} URLs, have ${n}`)
  }
  const start = (propertyIndex * 17) % n
  const urls = Array.from({ length: PROPERTY_IMAGES_COUNT }, (_, i) => SEED_PROPERTY_IMAGE_URLS[(start + i) % n])
  if (new Set(urls).size !== urls.length) {
    throw new Error('propertyGalleryImages produced duplicates')
  }
  return urls
}

/** Unit gallery: distinct URLs, offset from property + unit label so it is not identical to the property set. */
function unitGalleryImages(propertyIndex: number, unitLabel: string): string[] {
  const n = SEED_PROPERTY_IMAGE_URLS.length
  if (UNIT_IMAGES_COUNT > n) throw new Error(`Extend SEED_PROPERTY_IMAGE_URLS: need at least ${UNIT_IMAGES_COUNT} URLs`)
  const labelSum = [...unitLabel].reduce((a, c) => a + c.charCodeAt(0), 0)
  const start = (propertyIndex * 23 + labelSum) % n
  const urls = Array.from({ length: UNIT_IMAGES_COUNT }, (_, i) => SEED_PROPERTY_IMAGE_URLS[(start + i) % n])
  if (new Set(urls).size !== urls.length) {
    throw new Error('unitGalleryImages produced duplicates')
  }
  return urls
}

const now = () => new Date().toISOString()

type SeedProperty = {
  name: string
  listingLabel: string
  title: string
  address: string
  city: string
  area: string
  neighborhood: string
  buildingName?: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  description: string
  amenities: string[]
  price: number
  priceCurrency: string
  pricePeriod: string
  verified: boolean
  sizeSqft: number
  propertyAgeYears: number
  geo: { lat: number; lng: number }
  units: { unitNumber: string; bedrooms: number; bathrooms: number; rentAmount: number; listingType: 'rental' | 'sale'; salePrice?: number }[]
}

const HAND_PICKED_PROPERTIES: SeedProperty[] = [
  {
    name: 'The Aster — Cantonments',
    listingLabel: 'LUXURY APARTMENT FOR RENT IN CANTONMENTS',
    title: 'Furnished 3-bed | Generator backup | Pool & gym',
    address: '15 Ridge Road, near Ghana International School',
    city: 'Accra',
    area: 'Cantonments',
    neighborhood: 'Cantonments',
    buildingName: 'The Aster',
    propertyType: 'Apartment',
    bedrooms: 3,
    bathrooms: 3,
    description:
      'Corner unit with wraparound balcony, imported fittings, and 24-hour security. Walking distance to supermarkets and embassies. Ideal for diplomats and senior executives.',
    amenities: ['Swimming pool', 'Gym', 'Backup generator', 'Elevator', 'Covered parking', '24h security'],
    price: 18500,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 1680,
    propertyAgeYears: 4,
    geo: { lat: 5.556, lng: -0.171 },
    units: [
      { unitNumber: 'A4', bedrooms: 3, bathrooms: 3, rentAmount: 18500, listingType: 'rental' },
      { unitNumber: 'B2', bedrooms: 2, bathrooms: 2, rentAmount: 14200, listingType: 'rental' }
    ]
  },
  {
    name: 'Green Court Residences — East Legon',
    listingLabel: 'TOWNHOUSE FOR RENT IN EAST LEGON',
    title: 'Quiet compound | Solar water | Family-sized kitchen',
    address: 'Boundary Road, close to A&C Mall',
    city: 'Accra',
    area: 'East Legon',
    neighborhood: 'East Legon',
    buildingName: 'Green Court',
    propertyType: 'Townhouse',
    bedrooms: 4,
    bathrooms: 4,
    description:
      'Gated community of eight townhouses. High ceilings, terrazzo floors, and a private rooftop terrace. Pet-friendly subject to deposit.',
    amenities: ['Gated community', 'Rooftop terrace', 'Solar hot water', 'Staff quarters', 'Two car ports'],
    price: 22000,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 2450,
    propertyAgeYears: 6,
    geo: { lat: 5.65, lng: -0.166 },
    units: [
      { unitNumber: 'TH-3', bedrooms: 4, bathrooms: 4, rentAmount: 22000, listingType: 'rental' },
      { unitNumber: 'TH-5', bedrooms: 3, bathrooms: 3, rentAmount: 17800, listingType: 'rental' }
    ]
  },
  {
    name: 'Labone Heights',
    listingLabel: 'APARTMENT FOR RENT IN LABONE',
    title: 'City views | Walk to Labadi Beach',
    address: 'Labone Crescent, 400m from Labadi Beach Hotel',
    city: 'Accra',
    area: 'Labone',
    neighborhood: 'Labone',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    description:
      'Bright open-plan living with floor-to-ceiling glazing. Newly repainted; fibre internet pre-wired. Popular with young professionals.',
    amenities: ['Sea breeze orientation', 'Fibre-ready', 'Visitor parking', 'CCTV'],
    price: 9800,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 1120,
    propertyAgeYears: 11,
    geo: { lat: 5.555, lng: -0.168 },
    units: [{ unitNumber: '7F', bedrooms: 2, bathrooms: 2, rentAmount: 9800, listingType: 'rental' }]
  },
  {
    name: 'Oxford Lofts — Osu',
    listingLabel: 'STUDIO & 1-BED LOFTS IN OSU',
    title: 'Oxford Street walk-up | Retail on ground floor',
    address: 'Oxford Street, above independent cafés',
    city: 'Accra',
    area: 'Osu',
    neighborhood: 'Osu',
    buildingName: 'Oxford Lofts',
    propertyType: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    description:
      'Compact urban lofts above retail. Nightlife and restaurants at your doorstep. Best suited for singles or couples without cars.',
    amenities: ['Walk-up', 'Ground-floor retail', 'Shared laundry'],
    price: 5200,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: false,
    sizeSqft: 540,
    propertyAgeYears: 18,
    geo: { lat: 5.557, lng: -0.175 },
    units: [
      { unitNumber: 'L-12', bedrooms: 1, bathrooms: 1, rentAmount: 5200, listingType: 'rental' },
      { unitNumber: 'L-14', bedrooms: 1, bathrooms: 1, rentAmount: 4950, listingType: 'rental' }
    ]
  },
  {
    name: 'Nyane Close — Airport Residential',
    listingLabel: 'VILLA FOR SALE — AIRPORT RESIDENTIAL',
    title: 'Mortgage-eligible | Corner plot | 5 bedrooms',
    address: 'Nyane Close, off Airport Bypass',
    city: 'Accra',
    area: 'Airport Residential',
    neighborhood: 'Airport Residential Area',
    propertyType: 'Villa',
    bedrooms: 5,
    bathrooms: 5,
    description:
      'Standalone villa on a corner plot with mature garden and boys quarters. Title reviewed; mortgage partner packages available on request.',
    amenities: ['Corner plot', 'BQ', 'Electric fence', 'Borehole', 'Two kitchens'],
    price: 2850000,
    priceCurrency: 'GHS',
    pricePeriod: 'sale',
    verified: true,
    sizeSqft: 4200,
    propertyAgeYears: 9,
    geo: { lat: 5.614, lng: -0.178 },
    units: [
      {
        unitNumber: 'V-1',
        bedrooms: 5,
        bathrooms: 5,
        rentAmount: 0,
        listingType: 'sale',
        salePrice: 2850000
      }
    ]
  },
  {
    name: 'Lakeside Court — Tema Community 22',
    listingLabel: 'FAMILY HOME FOR RENT — TEMA C22',
    title: 'Lake views | Gated estate | Schools nearby',
    address: 'Community 22, Lakeside cluster',
    city: 'Tema',
    area: 'Tema',
    neighborhood: 'Community 22',
    propertyType: 'House',
    bedrooms: 4,
    bathrooms: 3,
    description:
      'Two-storey family home in a planned estate with lake walkways. 15 minutes to Tema Harbour; good for port-industry families.',
    amenities: ['Estate security', 'Playground', 'Lake walkway', 'Paved roads'],
    price: 11000,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 2100,
    propertyAgeYears: 5,
    geo: { lat: 5.694, lng: -0.018 },
    units: [{ unitNumber: 'H-08', bedrooms: 4, bathrooms: 3, rentAmount: 11000, listingType: 'rental' }]
  },
  {
    name: 'Manet Grove — Spintex',
    listingLabel: 'DUPLEX FOR RENT — SPINTEX',
    title: 'Near Manet Junction | Easy airport access',
    address: 'Spintex Road, 800m past Manet Junction',
    city: 'Accra',
    area: 'Spintex',
    neighborhood: 'Manet Junction',
    propertyType: 'Duplex',
    bedrooms: 4,
    bathrooms: 4,
    description:
      'Side-by-side duplex units with separate meters. Popular with extended families; AC in all bedrooms.',
    amenities: ['Split AC', 'Separate ECG meter', 'Water storage', 'Balcony'],
    price: 13500,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 1980,
    propertyAgeYears: 7,
    geo: { lat: 5.636, lng: -0.134 },
    units: [
      { unitNumber: 'D-East', bedrooms: 4, bathrooms: 4, rentAmount: 13500, listingType: 'rental' },
      { unitNumber: 'D-West', bedrooms: 4, bathrooms: 4, rentAmount: 13200, listingType: 'rental' }
    ]
  },
  {
    name: 'Dzorwulu Executive Suites',
    listingLabel: 'SERVICED APARTMENT — DZORWULU',
    title: 'Weekly housekeeping | Backup water',
    address: 'Dzorwulu, near Paloma Hotel',
    city: 'Accra',
    area: 'Dzorwulu',
    neighborhood: 'Dzorwulu',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    description:
      'Serviced block with reception and housekeeping twice weekly. Corporate leases welcome; VAT invoices available.',
    amenities: ['Housekeeping', 'Reception', 'Backup water', 'Meeting room'],
    price: 12500,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 1180,
    propertyAgeYears: 3,
    geo: { lat: 5.593, lng: -0.19 },
    units: [{ unitNumber: 'S-402', bedrooms: 2, bathrooms: 2, rentAmount: 12500, listingType: 'rental' }]
  },
  {
    name: 'Roman Ridge Terraces',
    listingLabel: 'TERRACED TOWNHOUSE — ROMAN RIDGE',
    title: 'Olusegun Obasanjo Way | Quiet cul-de-sac',
    address: 'Roman Ridge, off Obasanjo Way',
    city: 'Accra',
    area: 'Roman Ridge',
    neighborhood: 'Roman Ridge',
    propertyType: 'Townhouse',
    bedrooms: 3,
    bathrooms: 3,
    description:
      'Three-level terrace with study nook and small garden. Neighbours are mostly owner-occupiers; strong residents association.',
    amenities: ['Cul-de-sac', 'Residents association', 'Garden', 'Study'],
    price: 16200,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 1760,
    propertyAgeYears: 8,
    geo: { lat: 5.57, lng: -0.185 },
    units: [{ unitNumber: 'T-2', bedrooms: 3, bathrooms: 3, rentAmount: 16200, listingType: 'rental' }]
  },
  {
    name: 'Adabraka City Studios',
    listingLabel: 'STUDIO APARTMENTS — ADABRAKA',
    title: 'Kojo Thompson Road | Budget-friendly',
    address: 'Kojo Thompson Road, above pharmacy',
    city: 'Accra',
    area: 'Adabraka',
    neighborhood: 'Adabraka',
    propertyType: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    description:
      'Micro-studios for students and early-career tenants. Shared rooftop drying area; no elevator (walk-up).',
    amenities: ['Walk-up', 'Shared rooftop', 'Prepaid meter'],
    price: 2800,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: false,
    sizeSqft: 380,
    propertyAgeYears: 22,
    geo: { lat: 5.564, lng: -0.201 },
    units: [
      { unitNumber: 'R-1', bedrooms: 1, bathrooms: 1, rentAmount: 2800, listingType: 'rental' },
      { unitNumber: 'R-2', bedrooms: 1, bathrooms: 1, rentAmount: 2650, listingType: 'rental' },
      { unitNumber: 'R-3', bedrooms: 1, bathrooms: 1, rentAmount: 2550, listingType: 'rental' }
    ]
  },
  {
    name: 'Ministries Annex — Office Floor',
    listingLabel: 'COMMERCIAL OFFICE SPACE — ACCRA CENTRAL',
    title: 'Open-plan floor | Ministries district',
    address: 'Independence Avenue service road',
    city: 'Accra',
    area: 'Accra Central',
    neighborhood: 'Ministries',
    propertyType: 'Office',
    bedrooms: 0,
    bathrooms: 2,
    description:
      'Fourth-floor open plan suitable for NGO or consultancy. Natural light on two sides; shared lift and reception.',
    amenities: ['Open plan', 'Shared lift', 'Kitchenette', 'WC cluster'],
    price: 28000,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 2400,
    propertyAgeYears: 15,
    geo: { lat: 5.548, lng: -0.206 },
    units: [{ unitNumber: 'OF-4A', bedrooms: 0, bathrooms: 2, rentAmount: 28000, listingType: 'rental' }]
  },
  {
    name: 'Ahodwo Pine Villas — Kumasi',
    listingLabel: 'VILLA FOR RENT — AHODWO',
    title: 'Kumasi Ahodwo | Gated pine-lined drive',
    address: 'Ahodwo, near Santasi roundabout',
    city: 'Kumasi',
    area: 'Ahodwo',
    neighborhood: 'Danyame',
    propertyType: 'Villa',
    bedrooms: 4,
    bathrooms: 4,
    description:
      'Spacious villa with separate guest chalet. Cooler climate planting; ideal for relocating families to Ashanti Region.',
    amenities: ['Guest chalet', 'Gated drive', 'Garden irrigation', 'Garage'],
    price: 10500,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 2600,
    propertyAgeYears: 10,
    geo: { lat: 6.688, lng: -1.624 },
    units: [{ unitNumber: 'KV-1', bedrooms: 4, bathrooms: 4, rentAmount: 10500, listingType: 'rental' }]
  },
  {
    name: 'Nungua Coastal Flats',
    listingLabel: '2-BED SEA-FACING — NUNGUA',
    title: 'Near Barrier | Atlantic breeze',
    address: 'Nungua Barrier coastal strip',
    city: 'Accra',
    area: 'Teshie-Nungua',
    neighborhood: 'Nungua',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    description:
      'Small block of sea-facing flats. Occasional salt spray maintenance; priced accordingly. Strong rental history for short lets.',
    amenities: ['Sea facing', 'Balcony', 'Backup inverter'],
    price: 7200,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 920,
    propertyAgeYears: 14,
    geo: { lat: 5.61, lng: -0.07 },
    units: [{ unitNumber: 'NF-3B', bedrooms: 2, bathrooms: 2, rentAmount: 7200, listingType: 'rental' }]
  },
  {
    name: 'School Junction Heights — Ashaley Botwe',
    listingLabel: 'NEW BUILD APARTMENTS — ASHALEY BOTWE',
    title: 'School Junction | First occupants',
    address: 'School Junction, Ashaley Botwe',
    city: 'Accra',
    area: 'Ashaley Botwe',
    neighborhood: 'School Junction',
    propertyType: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    description:
      'Recently completed block with modern kitchen packs and LED lighting. Near major schools; expect morning traffic peaks.',
    amenities: ['New build', 'LED lighting', 'Kitchen pack', 'Intercom'],
    price: 8900,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 1280,
    propertyAgeYears: 1,
    geo: { lat: 5.698, lng: -0.142 },
    units: [
      { unitNumber: 'PH-201', bedrooms: 3, bathrooms: 2, rentAmount: 8900, listingType: 'rental' },
      { unitNumber: 'PH-202', bedrooms: 2, bathrooms: 2, rentAmount: 7200, listingType: 'rental' }
    ]
  },
  {
    name: 'Penthouse on the Ridge',
    listingLabel: 'PENTHOUSE FOR RENT — RIDGE',
    title: 'Private lift | Panoramic Accra skyline',
    address: 'Ridge, near Nima Highway interchange',
    city: 'Accra',
    area: 'Ridge',
    neighborhood: 'Nima',
    buildingName: 'Skyline One',
    propertyType: 'Penthouse',
    bedrooms: 4,
    bathrooms: 4,
    description:
      'Top-floor penthouse with private lift access and wrap glazing. Premium finishing; ideal for ambassador-level tenants.',
    amenities: ['Private lift', 'Wine room', 'Jacuzzi', 'Panoramic views'],
    price: 35000,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified: true,
    sizeSqft: 3100,
    propertyAgeYears: 2,
    geo: { lat: 5.578, lng: -0.195 },
    units: [{ unitNumber: 'PH-1', bedrooms: 4, bathrooms: 4, rentAmount: 35000, listingType: 'rental' }]
  }
]

/** Extra areas for generated listings (lat/lng approximate). */
const SYNTH_LOCATIONS: Array<{ area: string; neighborhood: string; lat: number; lng: number }> = [
  { area: 'Madina', neighborhood: 'Zongo Junction', lat: 5.682, lng: -0.165 },
  { area: 'Adenta', neighborhood: 'Adenta Barrier', lat: 5.708, lng: -0.158 },
  { area: 'Abelemkpe', neighborhood: 'Abelemkpe Main', lat: 5.59, lng: -0.182 },
  { area: 'North Ridge', neighborhood: 'Ridge Hospital', lat: 5.569, lng: -0.198 },
  { area: 'Kokomlemle', neighborhood: 'Circle', lat: 5.572, lng: -0.21 },
  { area: 'Achimota', neighborhood: 'Achimota Forest', lat: 5.613, lng: -0.22 },
  { area: 'Kaneshie', neighborhood: 'Market', lat: 5.573, lng: -0.225 },
  { area: 'Lashibi', neighborhood: 'Community 18', lat: 5.65, lng: -0.045 },
  { area: 'Community 25', neighborhood: 'Tema Motorway', lat: 5.72, lng: -0.02 },
  { area: 'Baatsona', neighborhood: 'Spintex Road', lat: 5.642, lng: -0.128 },
  { area: 'Sakumono', neighborhood: 'Lakeside', lat: 5.625, lng: -0.035 },
  { area: 'Kwashieman', neighborhood: 'Lapaz link', lat: 5.595, lng: -0.245 },
  { area: 'Laterbiokorshie', neighborhood: 'Laterbiokorshie', lat: 5.56, lng: -0.225 },
  { area: 'Haatso', neighborhood: 'Atomic', lat: 5.658, lng: -0.152 },
  { area: 'West Legon', neighborhood: 'Agbogba', lat: 5.662, lng: -0.148 },
  { area: 'Weija', neighborhood: 'Gbawe', lat: 5.575, lng: -0.32 },
  { area: 'McCarthy Hill', neighborhood: 'McCarthy Hill', lat: 5.558, lng: -0.285 },
  { area: 'Lapaz', neighborhood: 'Lapaz Market', lat: 5.598, lng: -0.238 },
  { area: 'Darkuman', neighborhood: 'Darkuman', lat: 5.582, lng: -0.232 },
  { area: 'New Town', neighborhood: 'New Town', lat: 5.55, lng: -0.205 },
  { area: 'Maamobi', neighborhood: 'Maamobi', lat: 5.578, lng: -0.188 },
  { area: 'Agbogba', neighborhood: 'Haatso North', lat: 5.665, lng: -0.145 },
  { area: 'Pokuase', neighborhood: 'Pokuase ACP', lat: 5.692, lng: -0.22 },
  { area: 'Amasaman', neighborhood: 'Amasaman Central', lat: 5.72, lng: -0.25 },
  { area: 'Dome', neighborhood: 'Kwabenya Road', lat: 5.65, lng: -0.235 },
  { area: 'Kwabenya', neighborhood: 'Taifa', lat: 5.678, lng: -0.242 },
  { area: 'Accra New Town', neighborhood: 'ANT', lat: 5.552, lng: -0.2 },
  { area: 'Tudu', neighborhood: 'Central Station', lat: 5.545, lng: -0.215 },
  { area: 'Jamestown', neighborhood: 'Ussher Fort', lat: 5.535, lng: -0.218 },
  { area: 'Kasoa', neighborhood: 'Millennium City', lat: 5.534, lng: -0.417 },
  { area: 'Bantama', neighborhood: 'Bantama High Street', lat: 6.7, lng: -1.68 },
  { area: 'Suame', neighborhood: 'Magazine', lat: 6.71, lng: -1.62 },
  { area: 'Ayeduase', neighborhood: 'KNUST', lat: 6.675, lng: -1.57 },
  { area: 'Teshie', neighborhood: 'Teshie-Nungua Estates', lat: 5.595, lng: -0.09 },
  { area: 'Frafraha', neighborhood: 'Adenta Frafraha', lat: 5.72, lng: -0.14 },
  { area: 'Oyibi', neighborhood: 'Salem', lat: 5.735, lng: -0.12 },
  { area: 'Shai Hills', neighborhood: 'Dodowa Road', lat: 5.77, lng: -0.11 },
  { area: 'Tema New Town', neighborhood: 'Harbour view', lat: 5.64, lng: 0.01 },
  { area: 'Michel Camp', neighborhood: 'Michel Camp', lat: 5.68, lng: -0.025 },
  { area: 'Ashaiman', neighborhood: 'Lebanon Zone', lat: 5.702, lng: -0.028 },
  { area: 'Gbetsile', neighborhood: 'Community 7', lat: 5.63, lng: -0.02 },
  { area: 'Kpone', neighborhood: 'Kpone Barrier', lat: 5.72, lng: 0.05 },
  { area: 'Prampram', neighborhood: 'Prampram Beach', lat: 5.715, lng: 0.12 },
  { area: 'Dodowa', neighborhood: 'Dodowa Township', lat: 5.78, lng: -0.08 },
  { area: 'Aburi', neighborhood: 'Aburi Gardens', lat: 5.85, lng: -0.18 },
  { area: 'Peduase', neighborhood: 'Peduase Valley', lat: 5.9, lng: -0.17 }
]

const AMENITY_SETS: string[][] = [
  ['Swimming pool', 'Gym', 'Parking', '24h security', 'Elevator'],
  ['Backup generator', 'Water storage', 'CCTV', 'Intercom'],
  ['Solar water', 'Garden', 'BQ', 'Electric fence'],
  ['Fibre-ready', 'Kitchen appliances', 'AC', 'Balcony'],
  ['Gated estate', 'Playground', 'Paved roads', 'Visitor parking'],
  ['Walk-up', 'Prepaid meter', 'Shared rooftop', 'Near transit'],
  ['Open plan', 'Shared lift', 'Kitchenette', 'WC cluster'],
  ['Sea facing', 'Backup inverter', 'Balcony', 'Near beach'],
  ['New build', 'LED lighting', 'Intercom', 'Kitchen pack'],
  ['Private lift', 'Wine room', 'Jacuzzi', 'Panoramic views']
]

function makeSyntheticProperty(i: number): SeedProperty {
  const loc = SYNTH_LOCATIONS[i % SYNTH_LOCATIONS.length]
  const types = ['Apartment', 'Villa', 'Townhouse', 'Duplex', 'House', 'Penthouse', 'Office'] as const
  const propertyType = types[i % types.length]
  const city = i % 14 === 13 ? 'Kumasi' : i % 14 === 12 ? 'Tema' : i % 14 === 11 ? 'Kasoa' : 'Accra'
  const beds = 1 + (i % 4)
  const baths = Math.max(1, Math.min(beds, 1 + ((i + 2) % 3)))
  const rent = 3200 + ((i * 437) % 24000)
  const sizeSqft = 820 + (i % 45) * 55
  const age = 1 + (i % 18)
  const verified = i % 6 !== 0
  const amenities = AMENITY_SETS[i % AMENITY_SETS.length]
  const name = `${propertyType} — ${loc.area}`
  const listingLabel = `${propertyType.toUpperCase()} FOR RENT IN ${loc.area.toUpperCase()}`
  const title = `${beds}-bed | ${loc.neighborhood} | ${verified ? 'Verified' : 'New listing'}`
  const address = `${loc.neighborhood}, ${loc.area}`

  const u1 = {
    unitNumber: `U-${i + 1}-A`,
    bedrooms: beds,
    bathrooms: baths,
    rentAmount: rent,
    listingType: 'rental' as const
  }
  const units =
    i % 4 === 0
      ? [
          u1,
          {
            unitNumber: `U-${i + 1}-B`,
            bedrooms: Math.max(1, beds - 1),
            bathrooms: Math.max(1, baths - 1),
            rentAmount: Math.round(rent * 0.88),
            listingType: 'rental' as const
          }
        ]
      : [u1]

  return {
    name,
    listingLabel,
    title,
    address,
    city,
    area: loc.area,
    neighborhood: loc.neighborhood,
    propertyType,
    bedrooms: beds,
    bathrooms: baths,
    description: `Well-located ${propertyType.toLowerCase()} in ${loc.area}, ${city}. Suitable for professionals or small families; schedule a viewing via the app.`,
    amenities,
    price: rent,
    priceCurrency: 'GHS',
    pricePeriod: 'monthly',
    verified,
    sizeSqft,
    propertyAgeYears: age,
    geo: { lat: loc.lat + (i % 7) * 0.002, lng: loc.lng + (i % 5) * 0.002 },
    units
  }
}

/** 15 curated + 40 generated = 55 listings (≥ 50). */
const PROPERTIES: SeedProperty[] = [...HAND_PICKED_PROPERTIES, ...Array.from({ length: 40 }, (_, i) => makeSyntheticProperty(i))]

async function resolveLandlordId(db: Db): Promise<string> {
  const roles = db.collection('user_roles')
  const landlordRole = await roles.findOne({ role: 'landlord' })
  if (landlordRole?.userId) return String(landlordRole.userId)

  const user = await db.collection('users').findOne({})
  if (user?._id) {
    console.warn('No landlord role found; using first user _id as landlordId.')
    return String(user._id)
  }
  throw new Error('No users in database. Create a user first, then re-run seed.')
}

async function wipeListingData(db: Db) {
  const collections = [
    'rental_applications',
    'rental_contracts',
    'favorites',
    'agent_assignments',
    'maintenance_requests',
    'payments',
    'virtual_viewing_requests',
    'inquiries',
    'units',
    'properties'
  ]
  for (const name of collections) {
    const col = db.collection(name)
    const r = await col.deleteMany({})
    console.log(`Deleted ${r.deletedCount} from ${name}`)
  }

  // Optional: files tagged to old property/unit entities (best-effort)
  const files = db.collection('files')
  const fr = await files.deleteMany({
    $or: [{ entityType: 'properties' }, { entityType: 'property' }, { entityType: 'units' }, { entityType: 'unit' }]
  })
  if (fr.deletedCount) console.log(`Deleted ${fr.deletedCount} from files (property/unit entities)`)
}

async function main() {
  const client = new MongoClient(MONGODB_URL)
  await client.connect()
  // Uses database name from MONGODB_URL path when present (e.g. .../rentflow_api)
  const db = client.db()

  console.log('Using database:', db.databaseName)
  console.log('Wiping listing-related collections…')
  await wipeListingData(db)

  const landlordId = await resolveLandlordId(db)
  console.log('LandlordId:', landlordId)

  const propertiesCol = db.collection('properties')
  const unitsCol = db.collection('units')

  let propIndex = 0
  for (const p of PROPERTIES) {
    const pid = new ObjectId()
    const images = propertyGalleryImages(propIndex)
    const totalUnits = p.units.length
    const doc = {
      _id: pid,
      landlordId,
      listingLabel: p.listingLabel,
      title: p.title,
      verified: p.verified,
      price: p.price,
      priceCurrency: p.priceCurrency,
      pricePeriod: p.pricePeriod === 'sale' ? 'sale' : 'monthly',
      mortgageCurrency: p.priceCurrency,
      name: p.name,
      address: p.address,
      city: p.city,
      country: 'Ghana',
      state: p.city === 'Kumasi' ? 'Ashanti Region' : p.city === 'Kasoa' ? 'Central Region' : 'Greater Accra Region',
      area: p.area,
      neighborhood: p.neighborhood,
      buildingName: p.buildingName,
      geo: p.geo,
      propertyType: p.propertyType,
      totalUnits,
      sizeSqft: p.sizeSqft,
      propertyAgeYears: p.propertyAgeYears,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      description: p.description,
      amenities: p.amenities,
      images,
      createdAt: now(),
      updatedAt: now()
    }
    await propertiesCol.insertOne(doc as Document)

    for (const u of p.units) {
      const uid = new ObjectId()
      const unitDoc: Record<string, unknown> = {
        _id: uid,
        propertyId: String(pid),
        unitNumber: u.unitNumber,
        bedrooms: u.bedrooms,
        bathrooms: u.bathrooms,
        squareFeet: Math.round(p.sizeSqft / Math.max(1, totalUnits)),
        rentCurrency: 'GHS',
        status: 'vacant',
        listingType: u.listingType,
        images: unitGalleryImages(propIndex, u.unitNumber),
        createdAt: now(),
        updatedAt: now()
      }
      if (u.listingType === 'sale') {
        unitDoc.rentAmount = u.salePrice ?? p.price
        unitDoc.salePrice = u.salePrice ?? p.price
        unitDoc.mortgageEligible = true
        unitDoc.mortgagePartner = 'Partner Bank (demo)'
      } else {
        unitDoc.rentAmount = u.rentAmount
      }
      await unitsCol.insertOne(unitDoc as Document)
    }

    console.log('Inserted property:', p.name, `(${totalUnits} units)`)
    propIndex++
  }

  await client.close()
  console.log(`Done. Inserted ${PROPERTIES.length} properties. Restart API if running; refresh cribhub listings.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
