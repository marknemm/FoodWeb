import { DonationReadFilters } from './donation-read-filters';
import { PagingParams } from '../paging-params';
export { DonationReadFilters };

export type DonationReadRequest = DonationReadFilters & PagingParams;
