"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboard = exports.DashboardService = exports.dashboardPath = void 0;
const mongodb_1 = require("mongodb");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const populate_roles_1 = require("../../hooks/populate-roles");
exports.dashboardPath = 'dashboard';
async function countColl(app, collection, filter = {}) {
    const db = await app.get('mongodbClient');
    return db.collection(collection).countDocuments(filter);
}
function pickPrimaryRole(roles) {
    if (roles.includes('admin'))
        return 'admin';
    if (roles.includes('landlord'))
        return 'landlord';
    if (roles.includes('property_manager'))
        return 'property_manager';
    if (roles.includes('agent'))
        return 'agent';
    return 'tenant';
}
class DashboardService {
    constructor(app) {
        this.app = app;
    }
    async find(_params) {
        const params = _params;
        const user = params.user;
        if (!user?._id)
            throw new errors_1.errors.NotAuthenticated();
        const uid = user._id.toString();
        const roles = Array.isArray(user.roles) ? user.roles : [];
        const role = pickPrimaryRole(roles);
        const app = this.app;
        if (role === 'admin') {
            const [properties, units, inquiries, rentalApplications, maintenanceRequests, payments, rentalContracts, users] = await Promise.all([
                countColl(app, 'properties'),
                countColl(app, 'units'),
                countColl(app, 'inquiries'),
                countColl(app, 'rental_applications'),
                countColl(app, 'maintenance_requests'),
                countColl(app, 'payments'),
                countColl(app, 'rental_contracts'),
                countColl(app, 'users')
            ]);
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
            };
        }
        if (role === 'property_manager') {
            const db = await app.get('mongodbClient');
            const ids = (await db.collection('property_manager_assignments').distinct('propertyId', { managerUserId: uid }))
                .map((x) => String(x))
                .filter(Boolean);
            const unitIdList = ids.length ? await unitIdsForProperties(app, ids) : [];
            const unitQuery = unitIdList.length === 0 ? null : unitIdList.length === 1 ? { unitId: unitIdList[0] } : { unitId: { $in: unitIdList } };
            const unitsFilter = ids.length === 0 ? null : ids.length === 1 ? { propertyId: ids[0] } : { propertyId: { $in: ids } };
            const oids = ids.map((i) => (mongodb_1.ObjectId.isValid(String(i)) && String(i).length === 24 ? new mongodb_1.ObjectId(String(i)) : i));
            const landlordIdRaw = ids.length ? await db.collection('properties').distinct('landlordId', { _id: { $in: oids } }) : [];
            const landlordIds = [...new Set(landlordIdRaw.map((x) => String(x)).filter(Boolean))];
            const payFilter = landlordIds.length === 0
                ? { landlordId: '__none__' }
                : landlordIds.length === 1
                    ? { landlordId: landlordIds[0] }
                    : { landlordId: { $in: landlordIds } };
            const [assignedProperties, units, inquiries, rentalApplications, maintenanceRequests, payments, rentalContracts] = await Promise.all([
                Promise.resolve(ids.length),
                unitsFilter ? countColl(app, 'units', unitsFilter) : Promise.resolve(0),
                landlordIds.length ? countColl(app, 'inquiries', { landlordId: { $in: landlordIds } }) : Promise.resolve(0),
                unitQuery ? countColl(app, 'rental_applications', unitQuery) : Promise.resolve(0),
                unitQuery ? countColl(app, 'maintenance_requests', unitQuery) : Promise.resolve(0),
                landlordIds.length ? countColl(app, 'payments', payFilter) : Promise.resolve(0),
                landlordIds.length ? countColl(app, 'rental_contracts', payFilter) : Promise.resolve(0)
            ]);
            return {
                role,
                assignedProperties,
                units,
                inquiries,
                rentalApplications,
                maintenanceRequests,
                payments,
                rentalContracts
            };
        }
        if (role === 'landlord') {
            const idStrings = await app
                .get('mongodbClient')
                .then((db) => db.collection('properties').distinct('_id', { landlordId: uid }))
                .then((ids) => ids.map((id) => String(id)));
            const unitIdList = idStrings.length ? await unitIdsForProperties(app, idStrings) : [];
            const unitQuery = unitIdList.length === 0 ? null : unitIdList.length === 1 ? { unitId: unitIdList[0] } : { unitId: { $in: unitIdList } };
            const unitsFilter = idStrings.length === 0 ? null : idStrings.length === 1 ? { propertyId: idStrings[0] } : { propertyId: { $in: idStrings } };
            const [properties, units, inquiries, rentalApplications, maintenanceRequests, payments, rentalContracts] = await Promise.all([
                countColl(app, 'properties', { landlordId: uid }),
                unitsFilter ? countColl(app, 'units', unitsFilter) : Promise.resolve(0),
                countColl(app, 'inquiries', { landlordId: uid }),
                unitQuery ? countColl(app, 'rental_applications', unitQuery) : Promise.resolve(0),
                unitQuery ? countColl(app, 'maintenance_requests', unitQuery) : Promise.resolve(0),
                countColl(app, 'payments', { landlordId: uid }),
                countColl(app, 'rental_contracts', { landlordId: uid })
            ]);
            return {
                role,
                properties,
                units,
                inquiries,
                rentalApplications,
                maintenanceRequests,
                payments,
                rentalContracts
            };
        }
        if (role === 'agent') {
            const ids = await app
                .get('mongodbClient')
                .then((db) => db.collection('agent_assignments').distinct('propertyId', { agentUserId: uid }))
                .then((propertyIdStrs) => propertyIdStrs.map((x) => String(x)).filter(Boolean));
            const unitIdList = ids.length ? await unitIdsForProperties(app, ids) : [];
            const unitQuery = unitIdList.length === 0 ? null : unitIdList.length === 1 ? { unitId: unitIdList[0] } : { unitId: { $in: unitIdList } };
            const unitsFilter = ids.length === 0 ? null : ids.length === 1 ? { propertyId: ids[0] } : { propertyId: { $in: ids } };
            const [assignedProperties, units, inquiries, rentalApplications, maintenanceRequests, openInquiries] = await Promise.all([
                Promise.resolve(ids.length),
                unitsFilter ? countColl(app, 'units', unitsFilter) : Promise.resolve(0),
                countColl(app, 'inquiries', { agentUserId: uid }),
                unitQuery ? countColl(app, 'rental_applications', unitQuery) : Promise.resolve(0),
                unitQuery ? countColl(app, 'maintenance_requests', unitQuery) : Promise.resolve(0),
                countColl(app, 'inquiries', { agentUserId: uid, status: 'new' })
            ]);
            return {
                role,
                assignedProperties,
                units,
                inquiries,
                rentalApplications,
                maintenanceRequests,
                openInquiries
            };
        }
        const [rentalApplications, maintenanceRequests, payments, rentalContracts, inquiries] = await Promise.all([
            countColl(app, 'rental_applications', { applicantId: uid }),
            countColl(app, 'maintenance_requests', { tenantId: uid }),
            countColl(app, 'payments', { tenantId: uid }),
            countColl(app, 'rental_contracts', { tenantId: uid }),
            countColl(app, 'inquiries', { createdByUserId: uid })
        ]);
        return {
            role,
            rentalApplications,
            maintenanceRequests,
            payments,
            rentalContracts,
            inquiries
        };
    }
}
exports.DashboardService = DashboardService;
async function unitIdsForProperties(app, propertyIds) {
    if (!propertyIds.length)
        return [];
    const db = await app.get('mongodbClient');
    const q = propertyIds.length === 1 ? { propertyId: propertyIds[0] } : { propertyId: { $in: propertyIds } };
    const rows = await db.collection('units').find(q).project({ _id: 1 }).toArray();
    return rows.map((r) => String(r._id));
}
const dashboard = (app) => {
    app.use(exports.dashboardPath, new DashboardService(app), {
        methods: ['find'],
        events: []
    });
    app.service(exports.dashboardPath).hooks({
        before: {
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), populate_roles_1.populateRoles]
        }
    });
};
exports.dashboard = dashboard;
//# sourceMappingURL=dashboard.js.map