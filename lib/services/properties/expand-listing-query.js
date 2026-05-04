"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandListingQuery = expandListingQuery;
const mongodb_1 = require("mongodb");
const adapter_commons_1 = require("@feathersjs/adapter-commons");
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/**
 * Turns public listing UI params into Mongo-safe filters before the adapter runs.
 * Removes virtual keys: `$search`, `type`, `superAgent`.
 */
async function expandListingQuery(context) {
    if (context.method !== 'find')
        return context;
    const q = { ...(context.params.query || {}) };
    if (typeof q.$search === 'string' && q.$search.trim()) {
        const rx = new RegExp(escapeRegex(q.$search.trim()), 'i');
        delete q.$search;
        const clause = {
            $or: [
                { name: { $regex: rx } },
                { city: { $regex: rx } },
                { address: { $regex: rx } },
                { area: { $regex: rx } },
                { neighborhood: { $regex: rx } },
                { buildingName: { $regex: rx } },
                { country: { $regex: rx } },
                { state: { $regex: rx } }
            ]
        };
        if (!Array.isArray(q.$and))
            q.$and = [];
        q.$and.push(clause);
    }
    const tab = q.type;
    if (tab === 'rent' || tab === 'buy' || tab === 'commercial' || tab === 'new') {
        delete q.type;
        if (!Array.isArray(q.$and))
            q.$and = [];
        if (tab === 'rent') {
            q.$and.push({
                pricePeriod: { $in: ['monthly', 'yearly', 'month', 'year', 'weekly', 'week', 'per month', 'per year'] }
            });
        }
        else if (tab === 'buy') {
            q.$and.push({
                $nor: [{ pricePeriod: { $in: ['monthly', 'yearly', 'month', 'year', 'weekly', 'week', 'per month', 'per year'] } }]
            });
        }
        else if (tab === 'commercial') {
            q.$and.push({
                propertyType: { $regex: /(commercial|office|retail|warehouse|industrial|shop|mixed-use)/i }
            });
        }
        else if (tab === 'new') {
            q.$and.push({
                $or: [{ propertyAgeYears: { $lte: 2 } }, { propertyAgeYears: null }, { propertyAgeYears: { $exists: false } }]
            });
        }
    }
    const sa = q.superAgent;
    if (sa === true || sa === 'true') {
        delete q.superAgent;
        const db = await context.app.get('mongodbClient');
        const ids = await db.collection('agent-assignments').distinct('propertyId', {
            propertyId: { $exists: true, $nin: [null, ''] }
        });
        const idList = ids.map((x) => String(x)).filter(Boolean);
        if (!Array.isArray(q.$and))
            q.$and = [];
        if (!idList.length) {
            q.$and.push({ _id: { $in: [] } });
        }
        else {
            const oids = [];
            for (const id of idList) {
                try {
                    oids.push(mongodb_1.ObjectId.isValid(id) && String(id).length === 24 ? new mongodb_1.ObjectId(id) : id);
                }
                catch {
                    oids.push(id);
                }
            }
            q.$and.push({ _id: { $in: oids } });
        }
    }
    // Re-stamp VALIDATED so sanitizeQuery skips re-running filterQuery on our
    // server-added $regex / $and clauses (spreading loses the non-enumerable symbol).
    Object.defineProperty(q, adapter_commons_1.VALIDATED, { value: true, enumerable: false, configurable: true });
    context.params.query = q;
    return context;
}
//# sourceMappingURL=expand-listing-query.js.map