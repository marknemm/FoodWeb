import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity } from './../entity/account.entity';
import { createAccount, updateAccount, getAccounts } from '../models/account.model';
import { handleError } from '../helpers/food-web-error';
import { AccountCreateRequest } from './../../../shared/src/interfaces/account-create-request';
import { AccountUpdateRequest } from './../../../shared/src/interfaces/account-update-request';
import { ensureSessionActive } from '../middlewares/session.middleware';

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
    .then(_handleAccountSave.bind(req, res))
    .catch(handleError.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  getAccounts()
    .then((accounts: AccountEntity[]) => res.send(accounts))
    .catch(handleError.bind(this, res));
});

function _handleAccountSave(req: Request, res: Response, account: AccountEntity): void {
  req.session['account'] = account;
  res.send(account);
}

module.exports = router;
