import { DonationReadRequest } from '../donation';
import { PagingParams } from '../paging-params';

export interface DeliveryReadRequest extends DonationReadRequest, PagingParams {}
