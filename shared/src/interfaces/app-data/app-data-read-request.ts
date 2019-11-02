import { AppDataReadFilters } from './app-data-read-filters';
import { PagingParams } from '../notification/notification-read-request';
export { AppDataReadFilters };

export interface AppDataReadRequest extends AppDataReadFilters, PagingParams {}
