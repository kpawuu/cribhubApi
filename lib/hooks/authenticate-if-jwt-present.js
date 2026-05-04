"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateIfJwtPresent = void 0;
const authentication_1 = require("@feathersjs/authentication");
/** For external calls: run JWT auth only when Authorization is present (allows anonymous catalog reads). */
const authenticateIfJwtPresent = () => {
    const authHook = (0, authentication_1.authenticate)('jwt');
    return async (context) => {
        if (!context.params.provider)
            return context;
        const headers = context.params?.headers ||
            context.params?.koa?.ctx?.headers ||
            context.params?.koa?.ctx?.request?.headers ||
            context.params?.koa?.ctx?.req?.headers;
        const authorization = headers?.authorization || headers?.Authorization;
        if (!authorization)
            return context;
        return authHook(context);
    };
};
exports.authenticateIfJwtPresent = authenticateIfJwtPresent;
//# sourceMappingURL=authenticate-if-jwt-present.js.map