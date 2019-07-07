import { WriteRequest } from '../write-request';

export interface LoginRequest extends WriteRequest {
  username: string;
  password: string;
}
