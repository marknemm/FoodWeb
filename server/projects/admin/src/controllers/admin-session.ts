import express = require('express');
import { Request, Response } from 'express';
import { adminLogin } from '~admin/services/admin-session/admin-login';
import { adminSaveImpersonationToken } from '~admin/services/admin-session/admin-save-impersonation-token';
import { ImpersonateTokenResponse, LoginRequest, LoginResponse } from '~shared';
import { handleDeleteSession, handleGetSession } from '~web/controllers/session';
import { genErrorResponse } from '~web/middlewares/response-error.middleware';
import { AccountEntity } from '~entity';

export const router = express.Router();

// Use web session controller route handler.
router.get('/', handleGetSession);

router.get('/impersonate-token/:id', handleGetImpersonateToken);
function handleGetImpersonateToken(req: Request, res: Response) {
  const accountId: number = Number.parseInt(req.params.id, 10);
  adminSaveImpersonationToken(accountId, req.session['account'])
    .then((impersonateTokenResponse: ImpersonateTokenResponse) => res.send(impersonateTokenResponse))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/', handlePostSession);
function handlePostSession(req: Request, res: Response) {
  const loginRequest: LoginRequest = req.body;
  adminLogin(loginRequest)
    .then((loginResponse: LoginResponse) => {
      // Set session on request object.
      req.session.account = <AccountEntity>loginResponse.account;
      res.send(loginResponse);
    }).catch(genErrorResponse.bind(this, res));
}

// Use web session controller route handler.
router.delete('/', handleDeleteSession);
