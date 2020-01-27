import { PagingParams } from '../paging-params';
import { DonationStatus } from './donation';

export interface DonationReadRequest extends PagingParams {
  /**
   * The ID of the donation.
   */
  id?: number;
  /**
   * The status of the donation.
   */
  donationStatus?: DonationStatus | string;
  /**
   * Filters for associated donors' accounts.
   */
  donorAccountId?: number;
  /**
   * Filters by donation donor's organization name.
   */
  donorOrganizationName?: string;
  /**
   * Filters for associated receivers' accounts.
   */
  receiverAccountId?: number;
  /**
   * Filters for associated deliverers' accounts.
   */
  delivererAccountId?: number;
  /**
   * The last name of the person who submitted the donation.
   */
  donorLastName?: string;
  /**
   * The first name of the person who submitted the donation.
   */
  donorFirstName?: string;
  /**
   * The delivery window start date-time for donation overlap.
   * Filters for all donations with a deliveryWindowEnd value that is at or later than the filter value.
   */
  deliveryWindowOverlapStart?: Date;
  /**
   * The delivery window end time for donation overlap.
   * Filters for all donations with a deliveryWindowStart value that is at or earlier than the filter value.
   */
  deliveryWindowOverlapEnd?: Date;
  /**
   * The earliest date-time that a filtered donation's deliveryWindowStart can be.
   */
  earliestDeliveryWindowStart?: Date;
  /**
   * The latest date-time that a filtered donation's deliveryWindowStart can be.
   */
  latestDeliveryWindowStart?: Date;
  /**
   * The type of the donation.
   */
  donationType?: string;
  /**
   * If true, then only expired donations will come back. If false, then no expired donations will come back.
   */
  expired?: string;
  /**
   * Set to true if filtering donations belonging to current user.
   */
  myDonations?: boolean;
  /**
   * The donation field to sort by.
   */
  sortBy?: string;
  /**
   * The order by which to sort the 'sortBy' donation field.
   */
  sortOrder?: 'ASC' | 'DESC';
}
