import { PagingParams } from '../paging-params';
import { SortOptions } from '../sort-options';
import { FeaturedEventFilters } from './featured-event-filters';
export { FeaturedEventFilters };

export interface FeaturedEventRequest extends FeaturedEventFilters, PagingParams, SortOptions<FeaturedEventSortBy> {}

export type FeaturedEventSortBy = 'date';
