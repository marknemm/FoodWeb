import { WriteRequest } from '../write-request';
import { Notification } from './notification';
export { Notification };

export interface NotificationUpdateRequest extends WriteRequest {
  notification: Notification;
}
