"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoleQueryResolver = exports.userRoleQueryValidator = exports.userRoleQuerySchema = exports.userRolePatchResolver = exports.userRolePatchValidator = exports.userRolePatchSchema = exports.userRoleDataResolver = exports.userRoleDataValidator = exports.userRoleDataSchema = exports.userRoleExternalResolver = exports.userRoleResolver = exports.userRoleValidator = exports.userRoleSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
exports.userRoleSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    userId: typebox_1.Type.String(),
    role: typebox_1.Type.Union([
        typebox_1.Type.Literal('tenant'),
        typebox_1.Type.Literal('landlord'),
        typebox_1.Type.Literal('property_manager'),
        typebox_1.Type.Literal('agent'),
        typebox_1.Type.Literal('admin')
    ]),
    createdAt: typebox_1.Type.String({ format: 'date-time' })
}, { $id: 'UserRole', additionalProperties: false });
exports.userRoleValidator = (0, typebox_1.getValidator)(exports.userRoleSchema, validators_1.dataValidator);
exports.userRoleResolver = (0, schema_1.resolve)({});
exports.userRoleExternalResolver = (0, schema_1.resolve)({});
exports.userRoleDataSchema = typebox_1.Type.Pick(exports.userRoleSchema, ['userId', 'role'], { $id: 'UserRoleData' });
exports.userRoleDataValidator = (0, typebox_1.getValidator)(exports.userRoleDataSchema, validators_1.dataValidator);
exports.userRoleDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString()
});
exports.userRolePatchSchema = typebox_1.Type.Partial(exports.userRoleSchema, { $id: 'UserRolePatch' });
exports.userRolePatchValidator = (0, typebox_1.getValidator)(exports.userRolePatchSchema, validators_1.dataValidator);
exports.userRolePatchResolver = (0, schema_1.resolve)({});
exports.userRoleQuerySchema = typebox_1.Type.Object({}, { $id: 'UserRoleQuery', additionalProperties: true });
exports.userRoleQueryValidator = (0, typebox_1.getValidator)(exports.userRoleQuerySchema, validators_1.queryValidator);
exports.userRoleQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=user-roles.schema.js.map