import { plainToClass } from 'class-transformer';
import { EntityManager, getConnection } from 'typeorm';
import { uuidV5 } from 'uuid';
import { AccountEntity, MobileDevice, MobileDeviceEntity } from '~entity';

/**
 * Saves given mobile device data to the database.
 * @param mobileDevice The mobile device data to save.
 * @param account The account associated with the mobile device data to save.
 * @returns A promise that resolves to the saved mobile device data.
 */
export function saveMobileDevice(mobileDevice: MobileDevice, account: AccountEntity): Promise<MobileDeviceEntity> {
  const mobileDeviceToSave: MobileDeviceEntity = plainToClass(MobileDeviceEntity, mobileDevice);
  mobileDeviceToSave.accountId = account.id;
  _fillUuidIfMissing(mobileDeviceToSave, account);
  return getConnection().transaction((manager: EntityManager) =>
    manager.getRepository(MobileDeviceEntity).save(mobileDeviceToSave)
  );
}

/**
 * Saves a given push registration ID to a given mobile device entity.
 * @param pushRegistrationId The push registration ID to save.
 * @param mobileDevice The mobile device to save the push registration ID to.
 * @returns A promise that resolves to the mobile device with push registration ID saved.
 */
export function savePushRegistration(pushRegistrationId: string, mobileDevice: MobileDeviceEntity): Promise<MobileDeviceEntity> {
  const mobileDeviceToSave: MobileDeviceEntity = plainToClass(MobileDeviceEntity, mobileDevice);
  mobileDeviceToSave.pushRegistrationId = pushRegistrationId;
  return getConnection().transaction((manager: EntityManager) =>
    manager.getRepository(MobileDeviceEntity).save(mobileDeviceToSave)
  );
}

/**
 * Fills any missing uuid for a given mobile device with an auto-generated one.
 * @param mobileDevice The mobile device to potentially fill the uuid for.
 * @param account The account associated with the mobile device.
 */
function _fillUuidIfMissing(mobileDevice: MobileDeviceEntity, account: AccountEntity): void {
  if (!mobileDevice.uuid) {
    mobileDevice.uuid = uuidV5(`https://www.wnyfoodweb.com/${account.id}`, uuidV5.URL);
  }
}
