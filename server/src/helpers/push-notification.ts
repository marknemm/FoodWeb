import { sseManager, SSE } from './sse-manager';
import { AccountEntity } from '../entity/account.entity';
import { NotificationEntity } from '../entity/notification.entity';
import { readUnseenNotificationsCount } from '../services/read-notifications';
import { createNotification } from '../services/save-notification';
import { Notification, NotificationType } from '../../../shared/src/interfaces/notification/notification';
import { ServerSideEventType } from '../../../shared/src/interfaces/server-side-event/server-side-event';

export { Notification, NotificationType };

export function broadcastNotification(accounts: AccountEntity[], notification: Notification): Promise<NotificationEntity[]> {
  return Promise.all(accounts.map((account: AccountEntity) => sendNotification(account, notification)));
}

export async function sendNotification(account: AccountEntity, notification: Notification): Promise<NotificationEntity> {
  const newNotification: NotificationEntity = await createNotification(notification, account);
  const unseenNotificationsCount: number = await readUnseenNotificationsCount(account);
  const sseEvent: SSE = {
    id: ServerSideEventType.NotificationsAvailable,
    data: { unseenNotificationsCount }
  };
  sseManager.sendEvent(account, sseEvent);
  return newNotification;
}
