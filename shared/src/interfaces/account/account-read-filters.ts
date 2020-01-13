import { DateTimeRange } from '../date-time/time';
import { AccountType } from './account';

export interface AccountReadFilters {
  id?: number;
  username?: string;
  accountType?: AccountType;
  email?: string;
  organizationName?: string;
  operationHoursRange?: DateTimeRange;
  distanceRangeMi?: number;
  lat?: number;
  lon?: number;
  autoReceiver?: boolean;
}
