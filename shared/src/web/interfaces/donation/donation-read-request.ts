import { PagingParams } from '../paging-params';
import { SortOptions } from '../sort-options';
import { DonationFilters } from './donation-filters';

export interface DonationReadRequest extends DonationFilters, PagingParams, SortOptions<DonationSortBy> {}

export type DonationSortBy = 'createTimestamp' | 'deliveryWindowStart' | 'donationStatus' | 'donorOrganizationName' | 'receiverOrganizationName';
