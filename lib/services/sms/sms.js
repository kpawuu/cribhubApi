"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sms = exports.smsMethods = exports.smsPath = void 0;
const sms_class_1 = require("./sms.class");
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const require_role_1 = require("../../hooks/require-role");
exports.smsPath = 'sms';
exports.smsMethods = ['create'];
const sms = (app) => {
    app.use(exports.smsPath, new sms_class_1.SmsService((0, sms_class_1.getOptions)(app)), {
        methods: exports.smsMethods,
        events: []
    });
    app.service(exports.smsPath).hooks({
        before: {
            create: [(0, authenticate_if_external_1.authenticateIfExternal)('jwt'), (0, require_role_1.requireRole)('admin', 'landlord', 'property_manager')]
        }
    });
};
exports.sms = sms;
//# sourceMappingURL=sms.js.map