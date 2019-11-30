import { AccountEntity } from '../entity/account.entity';
import { AppDataEntity } from '../entity/app-data.entity';
import { Notification, NotificationEntity, NotificationType } from '../entity/notification.entity';
import { readAppData } from '../services/read-app-data';
import { readUnseenNotificationsCount } from '../services/read-notifications';
import { createNotification } from '../services/save-notification';
import { ServerSentEventType } from '../shared';
import { broadcastPushNotifications } from './push-notification-manager';
import { SSE, sseManager } from './sse-manager';
export { Notification, NotificationType };

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

async function _getPushTargets(accounts: AccountEntity[] | AccountEntity): Promise<AppDataEntity[]> {
  accounts = (accounts instanceof Array) ? accounts : [accounts];
  const accountIds: number[] = accounts.map((account: AccountEntity) => account.id);
  return (await readAppData({ accountIds, page: 1, limit: 1000 })).entities;
}

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
