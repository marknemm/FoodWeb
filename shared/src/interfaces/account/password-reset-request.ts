import { WriteRequest } from '../write-request';

export interface PasswordResetRequest extends WriteRequest {
  username: string;
  password: string;
  resetToken: string;
}
