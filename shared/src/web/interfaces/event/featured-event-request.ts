import { ReadRequest } from '../read-request';

export interface FeaturedEventRequest extends ReadRequest<FeaturedEventSortBy> {
  includePastEvents?: boolean;
}

export type FeaturedEventSortBy = 'date';
