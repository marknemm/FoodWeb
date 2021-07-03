import { ReadRequest } from '../read-request';

/**
 * A read request for mobile device data.
 */
export interface MobileDeviceReadRequest extends ReadRequest {
  accountIds: number[];
}
