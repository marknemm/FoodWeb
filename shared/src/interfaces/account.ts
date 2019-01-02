import { Organization } from './organization';
import { ContactInfo } from './contact-info';
import { OperationHours } from './operation-hours';
export { OperationHours, ContactInfo, Organization };

export type AccountType = 'Donor' | 'Receiver';

export interface Account {
  id?: number;
  accountType: AccountType;
  username: string;
  contactInfo: ContactInfo;
  organization?: Organization;
  operationHours: OperationHours[];
  verified?: boolean;
}
