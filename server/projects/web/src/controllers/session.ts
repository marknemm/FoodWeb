import express = require('express');
import { AccountEntity } from 'database/src/entity/account.entity';
import { Request, Response } from 'express';
import { AppTokenLoginRequest, ImpersonateRequest, LoginRequest, LoginResponse } from '~shared';
import { genErrorResponse } from '~web/middlewares/response-error.middleware';
import { appTokenLogin, saveAppSessionToken } from '~web/services/session/app-session';
import { login, logout } from '~web/services/session/session';
import { impersonateLogin } from '~web/services/session/impersonate';

const router = express.Router();

router.post('/session-token', (req: Request, res: Response) => {
  const loginRequest: AppTokenLoginRequest = req.body;
  appTokenLogin(loginRequest.appSessionToken)
    .then((loginResponse: LoginResponse) => _handleLoginSuccess(req, res, loginResponse))
    .catch(genErrorResponse.bind(this, res));
});

router.post('/impersonate', (req: Request, res: Response) => {
  const impersonateRequest: ImpersonateRequest = req.body;
  impersonateLogin(impersonateRequest)
    .then((loginResponse: LoginResponse) => _handleLoginSuccess(req, res, loginResponse))
    .catch(genErrorResponse.bind(this, res));
});

router.post('/', (req: Request, res: Response) => {
  const loginRequest: LoginRequest = req.body;
  login(loginRequest)
    .then((loginResponse: LoginResponse) => _handleLoginSuccess(req, res, loginResponse))
    .catch(genErrorResponse.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const account: AccountEntity = req.session['account'];
  const loginResponse: LoginResponse = { account };
  if (account && req.query.isApp === 'true') {
    saveAppSessionToken(account)
      .then((appSessionToken: string) => loginResponse.appSessionToken = appSessionToken)
      .catch(genErrorResponse.bind(this, res));
  }
  res.send(loginResponse);
});

router.delete('/', (req: Request, res: Response) => {
  if (req.query.isApp === 'true') {
    logout(req.session['account']);
  }
  req.session.destroy(console.error);
  res.send();
});

/**
 * Handles a successful login response.
 * @param req The server request from the client. Will have its session state set.
 * @param res The server response that is to be sent to the client.
 * @param loginResponse The successful login response.
 */
function _handleLoginSuccess(req: Request, res: Response, loginResponse: LoginResponse): void {
  // Set session on request object.
  req.session['account'] = loginResponse.account;
  res.send(loginResponse);
}

module.exports = router;