import { Account, ContactInfo } from '../account/account';
import { Delivery } from '../delivery/delivery';
import { DonationClaim } from '../donation-claim/donation-claim';
export { Account, Delivery, DonationClaim };

/**
 * A donation.
 */
export interface Donation {
  /**
   * The (database) ID of the donation.
   */
  id?: number;
  /**
   * The account of the donor.
   */
  donorAccount: Account;
  /**
   * Contact information overrides for the donor.
   * May or may not be equivalent to donor's original contact info.
   */
  donorContactOverride?: ContactInfo;
  /**
   * A receiving organization's claim to the Donation.
   * Should be null/undefined if the Donation is in the 'Unmatched' state.
   */
  claim?: DonationClaim;
  /**
   * The last name of the individual submitting the donation.
   */
  donorLastName: string;
  /**
   * The first name of the individual submitting the donation.
   */
  donorFirstName: string;
  /**
   * The type of the donation.
   */
  donationType: string;
  /**
   * A description of the donation.
   */
  description: string;
  /**
   * The estimated monetary value of the donation.
   */
  estimatedValue?: number;
  /**
   * The estimated number of people that the donation will feed.
   */
  estimatedNumFeed: number;
  /**
   * The start time of the donation's pickup window.
   */
  pickupWindowStart: Date;
  /**
   * The end time of the donation's pickup window.
   */
  pickupWindowEnd: Date;
  /**
   * The current status of the donation.
   */
  donationStatus: DonationStatus;
  /**
   * Whether or not the donation status is 'Complete'.
   * NOTE: Will be updated via database trigger when the value of donationStatus is updated.
   * This field is only here to address of short-coming of TypeORM. We wish to sort donations that are completed last sometimes,
   * but TypeORM does not properly sort on an expression such as `"Donation"."donationStatus" = 'Complete'`. So, to account for this,
   * this field has been created to basically store the result of such an expression.
   */
  complete: boolean;
  /**
   * The time of the most recent update. If the donationStatus is 'Complete', then this is garunteed to be the completion/delivery time.
   */
  updateTimestamp?: Date;
  /**
   * The time when the donation was originally created.
   */
  createTimestamp?: Date;
}

export const DONATION_TYPES = ['Food', 'Merchandise', 'Cash', 'Service', 'Other'];

export enum DonationStatus {
  Unmatched = 'Unmatched',
  Matched = 'Matched',
  Scheduled = 'Scheduled',
  Started = 'Started',
  PickedUp = 'Picked Up',
  Complete = 'Complete'
}

export const DONATION_STATUSES: DonationStatus[] = [
  DonationStatus.Unmatched,
  DonationStatus.Matched,
  DonationStatus.Scheduled,
  DonationStatus.Started,
  DonationStatus.PickedUp,
  DonationStatus.Complete
];
