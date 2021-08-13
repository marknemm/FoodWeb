import express = require('express');
import { Request, Response, Router } from 'express';
import { AccountEntity, PerpetualSessionEntity } from '~entity';
import { ImpersonateRequest, LoginRequest, LoginResponse } from '~shared';
import { genErrorResponse } from '~web/middlewares/response-error.middleware';
import { impersonateLogin } from '~web/services/session/impersonate';
import { login, logout, perpetualTokenLogin } from '~web/services/session/session';

export const router: Router = express.Router();

router.get('/', handleGetSession);
export function handleGetSession(req: Request, res: Response) {
  const perpetualSessionToken = <string> req.query.perpetualSessionToken;
  const account: AccountEntity = req.session.account;
  if (!req.session.account) {
    perpetualTokenLogin(perpetualSessionToken) // Attempt to re-establish session via perpetual session token.
      .then((loginResponse: LoginResponse) => _handleLoginSuccess(req, res, loginResponse))
      .catch(() => res.send({}));
  } else {
    _handleLoginSuccess(req, res, { account, perpetualSession: req.session.perpetualSession });
  }
}

router.post('/impersonate', handlePostImpersonate);
export function handlePostImpersonate(req: Request, res: Response) {
  const impersonateRequest: ImpersonateRequest = req.body;
  impersonateLogin(impersonateRequest)
    .then((loginResponse: LoginResponse) => _handleLoginSuccess(req, res, loginResponse))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/', handlePostSession);
export function handlePostSession(req: Request, res: Response) {
  const loginRequest: LoginRequest = req.body;
  login(loginRequest)
    .then((loginResponse: LoginResponse) => _handleLoginSuccess(req, res, loginResponse))
    .catch(genErrorResponse.bind(this, res));
}

router.delete('/', handleDeleteSession);
export function handleDeleteSession(req: Request, res: Response) {
  if (req.query.isApp === 'true') {
    logout(req.session['account']);
  }
  req.session.destroy(console.error);
  res.send();
}

/**
 * Handles a successful login response.
 * @param req The server request from the client. Will have its session state set.
 * @param res The server response that is to be sent to the client.
 * @param loginResponse The successful login response.
 */
function _handleLoginSuccess(req: Request, res: Response, loginResponse: LoginResponse): void {
  // Set session on request object.
  req.session.account = <AccountEntity>loginResponse.account;
  req.session.perpetualSession = <PerpetualSessionEntity>loginResponse.perpetualSession;
  res.send(loginResponse);
}
