import { Account, AccountType, OperationHours } from './account';

export interface SignupRequest {
  accountType: AccountType;
  email: string;
  password: string;
  organizationName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  operationHours: OperationHours[];
  additionalInfo?: string;
}
