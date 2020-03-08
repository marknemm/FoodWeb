import express = require('express');
import { Request, Response } from 'express';
import { adminUpdateAccount, adminUpdateAccountSection } from '~admin/services/admin-account/admin-save-account';
import { sendMessage, testMessage } from '~admin/services/admin-account/send-message-to-accounts';
import { Account, AccountEntity } from '~entity/account.entity';
import { QueryResult } from '~orm/index';
import { AccountReadFilters, AccountReadRequest, AccountSectionUpdateReqeust, AccountUpdateRequest, SendMessageRequest, PasswordUpdateRequest } from '~shared';
import { genListResponse } from '~web/helpers/response/list-response';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { readFullAccount, readFullAccounts } from '~web/services/account/read-accounts';
import { AuditEventType, saveUpdateAudit } from '~web/services/audit/save-audit';
import { adminUpdatePassword } from '~admin/services/admin-password/save-password';

const router = express.Router();

router.get('/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const myAccount: Account = (req.session ? req.session.account : null);
  readFullAccount(id, myAccount)
    .then((account: AccountEntity) => res.send(account))
    .catch(genErrorResponse.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: AccountReadRequest = req.query;
  const myAccount: Account = (req.session ? req.session.account : null);
  readFullAccounts(readRequest, myAccount)
    .then((queryResult: QueryResult<AccountEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
});

router.put('/:id/password', (req: Request, res: Response) => {
  const myAccount: AccountEntity = req.session.account;
  const updateReq: PasswordUpdateRequest = req.body;
  const accountId: number = Number.parseInt(req.params.id, 10);
  adminUpdatePassword(updateReq, accountId)
    .then(() => res.send({}))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then(() => saveUpdateAudit(AuditEventType.UpdatePassword, myAccount, { old: 'xxx', new: 'xxx' }, updateReq.recaptchaScore))
    .catch((err: Error) => console.error(err));
});

router.put('/:id/section', (req: Request, res: Response) => {
  const accountId: number = Number.parseInt(req.params.id, 10);
  const updateReq: AccountSectionUpdateReqeust = req.body;
  adminUpdateAccountSection(accountId, updateReq)
    .then(_handleAccountSaveResult.bind(this, req, res))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((accountDiff: UpdateDiff<AccountEntity>) =>
      saveUpdateAudit(AuditEventType.UpdateAccount, accountDiff.new, accountDiff, updateReq.recaptchaScore)
    )
    .catch((err: Error) => console.error(err));
});

router.put('/:id', (req: Request, res: Response) => {
  const accountId: number = Number.parseInt(req.params.id, 10);
  const updateReq: AccountUpdateRequest = req.body;
  adminUpdateAccount(accountId, updateReq)
    .then(_handleAccountSaveResult.bind(this, req, res))
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((accountDiff: UpdateDiff<AccountEntity>) =>
      saveUpdateAudit(AuditEventType.UpdateAccount, accountDiff.new, accountDiff, updateReq.recaptchaScore)
    )
    .catch((err: Error) => console.error(err));
});

router.post('/send-message', (req: Request, res: Response) => {
  const sendMessageReq: SendMessageRequest = req.body;
  const accountFilters: AccountReadFilters = req.query;
  sendMessage(sendMessageReq, accountFilters, req.session.account)
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
});

router.post('/test-message', (req: Request, res: Response) => {
  const sendMessageReq: SendMessageRequest = req.body;
  testMessage(sendMessageReq, req.session.account)
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
});

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

module.exports = router;
