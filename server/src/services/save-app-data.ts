import { getConnection, EntityManager } from 'typeorm';
import uuidv5 = require('uuid/v5');
import { AppDataEntity, AppData } from '../entity/app-data.entity';
import { AccountEntity } from '../entity/account.entity';

export function saveAppData(appData: AppData, account: AccountEntity): Promise<AppDataEntity> {
  (<AppDataEntity>appData).accountId = account.id;
  _fillUuidIfMissing(appData, account);
  return getConnection().transaction((manager: EntityManager) => {
    return manager.getRepository(AppDataEntity).save(appData);
  });
}

function _fillUuidIfMissing(appData: AppData, account: AccountEntity): void {
  if (!appData.deviceUuid) {
    appData.deviceUuid = uuidv5(`https://www.wnyfoodweb.com/${account.id}`, uuidv5.URL);
  }
}