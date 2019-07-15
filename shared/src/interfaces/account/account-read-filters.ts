import { AccountType } from './account';
import { DateTimeRange } from '../misc/time';

export interface AccountReadFilters {
  id?: number;
  username?: string;
  accountType?: AccountType;
  email?: string;
  organizationName?: string;
  operationHoursRange?: DateTimeRange;
  distanceRangeMi?: number;
}
