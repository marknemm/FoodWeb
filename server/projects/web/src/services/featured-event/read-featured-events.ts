import { FindConditions, MoreThanOrEqual } from 'typeorm';
import { FeaturedEventEntity } from '~entity';
import { genOrder, genSkip, genTake, getOrmRepository } from '~orm';
import { FeaturedEventRequest } from '~shared';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';

/**
 * Reads a single featured event based off of a given featured event ID.
 * @param featuredEventId The ID of the featured event to retrieve.
 * @return A promise that resolves to the featured event. Resolves to null/undefined if it could not be found.
 */
export async function readFeaturedEvent(featuredEventId: number): Promise<FeaturedEventEntity> {
  return getOrmRepository(FeaturedEventEntity).findOne({ id: featuredEventId });
}

/**
 * Reads featured events based off of filters, orderings, and paging data found in a given event request.
 * @param eventRequest The featured event request.
 * @return A promise that resolves to the featured event query result.
 */
export async function readFeaturedEvents(eventRequest: FeaturedEventRequest): ListResponsePromise<FeaturedEventEntity> {
  const [featuredEvents, totalCount] = await getOrmRepository(FeaturedEventEntity).findAndCount({
    where: _genFindConditions(eventRequest),
    order: genOrder(eventRequest, 'date', 'DESC'),
    skip: genSkip(eventRequest),
    take: genTake(eventRequest, 300)
  });
  return genListResponse(featuredEvents, totalCount, eventRequest);
}

/**
 * Generates find condition(s) for a given featured event request filter(s).
 * @param eventRequest The featured event request filter(s).
 * @return The generated find condition(s).
 */
function _genFindConditions(eventRequest: FeaturedEventRequest): FindConditions<FeaturedEventEntity> {
  const where: FindConditions<FeaturedEventEntity> = {};
  if (!eventRequest.includePastEvents) {
    where.showUntil = MoreThanOrEqual(new Date());
  }
  return where;
}
