import { DonationSortBy } from '../donation';
import { PagingParams } from '../paging-params';
import { SortOptions } from '../sort-options';
import { DeliveryFilters } from './delivery-filters';

export interface DeliveryReadRequest extends DeliveryFilters, PagingParams, SortOptions<DeliverySortBy> {}

export type DeliverySortBy = DonationSortBy;
