import { EventRegistration } from './event-registration-create-request';
export { EventRegistration };

export interface FeaturedEvent {
  id?: number;
  city: string;
  date: Date;
  description: string;
  durationMins?: number;
  postalCode: string;
  registrations?: EventRegistration[];
  showUntil?: Date;
  signupCompleteMsg?: string;
  signupTitle?: string;
  stateProvince: string;
  streetAddress: string;
  title: string;
}
