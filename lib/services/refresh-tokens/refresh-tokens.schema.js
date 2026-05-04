"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokensQueryResolver = exports.refreshTokensQueryValidator = exports.refreshTokensQuerySchema = exports.refreshTokensQueryProperties = exports.refreshTokensPatchResolver = exports.refreshTokensPatchValidator = exports.refreshTokensPatchSchema = exports.refreshTokensDataResolver = exports.refreshTokensDataValidator = exports.refreshTokensDataSchema = exports.refreshTokensExternalResolver = exports.refreshTokensResolver = exports.refreshTokensValidator = exports.refreshTokensSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const moment_1 = __importDefault(require("moment"));
const validators_1 = require("../../validators");
const users_schema_1 = require("../users/users.schema");
exports.refreshTokensSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    userId: typebox_1.Type.String(),
    refreshToken: typebox_1.Type.String(),
    isValid: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    deviceId: typebox_1.Type.Optional(typebox_1.Type.String()),
    dateCreated: typebox_1.Type.String({ format: 'date-time' }),
    dateUpdated: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    user: typebox_1.Type.Ref(users_schema_1.userSchema)
}, { $id: 'RefreshTokens', additionalProperties: false });
exports.refreshTokensValidator = (0, typebox_1.getValidator)(exports.refreshTokensSchema, validators_1.dataValidator);
exports.refreshTokensResolver = (0, schema_1.resolve)({
    user: (0, schema_1.virtual)(async (token, context) => {
        return context.app.service('users').get(token.userId);
    })
});
exports.refreshTokensExternalResolver = (0, schema_1.resolve)({});
exports.refreshTokensDataSchema = typebox_1.Type.Pick(exports.refreshTokensSchema, ['userId', 'isValid', 'refreshToken'], {
    $id: 'RefreshTokensData'
});
exports.refreshTokensDataValidator = (0, typebox_1.getValidator)(exports.refreshTokensDataSchema, validators_1.dataValidator);
exports.refreshTokensDataResolver = (0, schema_1.resolve)({
    dateCreated: async () => (0, moment_1.default)().toISOString()
});
exports.refreshTokensPatchSchema = typebox_1.Type.Partial(exports.refreshTokensSchema, { $id: 'RefreshTokensPatch' });
exports.refreshTokensPatchValidator = (0, typebox_1.getValidator)(exports.refreshTokensPatchSchema, validators_1.dataValidator);
exports.refreshTokensPatchResolver = (0, schema_1.resolve)({
    dateUpdated: async () => (0, moment_1.default)().toISOString()
});
exports.refreshTokensQueryProperties = typebox_1.Type.Pick(exports.refreshTokensSchema, ['_id', 'userId', 'isValid', 'refreshToken']);
exports.refreshTokensQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.refreshTokensQueryProperties), typebox_1.Type.Object({}, { additionalProperties: false })], { additionalProperties: false });
exports.refreshTokensQueryValidator = (0, typebox_1.getValidator)(exports.refreshTokensQuerySchema, validators_1.queryValidator);
exports.refreshTokensQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=refresh-tokens.schema.js.map