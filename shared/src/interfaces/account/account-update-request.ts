import { Account } from './account';
export { Account };

export interface AccountUpdateRequest {
  account: Account;
  oldPassword?: string;
  password?: string;
}
