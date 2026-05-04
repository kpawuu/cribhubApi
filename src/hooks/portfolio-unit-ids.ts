import type { Application } from '../declarations'
import { ObjectId } from 'mongodb'

/** Unit `_id` strings for all units on properties owned by this user (matches `rental-applications` lookup). */
export async function unitIdsForLandlord(app: Application, user: { _id: { toString(): string } }): Promise<string[]> {
  const db = await app.get('mongodbClient')
  const uid = user._id.toString()
  const props = await db
    .collection('properties')
    .find({ $or: [{ landlordId: uid }, { landlordId: user._id }] })
    .project({ _id: 1 })
    .toArray()
  const propIds = props.map((p) => p._id)
  if (!propIds.length) return []
  const uts = await db.collection('units').find({ propertyId: { $in: propIds } }).project({ _id: 1 }).toArray()
  return uts.map((u) => String(u._id))
}

/** Unit `_id` strings for units on properties assigned to the agent. */
/** Units on properties where this user is an assigned property manager. */
export async function unitIdsForPropertyManager(app: Application, managerUserId: string): Promise<string[]> {
  const db = await app.get('mongodbClient')
  const assigns = await db
    .collection('property_manager_assignments')
    .find({ managerUserId: String(managerUserId) })
    .project({ propertyId: 1 })
    .toArray()
  const propIds = [...new Set(assigns.map((a: any) => a.propertyId).filter(Boolean))]
  if (!propIds.length) return []
  const oids = propIds.map((id) => (ObjectId.isValid(String(id)) && String(id).length === 24 ? new ObjectId(String(id)) : id))
  const uts = await db.collection('units').find({ propertyId: { $in: oids } }).project({ _id: 1 }).toArray()
  return uts.map((u) => String(u._id))
}

export async function unitIdsForAgent(app: Application, agentUserId: string): Promise<string[]> {
  const db = await app.get('mongodbClient')
  const assigns = await db
    .collection('agent-assignments')
    .find({ agentUserId: String(agentUserId) })
    .project({ propertyId: 1 })
    .toArray()
  const propIds = [...new Set(assigns.map((a: any) => a.propertyId).filter(Boolean))]
  if (!propIds.length) return []
  const oids = propIds.map((id) => (ObjectId.isValid(String(id)) && String(id).length === 24 ? new ObjectId(String(id)) : id))
  const uts = await db.collection('units').find({ propertyId: { $in: oids } }).project({ _id: 1 }).toArray()
  return uts.map((u) => String(u._id))
}
