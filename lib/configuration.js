"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurationValidator = exports.configurationSchema = void 0;
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("./validators");
exports.configurationSchema = typebox_1.Type.Intersect([
    typebox_1.defaultAppConfiguration,
    typebox_1.Type.Object({
        host: typebox_1.Type.String(),
        port: typebox_1.Type.Number(),
        public: typebox_1.Type.String(),
        origins: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
        mongodb: typebox_1.Type.String(),
        authentication: typebox_1.Type.Any()
    })
]);
exports.configurationValidator = (0, typebox_1.getValidator)(exports.configurationSchema, validators_1.dataValidator);
//# sourceMappingURL=configuration.js.map