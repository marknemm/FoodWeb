import { WriteRequest } from '../write-request';
import { Account } from './account';
export { Account };

export interface SignupRequest extends WriteRequest {
  account: Account;
  password: string;
}
