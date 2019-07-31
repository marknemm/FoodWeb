import { Account } from '../../../shared/src/interfaces/account/account';
import { Notification } from '../../../shared/src/interfaces/notification/notification';
import { ServerSideEventType } from '../../../shared/src/interfaces/server-side-event/server-side-event';
import { foodWebSSEManager } from './server-side-event';
import { SSEEvent } from 'server-side-events';

export function pushNotification(account: Account, notification: Notification): void {
  const sseEvent: SSEEvent = {
    id: ServerSideEventType.NotificationsAvailable,
    data: { unreadNotificiations: 1 }
  };
  foodWebSSEManager.sendEvent(account, sseEvent);
}
