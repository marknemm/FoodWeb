import { SignupRequest } from '../../../web';

export interface AdminAccountCreateRequest extends SignupRequest {
  accountCreateOptions: AdminAccountCreateOptions;
}

export interface AdminAccountCreateOptions {
  autoGenPassword?: boolean;
  autoVerify?: boolean;
}
