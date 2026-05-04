"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authNotifier = void 0;
const emailMessage_1 = __importDefault(require("../../utils/emailMessage"));
/**
 * Mirrors inventorsocial_api_backup notifier pattern, but implemented as a safe no-op logger
 * until you wire in a real email/SMS provider.
 *
 * Feathers-authentication-management calls this with:
 *  - resendVerifySignup
 *  - verifySignup
 *  - sendResetPwd
 *  - resetPwd / resetPwdShort
 *  - passwordChange
 *  - identityChange
 */
const authNotifier = (app) => {
    return async (type, user, notifierOptions = {}) => {
        const appName = process.env.APP_NAME || 'RentFlow';
        const emailFrom = `"${appName}" <${process.env.MAIL_SENT_FROM || process.env.MAIL_USERNAME || 'no-reply@localhost'}>`;
        // If SMTP isn't configured, do not throw during signup/reset flows.
        const mailHost = process.env.MAIL_HOST;
        const mailUser = process.env.MAIL_USERNAME;
        const mailPass = process.env.MAIL_PASSWORD;
        if (!mailHost || !mailUser || !mailPass) {
            // eslint-disable-next-line no-console
            console.log(`[auth-management] Email skipped (SMTP not configured): ${type} -> ${user?.email || 'unknown'}`);
            return;
        }
        const sendEmail = async (to, subject, html) => {
            // feathers-mailer expects nodemailer-like fields
            await app.service('mailer').create({
                from: emailFrom,
                to,
                subject,
                html
            });
        };
        const toEmail = user?.email;
        if (!toEmail)
            return;
        switch (type) {
            case 'resendVerifySignup': {
                const token = user.verifyShortToken || user.verifyToken;
                const msg = `Hello ${user.fullName || ''}, your ${appName} verification code is <b>${token}</b>.`;
                await sendEmail(toEmail, `${appName} verification code`, await (0, emailMessage_1.default)(msg));
                break;
            }
            case 'verifySignup': {
                const msg = `Hello ${user.fullName || ''}, your email has been verified successfully.`;
                await sendEmail(toEmail, `${appName} email verified`, await (0, emailMessage_1.default)(msg));
                break;
            }
            case 'sendResetPwd': {
                const token = user.resetShortToken || user.resetToken;
                const msg = `Hello ${user.fullName || ''}, your password reset code is <b>${token}</b>. This code expires soon.`;
                await sendEmail(toEmail, `${appName} password reset`, await (0, emailMessage_1.default)(msg));
                break;
            }
            case 'resetPwd':
            case 'resetPwdShort': {
                const msg = `Hello ${user.fullName || ''}, your password has been reset successfully.`;
                await sendEmail(toEmail, `${appName} password reset successful`, await (0, emailMessage_1.default)(msg));
                break;
            }
            case 'passwordChange': {
                const msg = `Hello ${user.fullName || ''}, your password has been changed successfully.`;
                await sendEmail(toEmail, `${appName} password changed`, await (0, emailMessage_1.default)(msg));
                break;
            }
            case 'identityChange': {
                const msg = `Hello ${user.fullName || ''}, your account details were updated successfully.`;
                await sendEmail(toEmail, `${appName} account updated`, await (0, emailMessage_1.default)(msg));
                break;
            }
            default: {
                // eslint-disable-next-line no-console
                console.log(`[auth-management] Unknown notification type: ${type}`);
            }
        }
    };
};
exports.authNotifier = authNotifier;
//# sourceMappingURL=notifier.js.map