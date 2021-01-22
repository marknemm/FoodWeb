import { ReadRequest } from '../read-request';
import { NotificationType } from './notification';

/**
 * A read request for notifications.
 */
export interface NotificationReadRequest extends ReadRequest {
  id?: number;
  notificationType?: NotificationType | string;
  unseen?: boolean;
  read?: boolean;
  flagged?: boolean;
}
