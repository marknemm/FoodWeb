import express = require('express');
import { Request, Response } from 'express';
import { adminLogin } from '~admin/services/admin-session/admin-login';
import { saveImpersonationToken } from '~admin/services/admin-session/save-impersonation-token';
import { ImpersonateTokenResponse, LoginRequest, LoginResponse } from '~shared';
import { genErrorResponse } from '~web/middlewares/response-error.middleware';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const loginRequest: LoginRequest = req.body;
  adminLogin(loginRequest)
    .then((loginResponse: LoginResponse) => {
      // Set session on request object.
      req.session['account'] = loginResponse.account;
      res.send(loginResponse);
    }).catch(genErrorResponse.bind(this, res));
});

router.get('/impersonate-token/:id', (req: Request, res: Response) => {
  const accountId: number = Number.parseInt(req.params.id, 10);
  saveImpersonationToken(accountId, req.session['account'])
    .then((impersonateTokenResponse: ImpersonateTokenResponse) => res.send(impersonateTokenResponse))
    .catch(genErrorResponse.bind(this, res));
});

module.exports = router;
