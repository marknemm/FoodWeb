import express = require('express');
import { Request, Response } from 'express';
import { adminUpdateAccount, adminUpdateAccountSection } from '~admin/services/admin-account/admin-save-account';
import { Account, AccountEntity } from '~entity/account.entity';
import { QueryResult } from '~orm/index';
import { AccountReadRequest, AccountSectionUpdateReqeust, AccountUpdateRequest } from '~shared';
import { genListResponse } from '~web/helpers/response/list-response';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { readFullAccounts } from '~web/services/account/read-accounts';
import { AuditEventType, saveUpdateAudit } from '~web/services/audit/save-audit';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const readRequest: AccountReadRequest = req.query;
  const myAccount: Account = (req.session ? req.session.account : null);
  readFullAccounts(readRequest, myAccount)
    .then((queryResult: QueryResult<AccountEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
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
