import { ReadRequest } from '../read-request';

/**
 * A read request for app data.
 */
export interface AppDataReadRequest extends ReadRequest {
  accountIds: number[];
}
