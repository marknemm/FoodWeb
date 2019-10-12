import { AccountReadFilters } from './account-read-filters';
import { AccountReadSort } from './account-read-sort';
import { PagingParams } from '../paging-params';
export { AccountReadFilters, AccountReadSort };

export type AccountReadRequest = AccountReadFilters & AccountReadSort & PagingParams;
