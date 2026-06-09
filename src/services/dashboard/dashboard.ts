import type { Application } from '../../declarations'
import { ObjectId } from 'mongodb'
import { errors } from '@feathersjs/errors'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { populateRoles } from '../../hooks/populate-roles'

export const dashboardPath = 'dashboard'

async function countColl(app: Application, collection: string, filter: Record<string, unknown> = {}): Promise<number> {
  const db = await app.get('mongodbClient')
  return db.collection(collection).countDocuments(filter as any)
}

function pickPrimaryRole(roles: string[]): 'admin' | 'landlord' | 'property_manager' | 'agent' | 'tenant' {
  if (roles.includes('admin')) return 'admin'
  if (roles.includes('landlord')) return 'landlord'
  if (roles.includes('property_manager')) return 'property_manager'
  if (roles.includes('agent')) return 'agent'
  return 'tenant'
}

export class DashboardService {
  constructor(public app: Application) {}

  async find(_params: Record<string, any>) {
    const params = _params
    const user = params.user as any
    if (!user?._id) throw new errors.NotAuthenticated()

    const uid = user._id.toString()
    const roles: string[] = Array.isArray(user.roles) ? user.roles : []
    const role = pickPrimaryRole(roles)
    const app = this.app

    if (role === 'admin') {
      const [
        properties,
        units,
        inquiries,
        rentalApplications,
        maintenanceRequests,
        payments,
        rentalContracts,
        users
      ] = await Promise.all([
        countColl(app, 'properties'),
        countColl(app, 'units'),
        countColl(app, 'inquiries'),
        countColl(app, 'rental_applications'),
        countColl(app, 'maintenance_requests'),
        countColl(app, 'payments'),
        countColl(app, 'rental_contracts'),
        countColl(app, 'users')
      ])
      return {
        role,
        properties,
        units,
        inquiries,
        rentalApplications,
        maintenanceRequests,
        payments,
        rentalContracts,
        users
      }
    }

    if (role === 'property_manager') {
      const db = await app.get('mongodbClient')
      const ids = (await db.collection('property_manager_assignments').distinct('propertyId', { managerUserId: uid }))
        .map((x) => String(x))
        .filter(Boolean)

      const unitIdList = ids.length ? await unitIdsForProperties(app, ids) : []
      const unitQuery =
        unitIdList.length === 0 ? null : unitIdList.length === 1 ? { unitId: unitIdList[0] } : { unitId: { $in: unitIdList } }
      const unitsFilter = ids.length === 0 ? null : ids.length === 1 ? { propertyId: ids[0] } : { propertyId: { $in: ids } }

      const oids: unknown[] = ids.map((i) => (ObjectId.isValid(String(i)) && String(i).length === 24 ? new ObjectId(String(i)) : i))
      const landlordIdRaw = ids.length ? await db.collection('properties').distinct('landlordId', { _id: { $in: oids as any } }) : []
      const landlordIds = [...new Set(landlordIdRaw.map((x) => String(x)).filter(Boolean))]
      const payFilter =
        landlordIds.length === 0
          ? { landlordId: '__none__' }
          : landlordIds.length === 1
            ? { landlordId: landlordIds[0] }
            : { landlordId: { $in: landlordIds } }

      const [
        assignedProperties,
        units,
        inquiries,
        rentalApplications,
        maintenanceRequests,
        payments,
        rentalContracts,
        pendingRequests,
        payoutsDue,
        unreadMessages
      ] = await Promise.all([
        Promise.resolve(ids.length),
        unitsFilter ? countColl(app, 'units', unitsFilter) : Promise.resolve(0),
        landlordIds.length ? countColl(app, 'inquiries', { landlordId: { $in: landlordIds } }) : Promise.resolve(0),
        unitQuery ? countColl(app, 'rental_applications', unitQuery) : Promise.resolve(0),
        unitQuery ? countColl(app, 'maintenance_requests', unitQuery) : Promise.resolve(0),
        landlordIds.length ? countColl(app, 'payments', payFilter) : Promise.resolve(0),
        landlordIds.length ? countColl(app, 'rental_contracts', payFilter) : Promise.resolve(0),
        countColl(app, 'property_manager_listing_requests', { managerUserId: uid, status: { $in: ['pending', 'countered'] } }),
        countColl(app, 'pm_payouts', { managerUserId: uid, status: 'pending' }),
        countColl(app, 'threads', { participantIds: uid })
      ])

      return {
        role,
        assignedProperties,
        units,
        inquiries,
        rentalApplications,
        maintenanceRequests,
        payments,
        rentalContracts,
        pendingRequests,
        payoutsDue,
        unreadMessages
      }
    }

    if (role === 'landlord') {
      const idStrings = await app
        .get('mongodbClient')
        .then((db) => db.collection('properties').distinct('_id', { landlordId: uid }))
        .then((ids) => ids.map((id) => String(id)))

      const unitIdList = idStrings.length ? await unitIdsForProperties(app, idStrings) : []
      const unitQuery =
        unitIdList.length === 0 ? null : unitIdList.length === 1 ? { unitId: unitIdList[0] } : { unitId: { $in: unitIdList } }
      const unitsFilter =
        idStrings.length === 0 ? null : idStrings.length === 1 ? { propertyId: idStrings[0] } : { propertyId: { $in: idStrings } }

      const [properties, units, inquiries, rentalApplications, maintenanceRequests, payments, rentalContracts] =
        await Promise.all([
          countColl(app, 'properties', { landlordId: uid }),
          unitsFilter ? countColl(app, 'units', unitsFilter) : Promise.resolve(0),
          countColl(app, 'inquiries', { landlordId: uid }),
          unitQuery ? countColl(app, 'rental_applications', unitQuery) : Promise.resolve(0),
          unitQuery ? countColl(app, 'maintenance_requests', unitQuery) : Promise.resolve(0),
          countColl(app, 'payments', { landlordId: uid }),
          countColl(app, 'rental_contracts', { landlordId: uid })
        ])

      return {
        role,
        properties,
        units,
        inquiries,
        rentalApplications,
        maintenanceRequests,
        payments,
        rentalContracts
      }
    }

    if (role === 'agent') {
      const ids = await app
        .get('mongodbClient')
        .then((db) => db.collection('agent_assignments').distinct('propertyId', { agentUserId: uid }))
        .then((propertyIdStrs) => propertyIdStrs.map((x) => String(x)).filter(Boolean))

      const unitIdList = ids.length ? await unitIdsForProperties(app, ids) : []
      const unitQuery =
        unitIdList.length === 0 ? null : unitIdList.length === 1 ? { unitId: unitIdList[0] } : { unitId: { $in: unitIdList } }
      const unitsFilter = ids.length === 0 ? null : ids.length === 1 ? { propertyId: ids[0] } : { propertyId: { $in: ids } }

      const [
        assignedProperties,
        units,
        inquiries,
        rentalApplications,
        maintenanceRequests,
        openInquiries,
        pendingRequests,
        payoutsDue
      ] = await Promise.all([
        Promise.resolve(ids.length),
        unitsFilter ? countColl(app, 'units', unitsFilter) : Promise.resolve(0),
        countColl(app, 'inquiries', { agentUserId: uid }),
        unitQuery ? countColl(app, 'rental_applications', unitQuery) : Promise.resolve(0),
        unitQuery ? countColl(app, 'maintenance_requests', unitQuery) : Promise.resolve(0),
        countColl(app, 'inquiries', { agentUserId: uid, status: 'new' }),
        countColl(app, 'agent_listing_requests', { agentUserId: uid, status: { $in: ['pending', 'countered'] } }),
        countColl(app, 'agent_payouts', { agentUserId: uid, status: 'pending' })
      ])

      return {
        role,
        assignedProperties,
        units,
        inquiries,
        rentalApplications,
        maintenanceRequests,
        openInquiries,
        pendingRequests,
        payoutsDue
      }
    }

    const [rentalApplications, maintenanceRequests, payments, rentalContracts, inquiries] = await Promise.all([
      countColl(app, 'rental_applications', { applicantId: uid }),
      countColl(app, 'maintenance_requests', { tenantId: uid }),
      countColl(app, 'payments', { tenantId: uid }),
      countColl(app, 'rental_contracts', { tenantId: uid }),
      countColl(app, 'inquiries', { createdByUserId: uid })
    ])

    return {
      role,
      rentalApplications,
      maintenanceRequests,
      payments,
      rentalContracts,
      inquiries
    }
  }
}

async function unitIdsForProperties(app: Application, propertyIds: string[]): Promise<string[]> {
  if (!propertyIds.length) return []
  const db = await app.get('mongodbClient')
  const q = propertyIds.length === 1 ? { propertyId: propertyIds[0] } : { propertyId: { $in: propertyIds } }
  const rows = await db.collection('units').find(q).project({ _id: 1 }).toArray()
  return rows.map((r) => String(r._id))
}

export const dashboard = (app: Application) => {
  app.use(dashboardPath, new DashboardService(app) as any, {
    methods: ['find'],
    events: []
  })

  app.service(dashboardPath).hooks({
    before: {
      find: [authenticateIfExternal('jwt'), populateRoles]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [dashboardPath]: DashboardService
  }
}
