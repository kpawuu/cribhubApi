"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitIdsForLandlord = unitIdsForLandlord;
exports.unitIdsForPropertyManager = unitIdsForPropertyManager;
exports.unitIdsForAgent = unitIdsForAgent;
const mongodb_1 = require("mongodb");
/** Unit `_id` strings for all units on properties owned by this user (matches `rental-applications` lookup). */
async function unitIdsForLandlord(app, user) {
    const db = await app.get('mongodbClient');
    const uid = user._id.toString();
    const props = await db
        .collection('properties')
        .find({ $or: [{ landlordId: uid }, { landlordId: user._id }] })
        .project({ _id: 1 })
        .toArray();
    const propIds = props.map((p) => p._id);
    if (!propIds.length)
        return [];
    const uts = await db.collection('units').find({ propertyId: { $in: propIds } }).project({ _id: 1 }).toArray();
    return uts.map((u) => String(u._id));
}
/** Unit `_id` strings for units on properties assigned to the agent. */
/** Units on properties where this user is an assigned property manager. */
async function unitIdsForPropertyManager(app, managerUserId) {
    const db = await app.get('mongodbClient');
    const assigns = await db
        .collection('property_manager_assignments')
        .find({ managerUserId: String(managerUserId) })
        .project({ propertyId: 1 })
        .toArray();
    const propIds = [...new Set(assigns.map((a) => a.propertyId).filter(Boolean))];
    if (!propIds.length)
        return [];
    const oids = propIds.map((id) => (mongodb_1.ObjectId.isValid(String(id)) && String(id).length === 24 ? new mongodb_1.ObjectId(String(id)) : id));
    const uts = await db.collection('units').find({ propertyId: { $in: oids } }).project({ _id: 1 }).toArray();
    return uts.map((u) => String(u._id));
}
async function unitIdsForAgent(app, agentUserId) {
    const db = await app.get('mongodbClient');
    const assigns = await db
        .collection('agent-assignments')
        .find({ agentUserId: String(agentUserId) })
        .project({ propertyId: 1 })
        .toArray();
    const propIds = [...new Set(assigns.map((a) => a.propertyId).filter(Boolean))];
    if (!propIds.length)
        return [];
    const oids = propIds.map((id) => (mongodb_1.ObjectId.isValid(String(id)) && String(id).length === 24 ? new mongodb_1.ObjectId(String(id)) : id));
    const uts = await db.collection('units').find({ propertyId: { $in: oids } }).project({ _id: 1 }).toArray();
    return uts.map((u) => String(u._id));
}
//# sourceMappingURL=portfolio-unit-ids.js.map