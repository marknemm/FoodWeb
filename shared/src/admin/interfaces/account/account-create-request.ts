import { SignupRequest } from '../../../web';

export interface AccountCreateRequest extends SignupRequest {
  accountCreateOptions: AccountCreateOptions;
}

export interface AccountCreateOptions {
  autoGenPassword?: boolean;
  autoVerify?: boolean;
}
