import { Account } from '../../../shared/src/interfaces/account/account';
import { Notification } from '../../../shared/src/interfaces/notification/notification';
import { sendEvent } from './server-side-event';
import { SSEEvent } from 'server-side-events';

export function pushNotification(account: Account, notification: Notification) {
  const sseEvent: SSEEvent = {
    event: notification.notificationType,
    data: notification,
    id: notification.notificationDetailId
  };
  sendEvent(account, sseEvent);
}
