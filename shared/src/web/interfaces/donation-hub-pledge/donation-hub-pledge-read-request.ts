import { ReadRequest } from '../read-request';

export interface DonationHubPledgeReadRequest extends ReadRequest<DonationHubPledgeSortBy> {
  /**
   * The ID of the donation hub pledge.
   */
  id?: number;
  /**
   * The ID of the account that has ownership of retrieved donation hub pledges.
   */
  accountId?: number;
  /**
   * The ID of the donation hub that retrieved pledges should belong to.
   */
  donationHubId?: number;
  /**
   * The dropOff window start date-time for donation hub overlap.
   * Filters for all donation hubs with a dropOffWindowEnd value that is at or later than the filter value.
   */
  dropOffWindowOverlapStart?: Date | string;
  /**
   * The dropOff window end time for donation hub overlap.
   * Filters for all donation hubs with a dropOffWindowStart value that is at or earlier than the filter value.
   */
  dropOffWindowOverlapEnd?: Date | string;
  /**
   * Whether or not expired donation hubs should be included. Defaults to false.
   * An expired donation hub is one which has had its drop-off window completely pass.
   */
  includeExpired?: boolean;
  /**
   * Whether or not the parent donation hub should be loaded. Defaults to false.
   */
  loadDonationHub?: boolean;
}

export type DonationHubPledgeSortBy = 'createTimestamp';
