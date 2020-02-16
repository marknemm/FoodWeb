import { WriteRequest } from '../write-request';
import { FeaturedEvent } from './featured-event';

export interface FeaturedEventCreateRequest extends WriteRequest {
  featuredEvent: FeaturedEvent;
}
