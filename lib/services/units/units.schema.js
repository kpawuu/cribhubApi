"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitQueryResolver = exports.unitQueryValidator = exports.unitQuerySchema = exports.unitQueryProperties = exports.unitPatchResolver = exports.unitPatchValidator = exports.unitPatchSchema = exports.unitDataResolver = exports.unitDataValidator = exports.unitDataSchema = exports.unitExternalResolver = exports.unitResolver = exports.unitValidator = exports.unitSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
const resolveEntityFiles_1 = require("../../utils/resolveEntityFiles");
exports.unitSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    propertyId: typebox_1.Type.String(),
    unitNumber: typebox_1.Type.String(),
    bedrooms: typebox_1.Type.Number(),
    bathrooms: typebox_1.Type.Number(),
    squareFeet: typebox_1.Type.Optional(typebox_1.Type.Number()),
    rentAmount: typebox_1.Type.Number(),
    rentCurrency: typebox_1.Type.Optional(typebox_1.Type.String({ default: 'GHS' })),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('vacant'), typebox_1.Type.Literal('occupied'), typebox_1.Type.Literal('maintenance')])),
    tenantId: typebox_1.Type.Optional(typebox_1.Type.String()),
    leaseStart: typebox_1.Type.Optional(typebox_1.Type.String()),
    leaseEnd: typebox_1.Type.Optional(typebox_1.Type.String()),
    // listing support
    listingType: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('rental'), typebox_1.Type.Literal('sale')])),
    salePrice: typebox_1.Type.Optional(typebox_1.Type.Number()),
    mortgageEligible: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    mortgagePartner: typebox_1.Type.Optional(typebox_1.Type.String()),
    images: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    files: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Any())),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'Unit', additionalProperties: false });
exports.unitValidator = (0, typebox_1.getValidator)(exports.unitSchema, validators_1.dataValidator);
exports.unitResolver = (0, schema_1.resolve)({});
exports.unitExternalResolver = (0, schema_1.resolve)({
    files: async (_value, unit, context) => {
        const id = unit?._id?.toString?.() ?? '';
        if (!id)
            return [];
        return await (0, resolveEntityFiles_1.resolveEntityFiles)(context.app, 'units', id);
    }
});
exports.unitDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String(),
    unitNumber: typebox_1.Type.String(),
    bedrooms: typebox_1.Type.Number(),
    bathrooms: typebox_1.Type.Number(),
    squareFeet: typebox_1.Type.Optional(typebox_1.Type.Number()),
    rentAmount: typebox_1.Type.Number(),
    rentCurrency: typebox_1.Type.Optional(typebox_1.Type.String()),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('vacant'), typebox_1.Type.Literal('occupied'), typebox_1.Type.Literal('maintenance')])),
    tenantId: typebox_1.Type.Optional(typebox_1.Type.String()),
    leaseStart: typebox_1.Type.Optional(typebox_1.Type.String()),
    leaseEnd: typebox_1.Type.Optional(typebox_1.Type.String()),
    listingType: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('rental'), typebox_1.Type.Literal('sale')])),
    salePrice: typebox_1.Type.Optional(typebox_1.Type.Number()),
    mortgageEligible: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    mortgagePartner: typebox_1.Type.Optional(typebox_1.Type.String()),
    images: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String()))
}, { $id: 'UnitData', additionalProperties: false });
exports.unitDataValidator = (0, typebox_1.getValidator)(exports.unitDataSchema, validators_1.dataValidator);
exports.unitDataResolver = (0, schema_1.resolve)({
    status: async () => 'vacant',
    listingType: async (v) => (v ?? 'rental'),
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString()
});
exports.unitPatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.unitSchema, ['_id', 'createdAt']), { $id: 'UnitPatch' });
exports.unitPatchValidator = (0, typebox_1.getValidator)(exports.unitPatchSchema, validators_1.dataValidator);
exports.unitPatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.unitQueryProperties = typebox_1.Type.Pick(exports.unitSchema, [
    '_id',
    'propertyId',
    'unitNumber',
    'status',
    'tenantId',
    'listingType',
    'createdAt',
    'updatedAt'
]);
exports.unitQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.unitQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.unitQueryValidator = (0, typebox_1.getValidator)(exports.unitQuerySchema, validators_1.queryValidator);
exports.unitQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=units.schema.js.map