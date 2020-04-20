import { WriteRequest } from '../write-request';

export interface AccountSectionUpdateReqeust<T = any> extends WriteRequest {
  accountSection: T;
  accountSectionName: string;
}
