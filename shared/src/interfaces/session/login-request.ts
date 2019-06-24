import { WriteRequest } from '../write-request';

export interface LoginRequest extends WriteRequest {
  usernameEmail: string;
  password: string;
}
