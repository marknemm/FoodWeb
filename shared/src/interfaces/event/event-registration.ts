import { FeaturedEvent } from './featured-event';

export interface EventRegistration {
  id?: number;
  accountId?: number;
  email: string;
  featuredEvent: FeaturedEvent;
  fullName: string;
  phoneNumber: string;
  timezone: string;
}
