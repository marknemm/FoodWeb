import { sseManager, SSE } from './sse-manager';
import { broadcastPushNotifications } from './push-notification-manager';
import { AccountEntity } from '../entity/account.entity';
import { AppDataEntity } from '../entity/app-data.entity';
import { NotificationEntity } from '../entity/notification.entity';
import { readUnseenNotificationsCount } from '../services/read-notifications';
import { createNotification } from '../services/save-notification';
import { readAppData } from '../services/read-app-data';
import { Notification, NotificationType } from '../../../shared/src/interfaces/notification/notification';
import { ServerSentEventType } from '../../../shared/src/interfaces/server-sent-event/server-sent-event';
export { Notification, NotificationType };

export function broadcastNotification(accounts: AccountEntity[], notification: Notification): Promise<NotificationEntity[]> {
  return Promise.all(accounts.map((account: AccountEntity) => sendNotification(account, notification)));
}

export async function sendNotification(account: AccountEntity, notification: Notification): Promise<NotificationEntity> {
  const newNotification: NotificationEntity = await createNotification(notification, account);
  const unseenNotificationsCount: number = await readUnseenNotificationsCount(account);
  const pushTargets: AppDataEntity[] = (await readAppData({ accountIds: [account.id], page: 1, limit: 1000 })).appDataArr;
  const sseEvent: SSE = {
    id: ServerSentEventType.NotificationsAvailable,
    data: { unseenNotificationsCount }
  };
  sseManager.sendEvent(account, sseEvent);
  await broadcastPushNotifications(pushTargets, newNotification);
  return newNotification;
}
