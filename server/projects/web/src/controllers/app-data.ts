import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity } from 'database/src/entity/account.entity';
import { AppDataEntity } from 'database/src/entity/app-data.entity';
import { genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { ensureSessionActive } from '~web/middlewares/session.middleware';
import { readAccount } from '~web/services/account/read-accounts';
import { deleteAppData } from '~web/services/app-data/delete-app-data';
import { saveAppData } from '~web/services/app-data/save-app-data';
import { AuditEventType, saveAudit } from '~web/services/audit/save-audit';
import { AppDataSaveRequest } from '~shared';

const router = express.Router();

router.post('/', ensureSessionActive, (req: Request, res: Response) => {
  const saveReq: AppDataSaveRequest = req.body;
  const account: AccountEntity = req.session.account;
  saveAppData(saveReq.appData, account)
    .then((appData: AppDataEntity) => { res.send(appData); return appData; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((appData: AppDataEntity) => saveAudit(AuditEventType.SaveAppData, account, appData, saveReq.recaptchaScore))
    .catch((err: Error) => console.error(err));
});

router.delete('/:accountId/:deviceUuid', async (req: Request, res: Response) => {
  const accountId: number = parseInt(req.params.accountId, 10);
  const deviceUuid: string = req.params.deviceUuid;
  // Need to read account from database since user will be logged out at this point.
  const account: AccountEntity = await readAccount(accountId);
  deleteAppData(accountId, deviceUuid)
    .then((appData: AppDataEntity) => {  res.send(); return appData; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((appData: AppDataEntity) => saveAudit(AuditEventType.RemoveAppData, account, appData))
    .catch((err: Error) => console.error(err));
});

module.exports = router;
