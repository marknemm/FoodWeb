import { NotificationSettings } from './notification-settings';

export interface GeographyLocation {
  type: string;
  coordinates: [number, number];
}

export interface ContactInfo extends Partial<NotificationSettings> {
  id?: number;
  email: string;
  phoneNumber: string;
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  location?: GeographyLocation;
  timezone?: string;
  enableEmail?: boolean;
  enablePushNotification?: boolean;
  notifyForEachDonation?: boolean;
}
