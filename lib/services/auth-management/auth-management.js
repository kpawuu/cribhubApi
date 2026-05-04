"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authManagement = exports.authManagementPath = void 0;
const feathers_authentication_management_1 = require("feathers-authentication-management");
const notifier_1 = require("./notifier");
exports.authManagementPath = 'auth-management';
const authManagement = (app) => {
    const options = {
        service: 'users',
        notifier: (0, notifier_1.authNotifier)(app),
        longTokenLen: 15,
        shortTokenLen: 6,
        shortTokenDigits: true,
        delay: 5 * 24 * 60 * 60 * 1000, // 5 days
        resetDelay: 2 * 60 * 60 * 1000, // 2 hours
        resetAttempts: 3
    };
    app.use(exports.authManagementPath, new feathers_authentication_management_1.AuthenticationManagementService(app, options));
    // Keep parity with inventorsocial: no special hooks required here for now.
};
exports.authManagement = authManagement;
//# sourceMappingURL=auth-management.js.map