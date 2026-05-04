"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
const authentication_1 = require("@feathersjs/authentication");
const authentication_local_1 = require("@feathersjs/authentication-local");
const authentication_oauth_1 = require("@feathersjs/authentication-oauth");
const errors_1 = require("@feathersjs/errors");
const feathers_refresh_token_1 = require("@w3lcome/feathers-refresh-token");
const checkIfUserVerified = () => {
    return async (context) => {
        const result = context.result;
        if (result?.user && result.user.isVerified === false) {
            throw new errors_1.errors.Forbidden('Your account is not verified. Please contact support.');
        }
    };
};
const authentication = (app) => {
    const authentication = new authentication_1.AuthenticationService(app);
    authentication.register('jwt', new authentication_1.JWTStrategy());
    authentication.register('local', new authentication_local_1.LocalStrategy());
    // Optional OAuth strategies (enable via config if needed)
    authentication.register('google', new authentication_oauth_1.OAuthStrategy());
    authentication.register('facebook', new authentication_oauth_1.OAuthStrategy());
    app.use('authentication', authentication);
    app.service('authentication').hooks({
        after: {
            create: [checkIfUserVerified(), (0, feathers_refresh_token_1.issueRefreshToken)()]
        }
    });
    app.configure((0, authentication_oauth_1.oauth)());
};
exports.authentication = authentication;
//# sourceMappingURL=authentication.js.map