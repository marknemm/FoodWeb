import { WriteRequest } from '../write-request';
import { Account } from './account';
export { Account };

export interface AccountCreateRequest extends WriteRequest {
  account: Account;
  password: string;
}
