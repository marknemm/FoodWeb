import { WriteRequest } from '../write-request';

export interface PasswordUpdateRequest extends WriteRequest {
  password: string;
  oldPassword?: string;
}
