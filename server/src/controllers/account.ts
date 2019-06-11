import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { AccountEntity } from './../entity/account.entity';
import { createAccount, updateAccount, updatePassword } from '../models/save-account';
import { readAccounts, AccountsQueryResult, readAccount } from '../models/read-accounts';
import { verifyAccount, resendVerificationEmail } from '../models/account-verification';
import { savePasswordResetToken, resetPassword } from '../models/password-reset';
import { AccountCreateRequest, Account } from '../../../shared/src/interfaces/account/account-create-request';
import { PasswordUpdateRequest } from '../../../shared/src/interfaces/account/password-update-request';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { PasswordResetRequest } from '../../../shared/src/interfaces/account/password-reset-request';
import { genListResponse } from '../helpers/list-response';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const createRequest: AccountCreateRequest = req.body;
  createAccount(createRequest.account, createRequest.password)
    .then(_handleAccountSaveResult.bind(this, req, res))
    .catch(handleError.bind(this, res));
});

router.post('/verify', (req: Request, res: Response) => {
  const account: AccountEntity = (req.session ? req.session.account : null);
  const verificationToken: string = req.body.verificationToken;
  verifyAccount(account, verificationToken)
    .then(_handleAccountVerificationResult.bind(this, req, res))
    .catch(handleError.bind(this, res));
});

router.put('/', ensureSessionActive, (req: Request, res: Response) => {
  const account: Account = req.body;
  updateAccount(req.session.account, account)
    .then(_handleAccountSaveResult.bind(this, req, res))
    .catch(handleError.bind(this, res));
});

router.put('/password', ensureSessionActive, (req: Request, res: Response) => {
  const updateRequest: PasswordUpdateRequest = req.body;
  updatePassword(req.session.account, updateRequest.password, updateRequest.oldPassword)
    .then(() => res.send({}))
    .catch(handleError.bind(this, res));
});

router.put('/reset-password/', (req: Request, res: Response) => {
  const resetRequest: PasswordResetRequest = req.body;
  resetPassword(resetRequest.username, resetRequest.password, resetRequest.resetToken)
    .then((account: AccountEntity) => res.send(account))
    .catch(handleError.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: AccountReadRequest = req.query;
  const myAccount: Account = (req.session ? req.session.account : null);
  readAccounts(readRequest, myAccount)
    .then(({ accounts, totalCount }: AccountsQueryResult) =>
      res.send(genListResponse(accounts, totalCount, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.get('/reset-password', (req: Request, res: Response) => {
  const username: string = req.query.username;
  savePasswordResetToken(username)
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

router.get('/resend-verification-email', ensureSessionActive, (req: Request, res: Response) => {
  resendVerificationEmail(req.session.account)
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

router.get('/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const myAccount: Account = (req.session ? req.session.account : null);
  readAccount(id, myAccount)
    .then((account: AccountEntity) => res.send(account))
    .catch(handleError.bind(this, res));
});

function _handleAccountSaveResult(req: Request, res: Response, account: AccountEntity): void {
  const curSessionAccount: Account = req.session.account;
  // If the saved account is the current user's account (new or updated).
  if (curSessionAccount && curSessionAccount.id === account.id) {
    account.verified = curSessionAccount.verified; // Prevent account verification from being overwritten.
  }
  req.session.account = account;
  res.send(account);
}

function _handleAccountVerificationResult(req: Request, res: Response, account: AccountEntity): void {
  const curSessionAccount: Account = req.session.account;
  if (curSessionAccount && curSessionAccount.id === account.id) {
    curSessionAccount.verified = account.verified;
  }
  res.send(account);
}

module.exports = router;
