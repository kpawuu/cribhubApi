import type { Application } from '../declarations'
import { userNotificationsPath } from '../services/user-notifications/user-notifications'

export type CreateUserNotificationInput = {
  userId: string
  eventKey: string
  category: string
  title: string
  body?: string
  linkUrl?: string
  relatedService?: string
  relatedId?: string
  metadata?: Record<string, unknown>
  /** When true, skips the post-create notification email (in-app row is still created). */
  skipEmail?: boolean
}

/**
 * Persist an in-app notification (internal service call).
 * Swallows errors so business hooks (payments, inquiries, etc.) are not rolled back.
 */
export async function createUserNotification(app: Application, input: CreateUserNotificationInput): Promise<void> {
  if (!input?.userId || !input.eventKey || !input.title) return
  try {
    await (app as any).service(userNotificationsPath).create(
      {
        userId: input.userId,
        eventKey: input.eventKey,
        category: input.category || 'general',
        title: input.title,
        body: input.body,
        linkUrl: input.linkUrl,
        relatedService: input.relatedService,
        relatedId: input.relatedId,
        metadata: input.metadata
      },
      {
        provider: undefined,
        ...(input.skipEmail ? { skipNotificationEmail: true } : {})
      } as any
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[user-notifications] createUserNotification failed', e)
  }
}
