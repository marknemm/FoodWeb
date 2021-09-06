import { ReadRequest } from '../read-request';
import { NotificationType } from './notification';

/**
 * A read request for notifications.
 */
export interface NotificationReadRequest extends ReadRequest {
  id?: number;
  flagged?: boolean;
  notificationType?: NotificationType | string;
  read?: boolean;
  resetUnseenNotifications?: boolean;
  unseen?: boolean;
}
