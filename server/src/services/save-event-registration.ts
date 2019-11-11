import { getConnection, EntityManager } from 'typeorm';
import { EventRegistrationEntity } from '../entity/event-registration.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { EventRegistration } from '../shared';

export async function saveEventRegistration(registration: EventRegistration): Promise<EventRegistrationEntity> {
  await _ensureNotAlreadyRegistered(registration);
  return getConnection().transaction((manager: EntityManager) => {
    return manager.getRepository(EventRegistrationEntity).save(registration);
  });
}

async function _ensureNotAlreadyRegistered(registration: EventRegistration): Promise<void> {
  const foundRegistration: EventRegistrationEntity = await getConnection().getRepository(EventRegistrationEntity).findOne({
    eventTitleDate: registration.eventTitleDate,
    fullName: registration.fullName
  });
  if (foundRegistration) {
    throw new FoodWebError('You have already registered for this event. See you there!');
  }
}
