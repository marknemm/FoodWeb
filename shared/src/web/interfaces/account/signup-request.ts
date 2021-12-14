import { Account } from './account';
export { Account };

export interface SignupRequest {
  account: Account;
  password: string;
  skipVerification?: boolean;
}
