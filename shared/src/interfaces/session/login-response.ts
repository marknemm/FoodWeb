import { Account } from '../account/account';

export interface LoginResponse {
  account: Account;
  appSessionToken?: string;
}
