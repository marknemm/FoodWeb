import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { AppDataEntity } from '../entity/app-data.entity';
import { AccountEntity } from '../entity/account.entity';
import { saveAppData } from '../services/save-app-data';
import { deleteAppData } from '../services/delete-app-data';
import { readAccount } from '../services/read-accounts';
import { saveAudit, AuditEventType } from '../services/save-audit';
import { AppDataSaveRequest } from '../../../shared/src/interfaces/app-data/app-data-save-request';

const router = express.Router();

router.post('/', ensureSessionActive, (req: Request, res: Response) => {
  const saveReq: AppDataSaveRequest = req.body;
  const account: AccountEntity = req.session.account;
  saveAppData(saveReq.appData, account)
    .then((appData: AppDataEntity) => saveAudit(AuditEventType.SaveAppData, account, appData, saveReq.recaptchaScore))
    .then(() => res.send())
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
