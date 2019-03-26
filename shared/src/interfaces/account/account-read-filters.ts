import { AccountType } from './account';

export interface AccountReadFilters {
  id?: number;
  username?: string;
  accountType?: AccountType;
  email?: string;
  organizationName?: string;
}
