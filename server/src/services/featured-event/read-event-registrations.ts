import { EventRegistrationEntity } from '../../entity/event-registration.entity';
import { getOrmRepository } from '../../helpers/database/orm';

/**
 * Reads featured event registrations from the database.
 * @param featuredEventId The ID of the featured event for which to retrieve associated registrations.
 * @return A promise that resolves to the event registration query result.
 */
export function readEventRegistrations(featuredEventId: number): Promise<EventRegistrationEntity[]> {
  return getOrmRepository(EventRegistrationEntity).find({
    where: { featuredEvent: { id: featuredEventId } },
    order: { fullName: 'ASC' }
  });
}
