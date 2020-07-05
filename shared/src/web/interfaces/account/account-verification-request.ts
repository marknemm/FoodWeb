import { WriteRequest } from '../write-request';

export interface AccountVerificationRequest extends WriteRequest {
  verificationToken: string;
}
