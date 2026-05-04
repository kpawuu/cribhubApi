"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyQueryResolver = exports.propertyQueryValidator = exports.propertyQuerySchema = exports.propertyQueryProperties = exports.propertyPatchResolver = exports.propertyPatchValidator = exports.propertyPatchSchema = exports.propertyDataResolver = exports.propertyDataValidator = exports.propertyDataSchema = exports.propertyExternalResolver = exports.propertyResolver = exports.propertyValidator = exports.propertySchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
const resolveEntityFiles_1 = require("../../utils/resolveEntityFiles");
exports.propertySchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    landlordId: typebox_1.Type.String(),
    // Listing / details page parity
    listingLabel: typebox_1.Type.Optional(typebox_1.Type.String()), // e.g. "APARTMENT FOR RENT IN ..."
    listingType: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('rent'), typebox_1.Type.Literal('buy'), typebox_1.Type.Literal('commercial'), typebox_1.Type.Literal('new')])),
    title: typebox_1.Type.Optional(typebox_1.Type.String()), // e.g. "Fully Furnished | ..."
    verified: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    priceCurrency: typebox_1.Type.Optional(typebox_1.Type.String()),
    pricePeriod: typebox_1.Type.Optional(typebox_1.Type.String()), // e.g. "yearly", "monthly"
    estimatedMortgageMonthly: typebox_1.Type.Optional(typebox_1.Type.Number()),
    mortgageCurrency: typebox_1.Type.Optional(typebox_1.Type.String()),
    name: typebox_1.Type.String(),
    address: typebox_1.Type.String(),
    city: typebox_1.Type.String(),
    state: typebox_1.Type.Optional(typebox_1.Type.String()),
    country: typebox_1.Type.String(),
    postalCode: typebox_1.Type.Optional(typebox_1.Type.String()),
    area: typebox_1.Type.Optional(typebox_1.Type.String()), // e.g. "Spintex"
    neighborhood: typebox_1.Type.Optional(typebox_1.Type.String()), // e.g. "Tema"
    buildingName: typebox_1.Type.Optional(typebox_1.Type.String()), // e.g. "Tower 108"
    geo: typebox_1.Type.Optional(typebox_1.Type.Object({
        lat: typebox_1.Type.Number(),
        lng: typebox_1.Type.Number()
    }, { additionalProperties: false })),
    propertyType: typebox_1.Type.String(),
    totalUnits: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 1 })),
    sizeSqft: typebox_1.Type.Optional(typebox_1.Type.Number()),
    sizeSqm: typebox_1.Type.Optional(typebox_1.Type.Number()),
    propertyAgeYears: typebox_1.Type.Optional(typebox_1.Type.Number()),
    bedrooms: typebox_1.Type.Optional(typebox_1.Type.Number()),
    bathrooms: typebox_1.Type.Optional(typebox_1.Type.Number()),
    description: typebox_1.Type.Optional(typebox_1.Type.String()),
    amenities: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    images: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    files: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Any())),
    // Computed helpers for details.html gallery
    coverImageUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    photosCount: typebox_1.Type.Optional(typebox_1.Type.Number()),
    // Optional embed of units for a details page (when requested)
    units: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Any())),
    /** Denormalised from the first active agent-assignment; null when unassigned. */
    agentUserId: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    agent: typebox_1.Type.Optional(typebox_1.Type.Object({
        name: typebox_1.Type.String(),
        agency: typebox_1.Type.Optional(typebox_1.Type.String()),
        avatarUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
        listingsCount: typebox_1.Type.Optional(typebox_1.Type.Number()),
        responseTimeMinutes: typebox_1.Type.Optional(typebox_1.Type.Number())
    }, { additionalProperties: false })),
    priceTrendsNote: typebox_1.Type.Optional(typebox_1.Type.String()),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'Property', additionalProperties: false });
