import { Account } from './account';
export { Account };

export interface AccountCreateRequest {
  account: Account;
  password: string;
}
