import { ContactInfo } from './contact-info';
import { OperationHours } from './operation-hours';
import { Organization } from './organization';
import { Volunteer } from './volunteer';
export { ContactInfo, OperationHours, Organization, Volunteer };

export enum AccountType {
  Donor = 'Donor',
  Receiver = 'Receiver',
  Volunteer = 'Volunteer',
  Admin = 'Admin'
};

export interface Account {
  id?: number;
  accountType: AccountType;
  username: string;
  profileImgUrl: string;
  contactInfo: ContactInfo;
  operationHours?: OperationHours[];
  organization?: Organization;
  volunteer?: Volunteer;
  verified?: boolean;
}
