"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserNotification = createUserNotification;
const user_notifications_1 = require("../services/user-notifications/user-notifications");
/**
 * Persist an in-app notification (internal service call).
 * Swallows errors so business hooks (payments, inquiries, etc.) are not rolled back.
 */
async function createUserNotification(app, input) {
    if (!input?.userId || !input.eventKey || !input.title)
        return;
    try {
        await app.service(user_notifications_1.userNotificationsPath).create({
            userId: input.userId,
            eventKey: input.eventKey,
            category: input.category || 'general',
            title: input.title,
            body: input.body,
            linkUrl: input.linkUrl,
            relatedService: input.relatedService,
            relatedId: input.relatedId,
            metadata: input.metadata
        }, {
            provider: undefined,
            ...(input.skipEmail ? { skipNotificationEmail: true } : {}),
            ...(input.skipSms ? { skipNotificationSms: true } : {})
        });
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[user-notifications] createUserNotification failed', e);
    }
}
//# sourceMappingURL=create-user-notification.js.map