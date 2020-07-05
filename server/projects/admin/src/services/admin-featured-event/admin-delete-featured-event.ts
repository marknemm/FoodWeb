import { EventRegistrationEntity } from '~entity';
import { FeaturedEventEntity } from '~entity';
import { getOrmRepository, OrmEntityManager } from '~orm';

/**
 * Deletes a featured event based off of a given ID.
 * @param featuredEventId The ID of the featured event.
 * @return A promise that resolves to the deleted featured event.
 */
export async function adminDeleteFeaturedEvent(featuredEventId: number): Promise<FeaturedEventEntity> {
  const deletedFeaturedEvent: FeaturedEventEntity = await getOrmRepository(FeaturedEventEntity).findOne({ id: featuredEventId });

  // Assume that we will never have more than on the order of 100 people registered for an event.
  deletedFeaturedEvent.registrations = await getOrmRepository(EventRegistrationEntity).find({
    featuredEvent: { id: featuredEventId }
  });

  await OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    await manager.getRepository(EventRegistrationEntity).delete({ featuredEvent: deletedFeaturedEvent });
    await manager.getRepository(FeaturedEventEntity).delete(deletedFeaturedEvent);
  });

  return deletedFeaturedEvent;
}
