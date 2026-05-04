"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateIfExternal = void 0;
const authentication_1 = require("@feathersjs/authentication");
const authenticateIfExternal = (...strategies) => {
    const chosen = strategies.length ? strategies : ['jwt'];
    // Avoid TS tuple/spread typing issues by casting through unknown
    const authHook = (0, authentication_1.authenticate)(...chosen);
    return async (context) => {
        if (!context.params.provider)
            return context;
        return authHook(context);
    };
};
exports.authenticateIfExternal = authenticateIfExternal;
//# sourceMappingURL=authenticate-if-external.js.map