import { PagingParams } from '../paging-params';
import { SortOptions } from '../sort-options';
import { AccountReadFilters } from './account-read-filters';
export { AccountReadFilters };

export interface AccountReadRequest extends AccountReadFilters, PagingParams, SortOptions<AccountSortBy> {}

export type AccountSortBy = 'email' | 'name' | 'username';
