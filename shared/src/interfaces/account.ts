import { OperationHours } from "./operation-hours";
export { OperationHours };

export type AccountType = 'Donor' | 'Receiver';
export const AccountTypes: AccountType[] = ['Donor', 'Receiver'];

export interface Account {
  accountId: number;
  accountType: AccountType;
  email: string;
  organizationName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  operationHours: OperationHours[];
  additionalInfo?: string;
}
