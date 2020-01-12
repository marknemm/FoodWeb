import { AccountEntity } from '../../entity/account.entity';
import { AppDataEntity } from '../../entity/app-data.entity';
import { Notification, NotificationEntity, NotificationType } from '../../entity/notification.entity';
import { readAppData } from '../../services/app-data/read-app-data';
import { readUnseenNotificationsCount } from '../../services/notification/read-notifications';
import { createNotification } from '../../services/notification/save-notification';
import { ServerSentEventType } from '../../shared';
import { broadcastPushNotifications } from './push-notification-manager';
import { SSE, sseManager } from './sse-manager';
export { Notification, NotificationType };

/**
 * Broadcasts a given notification to a given list of accounts (via Push and/or SSE).
 * Also, saves the broadcasted notifications for later lookup within the app/website.
 * @param accounts The accounts to broadcast the notification to.
 * @param notification The notification that is to be broadcasted.
 * @return A promise that resolves to the saved notification entities of broadcasted notifications.
 */
export async function broadcastNotification(accounts: AccountEntity[], notification: Notification): Promise<NotificationEntity[]> {
  // Only send push notifications to accounts that have it enabled.
  const pushAccounts: AccountEntity[] = accounts.filter((account: AccountEntity) => account.contactInfo.enablePushNotification);
  const pushTargets: AppDataEntity[] = await _getPushTargets(pushAccounts);
  await broadcastPushNotifications(pushTargets, notification);
  // Send Server Sent Event notifications to all accounts (will show up within in-app/website notifications menu).
  return (!notification.pushOnly)
    ? Promise.all(accounts.map((account: AccountEntity) => _sendSSE(account, notification)))
    : [];
}

/**
 * Sends a given notification to a given account (via Push and/or SSE).
 * Also, saves the sent notification for later lookup within the app/website.
 * @param account The account to send the notification to.
 * @param notification The notification that is to be sent.
 * @return A promise that resolves to the saved notification entity of the sent notification.
 */
export async function sendNotification(account: AccountEntity, notification: Notification): Promise<NotificationEntity> {
  // If the user has disabled push notifications, then do not send.
  if (!account.contactInfo.enablePushNotification) {
    const pushTargets: AppDataEntity[] = await _getPushTargets(account);
    await broadcastPushNotifications(pushTargets, notification);
  }
  // Send Server Sent Event notification (will show up within in-app/website notifications menu).
  return (!notification.pushOnly)
    ? _sendSSE(account, notification)
    : null;
}

/**
 * Gets the app data targets of a push notification.
 * @param accounts The accounts that are to be targeted by push notification.
 * @return A promise that resolves to the app data targets.
 */
async function _getPushTargets(accounts: AccountEntity[] | AccountEntity): Promise<AppDataEntity[]> {
  accounts = (accounts instanceof Array) ? accounts : [accounts];
  const accountIds: number[] = accounts.map((account: AccountEntity) => account.id);
  return (await readAppData({ accountIds, page: 1, limit: 1000 })).entities;
}

/**
 * Sends a notification via Server-Sent Event (SSE) to a given account.
 * @param account The account to send the SSE to.
 * @param notification The notification to send (via SSE).
 * @return A promise that resolves to the saved entity of the sent notification.
 */
async function _sendSSE(account: AccountEntity, notification: Notification): Promise<NotificationEntity> {
  const savedNotification: NotificationEntity = await createNotification(notification, account);
  const unseenNotificationsCount: number = await readUnseenNotificationsCount(account);
  const sse: SSE = {
    id: ServerSentEventType.NotificationsAvailable,
    data: { unseenNotificationsCount }
  };
  sseManager.sendEvent(account, sse);
  return savedNotification;
}
