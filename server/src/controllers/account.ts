import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { AccountEntity } from './../entity/account.entity';
import { createAccount, updateAccount } from '../models/save-account';
import { getAccounts } from '../models/get-account';
import { verifyAccount } from '../models/account-verification';
import { handleError } from '../helpers/food-web-error';
import { savePasswordResetToken, resetPassword } from '../models/password-reset';
import { AccountCreateRequest } from '../../../shared/src/interfaces/account-create-request';
import { AccountUpdateRequest } from '../../../shared/src/interfaces/account-update-request';
import { AccountReadRequest, AccountReadFilters } from '../../../shared/src/interfaces/account-read-request';
import { PasswordResetRequest } from '../../../shared/src/interfaces/password-reset-request';
import { ListResponse } from '../../../shared/src/interfaces/list-response';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const createRequest: AccountCreateRequest = req.body;
  createAccount(createRequest.account, createRequest.password)
    .then(_handleAccountSave.bind(this, req, res))
    .catch(handleError.bind(this, res));
});

router.put('/', ensureSessionActive, (req: Request, res: Response) => {
  const updateRequest: AccountUpdateRequest = req.body;
  updateAccount(updateRequest.account, updateRequest.password, updateRequest.oldPassword)
    .then(_handleAccountSave.bind(this, req, res))
    .catch(handleError.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: AccountReadRequest = req.query;
  getAccounts(readRequest, readRequest.page, readRequest.limit)
    .then(([accounts, totalCount]: [AccountEntity[], number]) => {
      const response: ListResponse<AccountEntity, AccountReadFilters> = {
        list: accounts,
        totalCount,
        filters: readRequest,
        page: readRequest.page,
        limit: readRequest.limit,
        startRank: (readRequest.page - 1) * readRequest.limit,
        endRank: (readRequest.page - 1) * readRequest.limit + readRequest.limit - 1
      };
      res.send(response);
    })
    .catch(handleError.bind(this, res));
});

router.post('/verify', ensureSessionActive, (req: Request, res: Response) => {
  const account: AccountEntity = req.session.account;
  const verificationToken: string = req.body.verificationToken;
  verifyAccount(account, verificationToken)
    .then(_handleAccountSave.bind(this, req, res))
    .catch(handleError.bind(this, res));
});

router.get('/reset-password', (req: Request, res: Response) => {
  const username: string = req.query.username;
  savePasswordResetToken(username)
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

router.put('/reset-password/', (req: Request, res: Response) => {
  const resetRequest: PasswordResetRequest = req.body;
  resetPassword(resetRequest.username, resetRequest.password, resetRequest.resetToken)
    .then((account: AccountEntity) => res.send(account))
    .catch(handleError.bind(this, res));
});

function _handleAccountSave(req: Request, res: Response, account: AccountEntity): void {
  req.session.account = account;
  res.send(account);
}

module.exports = router;
