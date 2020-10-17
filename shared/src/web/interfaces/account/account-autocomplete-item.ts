import { AccountType } from './account';

export interface AccountAutocompleteItem {
  id?: number;
  accountType: AccountType;
  contactInfo: ContactInfoAutocompleteItem;
  organization?: OrganizationAutocompleteItem;
  volunteer?: VolunteerAutocompleteItem;
}

export interface ContactInfoAutocompleteItem {
  id?: number;
  email: string;
  phoneNumber: string;
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
}

export interface OrganizationAutocompleteItem {
  id?: number;
  name: string;
}

export interface VolunteerAutocompleteItem {
  id?: number;
  firstName: string;
  lastName: string;
}
