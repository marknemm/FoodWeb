import { PagingParams } from '../paging-params';
import { NotificationReadFilters } from './notification-read-filters';
export { NotificationReadFilters, PagingParams }

export type NotificationReadRequest = NotificationReadFilters & PagingParams;
