import { WriteRequest } from '../write-request';
import { Account } from './account';

export interface AccountSectionUpdateReqeust extends WriteRequest {
  accountSection: Account[keyof Account];
  accountSectionName: keyof Account | 'notificationSettings';
}
