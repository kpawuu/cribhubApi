"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favorites = exports.favoritesMethods = exports.favoritesPath = void 0;
const merge_query_1 = require("../../hooks/merge-query");
const schema_1 = require("@feathersjs/schema");
const errors_1 = require("@feathersjs/errors");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const favorites_class_1 = require("./favorites.class");
const favorites_schema_1 = require("./favorites.schema");
exports.favoritesPath = 'favorites';
exports.favoritesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const attachUserId = async (context) => {
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    context.data.userId = user._id.toString();
    return context;
};
const restrictToSelf = async (context) => {
    if (!context.params.provider)
        return context;
    const user = context.params.user;
    if (!user?._id)
        throw new errors_1.errors.NotAuthenticated();
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('admin'))
        return context;
    if (context.method === 'find') {
        (0, merge_query_1.mergeQuery)(context, { userId: user._id.toString() });
    }
    if (context.id) {
        const existing = await context.app.service(exports.favoritesPath).get(context.id, { provider: undefined });
        if (existing.userId !== user._id.toString())
            throw new errors_1.errors.Forbidden('Not allowed');
    }
    return context;
};
const assertUniqueFavorite = async (context) => {
    const user = context.params.user;
    const propertyId = context.data?.propertyId;
    if (!propertyId)
        throw new errors_1.errors.BadRequest('propertyId is required');
    const db = await context.app.get('mongodbClient');
    const dup = await db.collection('favorites').countDocuments({ userId: user._id.toString(), propertyId });
    if (dup > 0)
        throw new errors_1.errors.BadRequest('Property is already in favorites');
    return context;
};
const favorites = (app) => {
    app.use(exports.favoritesPath, new favorites_class_1.FavoritesService((0, favorites_class_1.getOptions)(app)), {
        methods: exports.favoritesMethods,
        events: []
    });
    app.service(exports.favoritesPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(favorites_schema_1.favoriteExternalResolver), schema_1.hooks.resolveResult(favorites_schema_1.favoriteResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(favorites_schema_1.favoriteQueryValidator), schema_1.hooks.resolveQuery(favorites_schema_1.favoriteQueryResolver)],
            find: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), restrictToSelf],
            get: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), restrictToSelf],
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                restrictToSelf,
                assertUniqueFavorite,
                schema_1.hooks.validateData(favorites_schema_1.favoriteDataValidator),
                schema_1.hooks.resolveData(favorites_schema_1.favoriteDataResolver),
                attachUserId
            ],
            patch: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                restrictToSelf,
                schema_1.hooks.validateData(favorites_schema_1.favoritePatchValidator),
                schema_1.hooks.resolveData(favorites_schema_1.favoritePatchResolver)
            ],
            remove: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), restrictToSelf]
        }
    });
};
exports.favorites = favorites;
//# sourceMappingURL=favorites.js.map