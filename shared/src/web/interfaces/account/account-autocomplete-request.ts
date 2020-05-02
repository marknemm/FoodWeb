import { AccountType } from './account';

export interface AccountAutocompleteRequest {
  fullTextQuery?: string;
  accountType?: AccountType;
}
