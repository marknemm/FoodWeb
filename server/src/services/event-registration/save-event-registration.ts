import { plainToClass } from 'class-transformer';
import { EntityManager, getConnection } from 'typeorm';
import { EventRegistrationEntity } from '../../entity/event-registration.entity';
import { FoodWebError } from '../../helpers/response/food-web-error';
import { EventRegistration } from '../../shared';

export async function saveEventRegistration(registration: EventRegistration): Promise<EventRegistrationEntity> {
  const registrationToSave: EventRegistrationEntity = plainToClass(EventRegistrationEntity, registration);
  await _ensureNotAlreadyRegistered(registrationToSave);
  return getConnection().transaction((manager: EntityManager) => {
    return manager.getRepository(EventRegistrationEntity).save(registrationToSave);
  });
}

async function _ensureNotAlreadyRegistered(registration: EventRegistrationEntity): Promise<void> {
  const foundRegistration: EventRegistrationEntity = await getConnection().getRepository(EventRegistrationEntity).findOne({
    eventTitleDate: registration.eventTitleDate,
    fullName: registration.fullName
  });
  if (foundRegistration) {
    throw new FoodWebError('You have already registered for this event. See you there!');
  }
}
