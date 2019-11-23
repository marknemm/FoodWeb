import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity } from '../entity/account.entity';
import { AppDataEntity } from '../entity/app-data.entity';
import { handleError } from '../middlewares/response-error.middleware';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { deleteAppData } from '../services/delete-app-data';
import { readAccount } from '../services/read-accounts';
import { saveAppData } from '../services/save-app-data';
import { AuditEventType, saveAudit } from '../services/save-audit';
import { AppDataSaveRequest } from '../shared';

const router = express.Router();

router.post('/', ensureSessionActive, (req: Request, res: Response) => {
  const saveReq: AppDataSaveRequest = req.body;
  const account: AccountEntity = req.session.account;
  saveAppData(saveReq.appData, account)
    .then((appData: AppDataEntity) => saveAudit(AuditEventType.SaveAppData, account, appData, saveReq.recaptchaScore))
    .then((appData: AppDataEntity) => res.send(appData))
    .catch(handleError.bind(this, res));
});

router.delete('/:accountId/:deviceUuid', async (req: Request, res: Response) => {
  const accountId: number = parseInt(req.params.accountId, 10);
  const deviceUuid: string = req.params.deviceUuid;
  // Need to read account from database since user will be logged out at this point.
  const account: AccountEntity = await readAccount(accountId);
  deleteAppData(accountId, deviceUuid)
    .then((appData: AppDataEntity) => saveAudit(AuditEventType.RemoveAppData, account, appData))
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

module.exports = router;