import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity } from 'database/src/entity/account.entity';
import { PasswordResetEntity } from 'database/src/entity/password-reset';
import { UnverifiedAccountEntity } from 'database/src/entity/unverified-account.entity';
import { QueryResult } from '~orm/index';
import { genListResponse } from '~web/helpers/response/list-response';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { ensureSessionActive } from '~web/middlewares/session.middleware';
import { recreateUnverifiedAccount, verifyAccount } from '~web/services/account/account-verification';
import { sendAccountVerificationEmail, sendAccountVerificationMessage } from '~web/services/account/account-verification-message';
import { readAccount, readAccounts } from '~web/services/account/read-accounts';
import { createAccount, NewAccountData, updateAccount, updateAccountSection } from '~web/services/account/save-account';
import { sendUsernameRecoveryEmail } from '~web/services/account/username-recovery-message';
import { AuditEventType, saveAudit, saveUpdateAudit } from '~web/services/audit/save-audit';
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '~web/services/password/password-reset-message';
import { updatePassword } from '~web/services/password/save-password';
import { resetPassword, savePasswordResetToken } from '~web/services/password/save-password-reset';
import { Account, AccountCreateRequest, AccountReadRequest, AccountSectionUpdateReqeust, AccountUpdateRequest, AccountVerificationRequest, PasswordResetRequest, PasswordUpdateRequest } from '~shared';

const router = express.Router();

router.post('/verify', (req: Request, res: Response) => {
  const account: AccountEntity = (req.session ? req.session.account : null);
  const verificationReq: AccountVerificationRequest = req.body;
  verifyAccount(account, verificationReq)
    .then(_handleAccountVerificationResult.bind(this, req, res))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((account: AccountEntity) => saveAudit(AuditEventType.VerifyAccount, account, account, verificationReq.recaptchaScore))
    .catch((err: Error) => console.error(err));
});

router.post('/', (req: Request, res: Response) => {
  const createRequest: AccountCreateRequest = req.body;
  createAccount(createRequest)
    .then((newAccountData: NewAccountData) => sendAccountVerificationMessage(newAccountData))
    .then((account: AccountEntity) => { res.send(account); return account; })
    .catch(genErrorResponseRethrow.bind(this, res))    
    .then((account: AccountEntity) => saveAudit(AuditEventType.Signup, account, account, createRequest.recaptchaScore))
    .catch((err: Error) => console.error(err));
});

router.put('/section', ensureSessionActive, (req: Request, res: Response) => {
  const updateReq: AccountSectionUpdateReqeust = req.body;
  updateAccountSection(updateReq, req.session.account)
    .then(_handleAccountSaveResult.bind(this, req, res))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((accountDiff: UpdateDiff<AccountEntity>) =>
      saveUpdateAudit(AuditEventType.UpdateAccount, accountDiff.new, accountDiff, updateReq.recaptchaScore)
    )
    .catch((err: Error) => console.error(err));
});

router.put('/password', ensureSessionActive, (req: Request, res: Response) => {
  const myAccount: AccountEntity = req.session.account;
  const updateReq: PasswordUpdateRequest = req.body;
  updatePassword(updateReq, myAccount)
    .then(() => res.send({}))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then(() => saveUpdateAudit(AuditEventType.UpdatePassword, myAccount, { old: 'xxx', new: 'xxx' }, updateReq.recaptchaScore))
    .catch((err: Error) => console.error(err));
});

router.put('/reset-password/', (req: Request, res: Response) => {
  const resetReq: PasswordResetRequest = req.body;
  resetPassword(resetReq)
    .then((account: AccountEntity) => { res.send(account); return account; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((account: AccountEntity) => sendPasswordResetSuccessEmail(account))
    .then(async (account: AccountEntity) => {
      await saveUpdateAudit(AuditEventType.ResetPassword, account, { old: 'xxx', new: 'xxx' }, resetReq.recaptchaScore);
      return account;
    })
    .catch((err: Error) => console.error(err));
});

router.put('/', ensureSessionActive, (req: Request, res: Response) => {
  const updateReq: AccountUpdateRequest = req.body;
  updateAccount(updateReq, req.session.account)
    .then(_handleAccountSaveResult.bind(this, req, res))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((accountDiff: UpdateDiff<AccountEntity>) =>
      saveUpdateAudit(AuditEventType.UpdateAccount, accountDiff.new, accountDiff, updateReq.recaptchaScore)
    )
    .catch((err: Error) => console.error(err));
});

router.get('/recover-username', (req: Request, res: Response) => {
  const email: string = req.query.email;
  readAccounts({ email, page: 0, limit: 1000 }, null)
    .then((queryResult: QueryResult<AccountEntity>) => sendUsernameRecoveryEmail(queryResult.entities))
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
});

router.get('/reset-password', (req: Request, res: Response) => {
  const usernameEmail: string = req.query.usernameEmail;
  savePasswordResetToken(usernameEmail)
    .then((passwordResetEntity: PasswordResetEntity) =>
      sendPasswordResetEmail(passwordResetEntity.account, passwordResetEntity.resetToken)
    )
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
});

router.get('/resend-verification-email', ensureSessionActive, (req: Request, res: Response) => {
  const account: AccountEntity = req.session.account;
  recreateUnverifiedAccount(account)
    .then((unverifiedAccount: UnverifiedAccountEntity) => sendAccountVerificationEmail(account, unverifiedAccount))
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
});

router.get('/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const myAccount: Account = (req.session ? req.session.account : null);
  readAccount(id, myAccount)
    .then((account: AccountEntity) => res.send(account))
    .catch(genErrorResponse.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: AccountReadRequest = req.query;
  const myAccount: Account = (req.session ? req.session.account : null);
  readAccounts(readRequest, myAccount)
    .then((queryResult: QueryResult<AccountEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
});

function _handleAccountSaveResult(req: Request, res: Response, accountUpdtDiff: UpdateDiff<AccountEntity>): UpdateDiff<AccountEntity> {
  const account: AccountEntity = accountUpdtDiff.new;
  const curSessionAccount: Account = req.session.account;
  // If the saved account is the current user's account (new or updated).
  if (curSessionAccount && curSessionAccount.id === account.id) {
    account.verified = curSessionAccount.verified; // Prevent account verification from being overwritten.
  }
  req.session.account = account;
  res.send(account);
  return accountUpdtDiff;
}

function _handleAccountVerificationResult(req: Request, res: Response, account: AccountEntity): AccountEntity {
  const curSessionAccount: Account = req.session.account;
  if (curSessionAccount && curSessionAccount.id === account.id) {
    curSessionAccount.verified = account.verified;
  }
  res.send(account);
  return account;
}

module.exports = router;
