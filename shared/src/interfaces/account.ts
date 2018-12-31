import { Organization } from './organization';
import { ContactInfo } from './contact-info';
import { OperationHours } from "./operation-hours";
export { OperationHours, ContactInfo, Organization };

export type AccountType = 'Donor' | 'Receiver';

export interface Account {
  accountType: AccountType;
  /**
   * Can be the same as email.
   */
  username: string;
  contactInfo: ContactInfo;
  organization?: Organization;
  operationHours: OperationHours[];
  additionalInfo?: string;
  verified?: boolean;
}
