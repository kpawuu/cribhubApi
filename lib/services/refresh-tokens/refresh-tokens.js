"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = exports.refreshTokensMethods = exports.refreshTokensPath = void 0;
const schema_1 = require("@feathersjs/schema");
const authentication_1 = require("@feathersjs/authentication");
const feathers_refresh_token_1 = require("@w3lcome/feathers-refresh-token");
const refresh_tokens_class_1 = require("./refresh-tokens.class");
const refresh_tokens_schema_1 = require("./refresh-tokens.schema");
const asAppHook = (_hook) => _hook;
exports.refreshTokensPath = 'refresh-tokens';
exports.refreshTokensMethods = ['find', 'get', 'create', 'patch', 'remove'];
const refreshTokens = (app) => {
    app.use(exports.refreshTokensPath, new refresh_tokens_class_1.RefreshTokensService((0, refresh_tokens_class_1.getOptions)(app)), {
        methods: exports.refreshTokensMethods,
        events: []
    });
    app.service(exports.refreshTokensPath).hooks({
        around: {
            all: [schema_1.hooks.resolveExternal(refresh_tokens_schema_1.refreshTokensExternalResolver), schema_1.hooks.resolveResult(refresh_tokens_schema_1.refreshTokensResolver)]
        },
        before: {
            all: [schema_1.hooks.validateQuery(refresh_tokens_schema_1.refreshTokensQueryValidator), schema_1.hooks.resolveQuery(refresh_tokens_schema_1.refreshTokensQueryResolver)],
            create: [
                schema_1.hooks.validateData(refresh_tokens_schema_1.refreshTokensDataValidator),
                schema_1.hooks.resolveData(refresh_tokens_schema_1.refreshTokensDataResolver),
                asAppHook((0, feathers_refresh_token_1.refreshAccessToken)())
            ],
            patch: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.validateData(refresh_tokens_schema_1.refreshTokensPatchValidator),
                schema_1.hooks.resolveData(refresh_tokens_schema_1.refreshTokensPatchResolver),
                asAppHook((0, feathers_refresh_token_1.revokeRefreshToken)())
            ],
            remove: [(0, authentication_1.authenticate)('jwt'), asAppHook((0, feathers_refresh_token_1.logoutUser)())]
        },
        after: {
            remove: [asAppHook((0, feathers_refresh_token_1.logoutUser)())]
        }
    });
};
exports.refreshTokens = refreshTokens;
//# sourceMappingURL=refresh-tokens.js.map