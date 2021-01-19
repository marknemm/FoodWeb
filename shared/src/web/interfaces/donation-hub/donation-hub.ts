import { Account, ContactInfo } from '../account';
import { DonationHubPledge } from '../donation-hub-pledge/donation-hub-pledge';

/**
 * A donation hub, which functions as a volunteer run intermediate drop-off point for donations.
 */
export interface DonationHub {
  id?: number;
  dropOffWindowStart: Date;
  dropOffWindowEnd: Date;
  dropOffInstructions: string;
  contactOverride?: ContactInfo;
  pledges?: DonationHubPledge[];
  receiverAccount?: Account;
  volunteerAccount?: Account;
  /**
   * The time when the donation hub was originally created.
   */
  createTimestamp?: Date;
  /**
   * The time of the most recent update.
   */
  updateTimestamp?: Date;
}
