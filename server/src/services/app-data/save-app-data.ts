import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../../entity/account.entity';
import { AppData, AppDataEntity } from '../../entity/app-data.entity';
import uuidv5 = require('uuid/v5');
import { plainToClass } from 'class-transformer';

export function saveAppData(appData: AppData, account: AccountEntity): Promise<AppDataEntity> {
  const appDataToSave: AppDataEntity = plainToClass(AppDataEntity, appData);
  appDataToSave.accountId = account.id;
  _fillUuidIfMissing(appDataToSave, account);
  return getConnection().transaction((manager: EntityManager) => {
    return manager.getRepository(AppDataEntity).save(appDataToSave);
  });
}

function _fillUuidIfMissing(appData: AppDataEntity, account: AccountEntity): void {
  if (!appData.deviceUuid) {
    appData.deviceUuid = uuidv5(`https://www.wnyfoodweb.com/${account.id}`, uuidv5.URL);
  }
}
