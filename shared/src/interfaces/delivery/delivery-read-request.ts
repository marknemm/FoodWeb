import { DeliveryReadFilters } from './delivery-read-filters';
import { PagingParams } from '../paging-params';
export { DeliveryReadFilters };

export type DeliveryReadRequest = DeliveryReadFilters & PagingParams;
