import { WriteRequest } from '../write-request';
import { FeaturedEvent } from './featured-event';

export interface FeaturedEventUpdateRequest extends WriteRequest {
  featuredEvent: FeaturedEvent;
}
