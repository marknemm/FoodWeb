import { ReadRequest } from '../read-request';

export interface DonationHubPledgeReadRequest extends ReadRequest<DonationHubPledgeSortBy> {
  id?: number;
}

export type DonationHubPledgeSortBy = 'createTimestamp';
