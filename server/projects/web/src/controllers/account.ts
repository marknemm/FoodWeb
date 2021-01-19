import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity, PasswordResetEntity, UnverifiedAccountEntity } from '~entity';
import { Account, AccountAutocompleteItem, AccountAutocompleteRequest, AccountReadRequest, AccountUpdateRequest, AccountVerificationRequest, ListResponse, PasswordResetRequest, PasswordUpdateRequest, SignupRequest } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { ensureSessionActive } from '~web/middlewares/session.middleware';
import { genAccountAutocomplete } from '~web/services/account/account-autocomplete';
import { recreateUnverifiedAccount, verifyAccount } from '~web/services/account/account-verification';
import { sendAccountVerificationEmail, sendAccountVerificationMessage } from '~web/services/account/account-verification-message';
import { readAccount, readAccounts } from '~web/services/account/read-accounts';
import { createAccount, NewAccountData, updateAccount } from '~web/services/account/save-account';
import { sendUsernameRecoveryEmail } from '~web/services/account/username-recovery-message';
import { AuditEventType, saveAudit, saveUpdateAudit } from '~web/services/audit/save-audit';
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '~web/services/password/password-reset-message';
import { updatePassword } from '~web/services/password/save-password';
import { resetPassword, savePasswordResetToken } from '~web/services/password/save-password-reset';

export const router = express.Router();

router.get('/', handleGetAccounts);
export function handleGetAccounts(req: Request, res: Response) {
  const readRequest: AccountReadRequest = req.query;
  const myAccount: Account = (req.session ? req.session.account : null);
  readAccounts(readRequest, myAccount)
    .then((listRes: ListResponse<AccountEntity>) => res.send(listRes))
    .catch(genErrorResponse.bind(this, res));
}

router.get('/autocomplete', handleGetAccountAutocomplete);
export function handleGetAccountAutocomplete(req: Request, res: Response) {
  const autocompleteRequest: AccountAutocompleteRequest = req.query;
  genAccountAutocomplete(autocompleteRequest)
    .then((accountAutocompleteFeed: AccountAutocompleteItem[]) => res.send(accountAutocompleteFeed))
    .catch(genErrorResponse.bind(this, res));
}

router.get('/recover-username', handleGetRecoverUsername);
export function handleGetRecoverUsername(req: Request, res: Response) {
  const email: string = req.query.email;
  readAccounts({ email, page: 0, limit: 1000 }, null)
    .then((listRes: ListResponse<AccountEntity>) => sendUsernameRecoveryEmail(listRes.list))
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
}

router.get('/reset-password', handleGetResetPassword);
export function handleGetResetPassword(req: Request, res: Response) {
  const usernameEmail: string = req.query.usernameEmail;
  savePasswordResetToken(usernameEmail)
    .then((passwordResetEntity: PasswordResetEntity) =>
      sendPasswordResetEmail(passwordResetEntity.account, passwordResetEntity.resetToken)
    )
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
}

router.get('/resend-verification-email', ensureSessionActive, handleGetResendMyVerificationEmail);
export function handleGetResendMyVerificationEmail(req: Request, res: Response) {
  const account: AccountEntity = req.session.account;
  recreateUnverifiedAccount(account)
    .then((unverifiedAccount: UnverifiedAccountEntity) => sendAccountVerificationEmail(account, unverifiedAccount))
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
}

router.get('/:id', handleGetAccount);
export function handleGetAccount(req: Request, res: Response) {
  const id: number = parseInt(req.params.id, 10);
  const myAccount: Account = (req.session ? req.session.account : null);
  readAccount(id, myAccount)
    .then((account: AccountEntity) => res.send(account))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/verify', handlePostAccountVerify);
export function handlePostAccountVerify(req: Request, res: Response) {
  const account: AccountEntity = (req.session ? req.session.account : null);
  const verificationReq: AccountVerificationRequest = req.body;
  verifyAccount(account, verificationReq)
    .then(_handleAccountVerificationResult.bind(this, req, res))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((verifiedAccount: AccountEntity) =>
      saveAudit(AuditEventType.VerifyAccount, verifiedAccount, verifiedAccount, verificationReq.recaptchaScore)
    )
    .catch((err: Error) => console.error(err));
}

router.post('/', handlePostAccount);
export function handlePostAccount(req: Request, res: Response) {
  const signupRequest: SignupRequest = req.body;
  createAccount(signupRequest)
    .then((newAccountData: NewAccountData) => sendAccountVerificationMessage(newAccountData))
    .then((account: AccountEntity) => { res.send(account); return account; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((account: AccountEntity) => saveAudit(AuditEventType.Signup, account, account, signupRequest.recaptchaScore))
    .catch((err: Error) => console.error(err));
}

router.put('/:id/password', ensureSessionActive, handlePutPassword);
export function handlePutPassword(req: Request, res: Response) {
  const myAccount: AccountEntity = req.session.account;
  const updateReq: PasswordUpdateRequest = req.body;
  updatePassword(updateReq, myAccount)
    .then(() => res.send({}))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then(() => saveUpdateAudit(AuditEventType.UpdatePassword, myAccount, { old: 'xxx', new: 'xxx' }, updateReq.recaptchaScore))
    .catch((err: Error) => console.error(err));
}

router.put('/reset-password/', handlePutResetPassword);
export function handlePutResetPassword(req: Request, res: Response) {
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
}

router.put('/:id', ensureSessionActive, handlePutAccount);
export function handlePutAccount(req: Request, res: Response) {
  const updateReq: AccountUpdateRequest = req.body;
  updateAccount(updateReq, req.session.account)
    .then(_handleAccountSaveResult.bind(this, req, res))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((accountDiff: UpdateDiff<AccountEntity>) =>
      saveUpdateAudit(AuditEventType.UpdateAccount, accountDiff.new, accountDiff, updateReq.recaptchaScore)
    )
    .catch((err: Error) => console.error(err));
}

function _handleAccountSaveResult(req: Request, res: Response, accountUpdtDiff: UpdateDiff<AccountEntity>): UpdateDiff<AccountEntity> {
  const account: AccountEntity = accountUpdtDiff.new;
  // Prevent account verification from being overwritten.
  account.verified = (account.verified ? account.verified : req.session.account?.verified);
  req.session.account = account;
  res.send(account);
  return accountUpdtDiff;
}

function _handleAccountVerificationResult(req: Request, res: Response, account: AccountEntity): AccountEntity {
  req.session.account.verified = account.verified;
  res.send(account);
  return account;
}
