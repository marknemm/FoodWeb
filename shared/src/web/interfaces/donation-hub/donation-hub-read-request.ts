import { ReadRequest } from '../read-request';

export interface DonationHubReadRequest extends ReadRequest<DonationHubSortBy> {
  id?: number;
}

export type DonationHubSortBy = 'dropOffWindowStart';
