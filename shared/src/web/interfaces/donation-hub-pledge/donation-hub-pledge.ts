import { Account } from '../account';
import { DonationHub } from '../donation-hub/donation-hub';

/**
 * A donation pledge made by volunteers/donors that will drop-off food at intermediate donation hubs.
 */
export interface DonationHubPledge {
  id?: number;
  account?: Account;
  donationHub?: DonationHub;
  foodType: string;
  foodCount: number;
  createTimestamp?: Date;
  updateTimestamp?: Date;
}
