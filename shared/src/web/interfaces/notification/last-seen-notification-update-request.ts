import { WriteRequest } from '../write-request';

export interface LastSeenNotificationUpdateRequest extends WriteRequest {
  lastSeenNotificationId?: number;
}
