import { ContactInfo } from './contact-info';
import { OperationHours } from './operation-hours';
import { Organization } from './organization';
import { Volunteer } from './volunteer';
export { ContactInfo, OperationHours, Organization, Volunteer };

export interface Account {
  id?: number;
  accountType: AccountType;
  username: string;
  profileImgUrl: string;
  lastSeenNotificationId?: number;
  contactInfo: ContactInfo;
  operationHours?: OperationHours[];
  organization?: Organization;
  volunteer?: Volunteer;
  verified?: boolean;
}

export enum AccountType {
  Donor = 'Donor',
  Receiver = 'Receiver',
  Volunteer = 'Volunteer'
};

export const ACCOUNT_TYPES: AccountType[] = [
  AccountType.Donor,
  AccountType.Receiver,
  AccountType.Volunteer
];
