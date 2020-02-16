import { plainToClass } from 'class-transformer';
import { EventRegistrationEntity } from '../../entity/event-registration.entity';
import { getOrmRepository, OrmEntityManager } from '../../helpers/database/orm';
import { FoodWebError } from '../../helpers/response/food-web-error';
import { EventRegistration } from '../../shared';

/**
 * Saves a registration for a featured event.
 * @param registration The featured event registration that is to be saved.
 * @return A promise that resolves to the saved event registration.
 * @throws FoodWebError if the given registration is a duplicate, and shall not be re-saved.
 */
export async function saveEventRegistration(registration: EventRegistration): Promise<EventRegistrationEntity> {
  const registrationToSave: EventRegistrationEntity = plainToClass(EventRegistrationEntity, registration);
  await _ensureNotAlreadyRegistered(registrationToSave);
  return OrmEntityManager.transaction((manager: OrmEntityManager) => {
    return manager.getRepository(EventRegistrationEntity).save(registrationToSave);
  });
}

/**
 * Prevents duplicate event registration by searching for a given registration.
 * @param registration The featured event registration to check for.
 * @return A promise that resolves to void if the given registration was not found.
 * @throws FoodWebError if a duplicate event registration has been found.
 */
async function _ensureNotAlreadyRegistered(registration: EventRegistrationEntity): Promise<void> {
  const foundRegistration: EventRegistrationEntity = await getOrmRepository(EventRegistrationEntity).findOne({
    featuredEvent: registration.featuredEvent,
    fullName: registration.fullName
  });
  if (foundRegistration) {
    throw new FoodWebError('You have already registered for this event. See you there!');
  }
}
