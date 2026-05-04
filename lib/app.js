"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const feathers_1 = require("@feathersjs/feathers");
const configuration_1 = __importDefault(require("@feathersjs/configuration"));
const dotenv_1 = __importDefault(require("dotenv"));
const koa_1 = require("@feathersjs/koa");
const socketio_1 = __importDefault(require("@feathersjs/socketio"));
const path_1 = __importDefault(require("path"));
const koa_2 = require("@feathersjs/koa");
const koa_body_1 = __importDefault(require("koa-body"));
const configuration_2 = require("./configuration");
const mongodb_1 = require("./mongodb");
const authentication_1 = require("./authentication");
const services_1 = require("./services");
const channels_1 = require("./channels");
const logger_1 = require("./logger");
const app = (0, koa_1.koa)((0, feathers_1.feathers)());
exports.app = app;
dotenv_1.default.config();
app.configure((0, configuration_1.default)(configuration_2.configurationValidator));
app.use((0, koa_1.cors)());
app.use((0, koa_2.serveStatic)(path_1.default.resolve(app.get('public'))));
app.use((0, koa_1.errorHandler)());
app.use((0, koa_1.parseAuthentication)());
app.use((0, koa_body_1.default)({
    includeUnparsed: true,
    multipart: true,
    formidable: {
        keepExtensions: true,
        multiples: true,
        maxFileSize: 50 * 1024 * 1024,
        uploadDir: path_1.default.join(process.cwd(), 'public', 'files', 'upload')
    }
}));
// Expose rawBody for webhook signature verification
app.use(async (ctx, next) => {
    const unparsed = ctx.request?.body?.[Symbol.for('unparsedBody')];
    if (unparsed) {
        ;
        ctx.feathers.rawBody = unparsed.toString();
    }
    ;
    ctx.feathers.headers = ctx.request.headers;
    await next();
});
app.configure((0, koa_1.rest)());
app.configure((0, socketio_1.default)({
    cors: {
        origin: app.get('origins') || '*'
    }
}));
app.configure(mongodb_1.mongodb);
app.configure(authentication_1.authentication);
app.configure(services_1.services);
app.configure(channels_1.channels);
app.hooks({
    error: {
        all: [
            async (context) => {
                const err = context.error;
                const cause = err?.cause instanceof Error ? err.cause.message : err?.cause ? String(err.cause) : '';
                logger_1.logger.error(`${context.path} ${context.method} error: ${err?.message}${cause ? ` (cause: ${cause})` : ''}${err?.stack ? `\n${err.stack}` : ''}`);
                return context;
            }
        ]
    }
});
//# sourceMappingURL=app.js.map