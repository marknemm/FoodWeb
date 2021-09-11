import { ReadRequest } from '../read-request';

export interface DonationHubReadRequest extends ReadRequest<DonationHubSortBy> {
  /**
   * The ID of the donation hub.
   */
  id?: number;
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
   * Whether or not hubs that are already associated with the current user shall be excluded.
   * A hub is associated with the current user if they are the owner of the hub or if they have pledged a donation to the hub.
   */
  excludePledgedHubs?: boolean;
  /**
   * Whether or not expired donation hubs should be included. Defaults to false.
   * An expired donation hub is one which has had its drop-off window completely pass.
   */
  includeExpired?: boolean;
  /**
   * Whether or not to load the donation pledges belonging to each loaded donation hub. Defaults to false.
   */
  loadPledges?: boolean;
  /**
   * The ID of the volunteer account that owns/created this donation hub.
   */
  volunteerAccountId?: number;
}

export type DonationHubSortBy = 'dropOffWindowStart';
