import { DonationReadFilters } from './donation-read-filters';
import { DonationReadSort } from './donation-read-sort';
import { PagingParams } from '../paging-params';
export { DonationReadFilters, DonationReadSort };

export type DonationReadRequest = DonationReadFilters & DonationReadSort & PagingParams;
