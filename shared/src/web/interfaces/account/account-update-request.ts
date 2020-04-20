import { WriteRequest } from '../write-request';
import { Account } from './account';
export { Account };

export interface AccountUpdateRequest extends WriteRequest {
  account: Account;
}
