import { AccountReadFilters } from './account-read-filters';
import { PagingParams } from './paging-params';
export { AccountReadFilters };

export type AccountReadRequest = AccountReadFilters & PagingParams;