exports.propertyValidator = (0, typebox_1.getValidator)(exports.propertySchema, validators_1.dataValidator);
exports.propertyResolver = (0, schema_1.resolve)({});
exports.propertyExternalResolver = (0, schema_1.resolve)({
    files: async (_value, property, context) => {
        const id = property?._id?.toString?.() ?? '';
        if (!id)
            return [];
        return await (0, resolveEntityFiles_1.resolveEntityFiles)(context.app, 'properties', id);
    },
    coverImageUrl: async (_value, property) => {
        const images = Array.isArray(property.images) ? property.images : [];
        return images[0];
    },
    photosCount: async (_value, property) => {
        const images = Array.isArray(property.images) ? property.images : [];
        return images.length;
    },
    units: async (_value, property, context) => {
        const includeUnits = context.params?.$includeUnits === true;
        if (!includeUnits)
            return undefined;
        const id = property?._id?.toString?.() ?? '';
        if (!id)
            return [];
        const res = (await context.app.service('units').find({ paginate: false, query: { propertyId: id } }, { provider: undefined }));
        return Array.isArray(res) ? res : res?.data || [];
    },
    agent: async (_value, property, context) => {
        if (property.agent)
            return property.agent;
        const includeAgent = context.params?.$includeAgent === true;
        if (!includeAgent)
            return undefined;
        // Fast path: agentUserId is now stored directly on the property.
        // Fall back to an agent-assignments lookup for rows written before the migration.
        let agentUserId = property.agentUserId;
        if (!agentUserId) {
            const propertyId = property?._id?.toString?.() ?? '';
            if (!propertyId)
                return undefined;
            const assignments = (await context.app.service('agent-assignments').find({ paginate: false, query: { propertyId } }, { provider: undefined }));
            const list = Array.isArray(assignments) ? assignments : assignments?.data || [];
            agentUserId = list[0]?.agentUserId;
        }
        if (!agentUserId)
            return undefined;
        // Try agent profile first (full details)
        const profiles = (await context.app.service('agent-profiles').find({ paginate: false, query: { userId: agentUserId } }, { provider: undefined }));
        const pList = Array.isArray(profiles) ? profiles : profiles?.data || [];
        const profile = pList[0];
        if (profile) {
            return {
                name: profile.displayName,
                agency: profile.agency,
                avatarUrl: profile.avatarUrl,
                listingsCount: profile.listingsCount,
                responseTimeMinutes: profile.responseTimeMinutes
            };
        }
        // Fallback: agent exists but has not created a profile yet — use user record
        try {
            const u = (await context.app.service('users').get(agentUserId, { provider: undefined }));
            if (!u)
                return undefined;
            return { name: u.email || 'Agent' };
        }
        catch {
            return undefined;
        }
    }
});
exports.propertyDataSchema = typebox_1.Type.Object({
    listingLabel: typebox_1.Type.Optional(typebox_1.Type.String()),
    listingType: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('rent'), typebox_1.Type.Literal('buy'), typebox_1.Type.Literal('commercial'), typebox_1.Type.Literal('new')])),
    title: typebox_1.Type.Optional(typebox_1.Type.String()),
    verified: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    priceCurrency: typebox_1.Type.Optional(typebox_1.Type.String()),
    pricePeriod: typebox_1.Type.Optional(typebox_1.Type.String()),
    estimatedMortgageMonthly: typebox_1.Type.Optional(typebox_1.Type.Number()),
    mortgageCurrency: typebox_1.Type.Optional(typebox_1.Type.String()),
    name: typebox_1.Type.String(),
    address: typebox_1.Type.String(),
    city: typebox_1.Type.String(),
    state: typebox_1.Type.Optional(typebox_1.Type.String()),
    country: typebox_1.Type.String(),
    postalCode: typebox_1.Type.Optional(typebox_1.Type.String()),
    area: typebox_1.Type.Optional(typebox_1.Type.String()),
    neighborhood: typebox_1.Type.Optional(typebox_1.Type.String()),
    buildingName: typebox_1.Type.Optional(typebox_1.Type.String()),
    geo: typebox_1.Type.Optional(typebox_1.Type.Object({
        lat: typebox_1.Type.Number(),
        lng: typebox_1.Type.Number()
    }, { additionalProperties: false })),
    propertyType: typebox_1.Type.String(),
    totalUnits: typebox_1.Type.Optional(typebox_1.Type.Number()),
    sizeSqft: typebox_1.Type.Optional(typebox_1.Type.Number()),
    sizeSqm: typebox_1.Type.Optional(typebox_1.Type.Number()),
    propertyAgeYears: typebox_1.Type.Optional(typebox_1.Type.Number()),
    bedrooms: typebox_1.Type.Optional(typebox_1.Type.Number()),
    bathrooms: typebox_1.Type.Optional(typebox_1.Type.Number()),
    description: typebox_1.Type.Optional(typebox_1.Type.String()),
    amenities: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    images: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    agent: typebox_1.Type.Optional(typebox_1.Type.Object({
        name: typebox_1.Type.String(),
        agency: typebox_1.Type.Optional(typebox_1.Type.String()),
        avatarUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
        listingsCount: typebox_1.Type.Optional(typebox_1.Type.Number()),
        responseTimeMinutes: typebox_1.Type.Optional(typebox_1.Type.Number())
    }, { additionalProperties: false })),
    priceTrendsNote: typebox_1.Type.Optional(typebox_1.Type.String())
}, { $id: 'PropertyData', additionalProperties: false });
exports.propertyDataValidator = (0, typebox_1.getValidator)(exports.propertyDataSchema, validators_1.dataValidator);
exports.propertyDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.propertyPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.propertySchema, ['_id', 'landlordId', 'createdAt']), { $id: 'PropertyPatch' });
exports.propertyPatchValidator = (0, typebox_1.getValidator)(exports.propertyPatchSchema, validators_1.dataValidator);
exports.propertyPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.propertyQueryProperties = typebox_1.Type.Pick(exports.propertySchema, [
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
]);
const listingVirtualQuery = typebox_1.Type.Object({
    $search: typebox_1.Type.Optional(typebox_1.Type.String()),
    type: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('buy'), typebox_1.Type.Literal('rent'), typebox_1.Type.Literal('commercial'), typebox_1.Type.Literal('new')])),
    superAgent: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Boolean(), typebox_1.Type.String()])),
    /** PM-only: when true, `properties.find` is scoped to assigned properties (portfolio hub). Omit for public catalog. */
    pmPortfolio: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Boolean(), typebox_1.Type.String()]))
}, { additionalProperties: true });
exports.propertyQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.propertyQueryProperties), listingVirtualQuery, typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.propertyQueryValidator = (0, typebox_1.getValidator)(exports.propertyQuerySchema, validators_1.queryValidator);
exports.propertyQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=properties.schema.js.map