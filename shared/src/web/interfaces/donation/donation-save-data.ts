import { Account, ContactInfo } from '../account/account';
import { DonationClaim, DonationStatus } from './donation';

/**
 * Represents donation save data input by the user in either a donation (create) form or edit form.
 */
export interface DonationSaveData {
  /**
   * The (database) ID of the donation.
   */
  id?: number;
  /**
   * The current status of the donation.
   */
  donationStatus?: DonationStatus;
  /**
   * The donor account for this donation.
   */
  donorAccount?: Account;
  /**
   * Contact information overrides for the donor.
   * May or may not be equivalent to donor's original contact info.
   */
  donorContactOverride?: ContactInfo;
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
   * The claim a receiver may have on this donation.
   */
  claim?: DonationClaim;
}
