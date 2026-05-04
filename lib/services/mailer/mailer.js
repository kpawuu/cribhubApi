"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = exports.mailerPath = void 0;
const feathers_mailer_1 = __importDefault(require("feathers-mailer"));
exports.mailerPath = 'mailer';
const mailer = (app) => {
    const port = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : undefined;
    const secure = (process.env.MAIL_SECURE ?? 'true') === 'true';
    const transporter = {
        host: `${process.env.MAIL_HOST}`,
        port,
        secure,
        requireTLS: true,
        auth: {
            user: `${process.env.MAIL_USERNAME}`,
            pass: `${process.env.MAIL_PASSWORD}`
        }
    };
    app.use(exports.mailerPath, new feathers_mailer_1.default(transporter));
};
exports.mailer = mailer;
//# sourceMappingURL=mailer.js.map