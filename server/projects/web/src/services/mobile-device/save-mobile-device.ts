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
  return getConnection().transaction((manager: EntityManager) => {
    return manager.getRepository(MobileDeviceEntity).save(mobileDeviceToSave);
  });
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
