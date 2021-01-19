import { Account } from '../account';

/**
 * A donation pledge made by volunteers/donors that will drop-off food at intermediate donation hubs.
 */
export interface DonationHubPledge {
  id?: number;
  account?: Account;
  foodType: string;
  foodCount: number;
  createTimestamp?: Date;
  updateTimestamp?: Date;
}
