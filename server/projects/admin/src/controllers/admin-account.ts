import express = require('express');
import { Request, Response } from 'express';
import { sendAccountCreateMessages } from '~admin/services/admin-account/account-create-messages';
import { adminReadAccount, adminReadAccounts } from '~admin/services/admin-account/admin-read-accounts';
import { adminCreateAccount, adminUpdateAccount, adminUpdateAccountSection, NewAccountData } from '~admin/services/admin-account/admin-save-account';
import { sendMessage, testMessage } from '~admin/services/admin-account/send-message-to-accounts';
import { adminUpdatePassword } from '~admin/services/admin-password/save-password';
import { Account, AccountEntity } from '~entity';
import { QueryResult } from '~orm';
import { AccountCreateRequest, AccountReadFilters, AccountReadRequest, AccountSectionUpdateReqeust, AccountUpdateRequest, PasswordUpdateRequest, SendMessageRequest } from '~shared';
import { handleGetRecoverUsername, handleGetResendVerificationEmail, handleGetResetPassword, handlePostAccountVerify, handlePutResetPassword } from '~web/controllers/account';
import { genListResponse } from '~web/helpers/response/list-response';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { AuditEventType, saveAudit, saveUpdateAudit } from '~web/services/audit/save-audit';

export const router = express.Router();

router.get('/', handleGetAccounts);
function handleGetAccounts(req: Request, res: Response) {
  const readRequest: AccountReadRequest = req.query;
  const myAccount: Account = (req.session ? req.session.account : null);
  adminReadAccounts(readRequest, myAccount)
    .then((queryResult: QueryResult<AccountEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
}

// Use web account controller route handlers.
router.get('/recover-username', handleGetRecoverUsername);
router.get('/reset-password', handleGetResetPassword);
router.get('/resend-verification-email', handleGetResendVerificationEmail);

router.get('/:id', handleGetAccount);
function handleGetAccount(req: Request, res: Response) {
  const id: number = parseInt(req.params.id, 10);
  const myAccount: Account = (req.session ? req.session.account : null);
  adminReadAccount(id, myAccount)
    .then((account: AccountEntity) => res.send(account))
    .catch(genErrorResponse.bind(this, res));
}

// Use web account controller route handler.
router.post('/verify', handlePostAccountVerify);

router.post('/', handlePostAccount);
function handlePostAccount(req: Request, res: Response) {
  const createReq: AccountCreateRequest = req.body;
  adminCreateAccount(createReq)
    .then((newAccountData: NewAccountData) =>
      sendAccountCreateMessages(createReq.accountCreateOptions, newAccountData, createReq.password)
    )
    .then((account: AccountEntity) => { res.send(account); return account; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((account: AccountEntity) => saveAudit(AuditEventType.Signup, account, account, createReq.recaptchaScore))
    .catch((err: Error) => console.error(err));
}

router.post('/send-message', handlePostAccountMessage);
function handlePostAccountMessage(req: Request, res: Response) {
  const sendMessageReq: SendMessageRequest = req.body;
  const accountFilters: AccountReadFilters = req.query;
  sendMessage(sendMessageReq, accountFilters, req.session.account)
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
}

router.post('/test-message', handlePostAccountTestMessage);
function handlePostAccountTestMessage(req: Request, res: Response) {
  const sendMessageReq: SendMessageRequest = req.body;
  testMessage(sendMessageReq, req.session.account)
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
}

router.put('/:id/section', handlePutAccountSection);
function handlePutAccountSection(req: Request, res: Response) {
  const accountId: number = Number.parseInt(req.params.id, 10);
  const updateReq: AccountSectionUpdateReqeust = req.body;
  adminUpdateAccountSection(accountId, updateReq)
    .then(_handleAccountSaveResult.bind(this, req, res))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((accountDiff: UpdateDiff<AccountEntity>) =>
      saveUpdateAudit(AuditEventType.UpdateAccount, accountDiff.new, accountDiff, updateReq.recaptchaScore)
    )
    .catch((err: Error) => console.error(err));
}

router.put('/:id/password', handlePutPassword);
function handlePutPassword(req: Request, res: Response) {
  const myAccount: AccountEntity = req.session.account;
  const updateReq: PasswordUpdateRequest = req.body;
  const accountId: number = Number.parseInt(req.params.id, 10);
  adminUpdatePassword(updateReq, accountId)
    .then(() => res.send({}))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then(() => saveUpdateAudit(AuditEventType.UpdatePassword, myAccount, { old: 'xxx', new: 'xxx' }, updateReq.recaptchaScore))
    .catch((err: Error) => console.error(err));
}

// Use web account controller route handler.
router.put('/reset-password/', handlePutResetPassword);

router.put('/:id', handlePutAccount);
function handlePutAccount(req: Request, res: Response) {
  const accountId: number = Number.parseInt(req.params.id, 10);
  const updateReq: AccountUpdateRequest = req.body;
  adminUpdateAccount(accountId, updateReq)
    .then(_handleAccountSaveResult.bind(this, req, res))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((accountDiff: UpdateDiff<AccountEntity>) =>
      saveUpdateAudit(AuditEventType.UpdateAccount, accountDiff.new, accountDiff, updateReq.recaptchaScore)
    )
    .catch((err: Error) => console.error(err));
}

function _handleAccountSaveResult(req: Request, res: Response, accountUpdtDiff: UpdateDiff<AccountEntity>): UpdateDiff<AccountEntity> {
  const account: AccountEntity = accountUpdtDiff.new;
  // If the saved account is the current user's account (new or updated).
  if (req.session.account?.id === account.id) {
    account.verified = req.session.account.verified; // Prevent account verification from being overwritten.
    req.session.account = account; // Only update session account if updated account ID matches session account ID.
  }
  res.send(account);
  return accountUpdtDiff;
}
