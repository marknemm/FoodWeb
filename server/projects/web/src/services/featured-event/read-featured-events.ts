import { FindConditions, MoreThanOrEqual } from 'typeorm';
import { FeaturedEventEntity } from '~entity';
import { getOrmRepository } from '~orm';
import { QueryResult, genSkip, genTake } from '~orm';
import { FeaturedEventFilters, FeaturedEventRequest, FeaturedEventSortBy, SortOptions } from '~shared';

/**
 * Reads a single featured event based off of a given featured event ID.
 * @param featuredEventId The ID of the featured event to retrieve.
 * @return A promsie that resolves to the featured event. Resolves to null/undefined if it could not be found.
 */
export async function readFeaturedEvent(featuredEventId: number): Promise<FeaturedEventEntity> {
  return getOrmRepository(FeaturedEventEntity).findOne({ id: featuredEventId });
}

/**
 * Reads featured events based off of filters, orderings, and paging data found in a given event request.
 * @param eventRequest The featured event request.
 * @return A promise that resolves to the featured event query result.
 */
export async function readFeaturedEvents(eventRequest: FeaturedEventRequest): Promise<QueryResult<FeaturedEventEntity>> {
  const [featuredEvents, totalCount]: [FeaturedEventEntity[], number] = await getOrmRepository(FeaturedEventEntity).findAndCount({
    where: _genFindConditions(eventRequest),
    order: _genOrder(eventRequest),
    skip: genSkip(eventRequest),
    take: genTake(eventRequest, 300)
  });
  return { entities: featuredEvents, totalCount };
}

/**
 * Generates find condition(s) for a given featured event request filter(s).
 * @param filters The featured event request filter(s).
 * @return The generated find condition(s).
 */
function _genFindConditions(filters: FeaturedEventFilters): FindConditions<FeaturedEventEntity> {
  const where: FindConditions<FeaturedEventEntity> = {};
  if (!filters.includePastEvents) {
    where.showUntil = MoreThanOrEqual(new Date());
  }
  return where;
}

/**
 * Generates the order that queired featured events should fall in.
 * @param sortOpts The featured event request sort options.
 * @return The generated order that queried featured events should fall in.
 */
function _genOrder(sortOpts: SortOptions<FeaturedEventSortBy>): { [P in keyof FeaturedEventEntity]?: 'ASC' | 'DESC' } {
  const order: { [P in keyof FeaturedEventEntity]?: 'ASC' | 'DESC' } = {};
  (sortOpts.sortBy)
    ? order[sortOpts.sortBy] = (sortOpts.sortOrder ? sortOpts.sortOrder : 'DESC')
    : order.date = 'DESC';
  return order;
}
