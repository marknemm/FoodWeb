import { NotificationSettings } from './notification-settings';

/**
 * Geography (GPS) data for an associated address.
 */
export interface GeographyLocation {
  /**
   * The type of the location. Specific to PostgresSQL, and may be disregarded.
   */
  type: string;
  /**
   * The GPS coordinates of the location with format [`longitude`, `latitude`].
   */
  coordinates: [number, number];
}

/**
 * Contact information that is associated with an account on the platform.
 */
export interface ContactInfo extends Partial<NotificationSettings> {
  /**
   * The auto-generated integer ID of the contact information.
   */
  id?: number;
  /**
   * The account email.
   */
  email: string;
  /**
   * The account phone number.
   */
  phoneNumber: string;
  /**
   * The account owner's street address specifying place of residence if the account type is `Volunteer`.
   * Otherwise, it will be the place of business operation for `Donor` & `Receiver` accounts.
   */
  streetAddress?: string;
  /**
   * The account owner's city.
   */
  city?: string;
  /**
   * The account owner's state/province.
   */
  stateProvince?: string;
  /**
   * The account owner's postal/zip code.
   */
  postalCode?: string;
  /**
   * The account owner's geographical (GPS) location.
   */
  location?: GeographyLocation;
  /**
   * The account owner's timezone based off of place of residence or business operation depending upon account type.
   */
  timezone?: string;
  /**
   * Whether or not email notifications are enabled for the associated account.
   * If disabled, the account will still receive emails related to fundamental account functionality.
   */
  enableEmail?: boolean;
  /**
   * Whether or not push notifications are enabled for the associated account.
   */
  enablePushNotification?: boolean;
  /**
   * Whether or not a receiver or volunteer will receive notifications for each new donation or delivery that may be claimed/scheduled.
   */
  notifyForEachDonation?: boolean;
}
