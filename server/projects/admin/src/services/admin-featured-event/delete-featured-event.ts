import { EventRegistrationEntity } from 'database/src/entity/event-registration.entity';
import { FeaturedEventEntity } from 'database/src/entity/featured-event.entity';
import { getOrmRepository, OrmEntityManager } from '~orm/index';

export async function deleteFeaturedEvent(featuredEventId: number): Promise<FeaturedEventEntity> {
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
