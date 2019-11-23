import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity } from '../entity/account.entity';
import { PasswordResetEntity } from '../entity/password-reset';
import { UnverifiedAccountEntity } from '../entity/unverified-account.entity';
import { genListResponse } from '../helpers/list-response';
import { QueryResult } from '../helpers/query-builder-helper';
import { UpdateDiff } from '../interfaces/update-diff';
import { handleError } from '../middlewares/response-error.middleware';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { recreateUnverifiedAccount, verifyAccount } from '../services/account-verification';
import { sendAccountVerificationEmail, sendAccountVerificationMessage } from '../services/account-verification-message';
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '../services/password-reset-message';
import { readAccount, readAccounts } from '../services/read-accounts';
import { createAccount, NewAccountData, updateAccount } from '../services/save-account';
import { AuditEventType, saveAudit, saveUpdateAudit } from '../services/save-audit';
import { updatePassword } from '../services/save-password';
import { resetPassword, savePasswordResetToken } from '../services/save-password-reset';
import { sendUsernameRecoveryEmail } from '../services/username-recovery-message';
import { Account, AccountCreateRequest, AccountReadRequest, AccountUpdateRequest, AccountVerificationRequest, PasswordResetRequest, PasswordUpdateRequest } from '../shared';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const createRequest: AccountCreateRequest = req.body;
  createAccount(createRequest)
    .then((newAccountData: NewAccountData) => sendAccountVerificationMessage(newAccountData))
    .then((account: AccountEntity) => saveAudit(AuditEventType.Signup, account, account, createRequest.recaptchaScore))
    .then((account: AccountEntity) => res.send(account))
    .catch(handleError.bind(this, res));
});

router.post('/verify', (req: Request, res: Response) => {
  const account: AccountEntity = (req.session ? req.session.account : null);
  const verificationReq: AccountVerificationRequest = req.body;
  verifyAccount(account, verificationReq)
    .then((account: AccountEntity) => saveAudit(AuditEventType.VerifyAccount, account, account, verificationReq.recaptchaScore))
    .then(_handleAccountVerificationResult.bind(this, req, res))
    .catch(handleError.bind(this, res));
});

router.put('/', ensureSessionActive, (req: Request, res: Response) => {
  const updateReq: AccountUpdateRequest = req.body;
  updateAccount(updateReq, req.session.account)
    .then((accountDiff: UpdateDiff<AccountEntity>) =>
      saveUpdateAudit(AuditEventType.UpdateAccount, accountDiff.new, accountDiff, updateReq.recaptchaScore)
    )
    .then((accountDiff: UpdateDiff<AccountEntity>) => _handleAccountSaveResult(req, res, accountDiff.new))
    .catch(handleError.bind(this, res));
});

router.put('/password', ensureSessionActive, (req: Request, res: Response) => {
  const myAccount: AccountEntity = req.session.account;
  const updateReq: PasswordUpdateRequest = req.body;
  updatePassword(updateReq, myAccount)
    .then(() => saveUpdateAudit(AuditEventType.UpdatePassword, myAccount, { old: 'xxx', new: 'xxx' }, updateReq.recaptchaScore))
    .then(() => res.send({}))
    .catch(handleError.bind(this, res));
});

router.put('/reset-password/', (req: Request, res: Response) => {
  const resetReq: PasswordResetRequest = req.body;
  resetPassword(resetReq)
    .then(async (account: AccountEntity) => {
      await saveUpdateAudit(AuditEventType.ResetPassword, account, { old: 'xxx', new: 'xxx' }, resetReq.recaptchaScore);
      return account;
    })
    .then((account: AccountEntity) => sendPasswordResetSuccessEmail(account))
    .then((account: AccountEntity) => res.send(account))
    .catch(handleError.bind(this, res));
});

router.get('/recover-username', (req: Request, res: Response) => {
  const email: string = req.query.email;
  readAccounts({ email, page: 0, limit: 1000 }, null)
    .then((queryResult: QueryResult<AccountEntity>) => sendUsernameRecoveryEmail(queryResult.entities))
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

router.get('/reset-password', (req: Request, res: Response) => {
  const usernameEmail: string = req.query.usernameEmail;
  savePasswordResetToken(usernameEmail)
    .then((passwordResetEntity: PasswordResetEntity) =>
      sendPasswordResetEmail(passwordResetEntity.account, passwordResetEntity.resetToken)
    )
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

router.get('/resend-verification-email', ensureSessionActive, (req: Request, res: Response) => {
  const account: AccountEntity = req.session.account;
  recreateUnverifiedAccount(account)
    .then((unverifiedAccount: UnverifiedAccountEntity) => sendAccountVerificationEmail(account, unverifiedAccount))
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

router.get('/', (req: Request, res: Response) => {
  const readRequest: AccountReadRequest = req.query;
  const myAccount: Account = (req.session ? req.session.account : null);
  readAccounts(readRequest, myAccount)
    .then((queryResult: QueryResult<AccountEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
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
