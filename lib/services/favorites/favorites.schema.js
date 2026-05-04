"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteQueryResolver = exports.favoriteQueryValidator = exports.favoriteQuerySchema = exports.favoriteQueryProperties = exports.favoritePatchResolver = exports.favoritePatchValidator = exports.favoritePatchSchema = exports.favoriteDataResolver = exports.favoriteDataValidator = exports.favoriteDataSchema = exports.favoriteExternalResolver = exports.favoriteResolver = exports.favoriteValidator = exports.favoriteSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.favoriteSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    userId: typebox_1.Type.String(),
    propertyId: typebox_1.Type.String(),
    createdAt: typebox_1.Type.String({ format: 'date-time' })
}, { $id: 'Favorite', additionalProperties: false });
exports.favoriteValidator = (0, typebox_1.getValidator)(exports.favoriteSchema, validators_1.dataValidator);
exports.favoriteResolver = (0, schema_1.resolve)({});
exports.favoriteExternalResolver = (0, schema_1.resolve)({});
exports.favoriteDataSchema = typebox_1.Type.Object({
    propertyId: typebox_1.Type.String()
}, { $id: 'FavoriteData', additionalProperties: false });
exports.favoriteDataValidator = (0, typebox_1.getValidator)(exports.favoriteDataSchema, validators_1.dataValidator);
exports.favoriteDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString()
});
exports.favoritePatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.favoriteSchema, ['_id', 'userId', 'propertyId', 'createdAt']), {
    $id: 'FavoritePatch'
});
exports.favoritePatchValidator = (0, typebox_1.getValidator)(exports.favoritePatchSchema, validators_1.dataValidator);
exports.favoritePatchResolver = (0, schema_1.resolve)({});
exports.favoriteQueryProperties = typebox_1.Type.Pick(exports.favoriteSchema, ['_id', 'userId', 'propertyId', 'createdAt']);
exports.favoriteQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.favoriteQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.favoriteQueryValidator = (0, typebox_1.getValidator)(exports.favoriteQuerySchema, validators_1.queryValidator);
exports.favoriteQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=favorites.schema.js.map