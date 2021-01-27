import { ReadRequest } from '../read-request';

export interface DonationHubPledgeReadRequest extends ReadRequest<DonationHubPledgeSortBy> {
  id?: number;
  donationHubId?: number;
  loadDonationHub?: boolean;
}

export type DonationHubPledgeSortBy = 'createTimestamp';
