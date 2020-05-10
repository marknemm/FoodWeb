import { FeaturedEventEntity } from '~entity';
import { getOrmRepository } from '~orm';

/**
 * Reads featured event and its registrations from the database.
 * @param featuredEventId The ID of the featured event for which to retrieve associated registrations.
 * @return A promise that resolves to the featured event with its registrations loaded.
 */
export function readEventRegistrations(featuredEventId: number): Promise<FeaturedEventEntity> {
  return getOrmRepository(FeaturedEventEntity).findOne({
    where: { featuredEvent: { id: featuredEventId } },
    relations: ['registrations']
  });
}
