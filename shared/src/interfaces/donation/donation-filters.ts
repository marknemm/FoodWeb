import { DonationStatus } from './donation';

export interface DonationFilters {
  /**
   * The ID of the donation.
   */
  id?: number | string;
  /**
   * The status of the donation.
   */
  donationStatus?: DonationStatus | string;
  /**
   * Filters for associated donors' accounts.
   */
  donorAccountId?: number | string;
  /**
   * Filters by donation donor's organization name.
   */
  donorOrganizationName?: string;
  /**
   * Filters for associated receivers' accounts.
   */
  receiverAccountId?: number | string;
  /**
   * Filters by donation receiver's organization name.
   */
  receiverOrganizationName?: string;
  /**
   * Filters for associated deliverers' accounts.
   */
  delivererAccountId?: number | string;
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
  deliveryWindowOverlapStart?: Date | string;
  /**
   * The delivery window end time for donation overlap.
   * Filters for all donations with a deliveryWindowStart value that is at or earlier than the filter value.
   */
  deliveryWindowOverlapEnd?: Date | string;
  /**
   * The earliest date-time that a filtered donation's deliveryWindowStart can be.
   */
  earliestDeliveryWindowStart?: Date | string;
  /**
   * The latest date-time that a filtered donation's deliveryWindowStart can be.
   */
  latestDeliveryWindowStart?: Date | string;
  /**
   * Filters for all donations with a pickupWindowEnd value that is at or later than the filter value.
   */
  pickupWindowOverlapStart?: Date | string;
  /**
   * Filters for all donations with a pickupWindowStart value that is at or earlier than the filter value.
   */
  pickupWindowOverlapEnd?: Date | string;
  /**
   * The earliest date-time that a filtered donation's pickupWindowStart can be.
   */
  earliestPickupWindowStart?: Date | string;
  /**
   * The latest date-time that a filtered donation's pickupWindowStart can be.
   */
  latestPickupWindowStart?: Date | string;
  /**
   * If 'true', then expired donations will be included. If 'false', then no expired donations will be included.
   * An expired donation is one that has had its pickup window completely pass and has not been scheduled for delivery.
   */
  expired?: boolean | string;
  /**
   * Set to true if filtering donations belonging to current user.
   */
  myDonations?: boolean | string;
}