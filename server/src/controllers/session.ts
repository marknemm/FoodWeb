import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity } from '../entity/account.entity';
import { login, appTokenLogin, logout, saveAppSessionToken } from '../services/session';
import { handleError } from '../middlewares/response-error.middleware';
import { LoginRequest } from '../shared';
import { LoginResponse } from '../shared';
import { AppTokenLoginRequest } from '../shared';

const router = express.Router();

router.post('/session-token', (req: Request, res: Response) => {
  const loginRequest: AppTokenLoginRequest = req.body;
  appTokenLogin(loginRequest.appSessionToken)
    .then((loginResponse: LoginResponse) => {
      // Set session on request object.
      req.session['account'] = loginResponse.account;
      res.send(loginResponse);
    }).catch(handleError.bind(this, res));
});

router.post('/', (req: Request, res: Response) => {
  const loginRequest: LoginRequest = req.body;
  login(loginRequest)
    .then((loginResponse: LoginResponse) => {
      // Set session on request object.
      req.session['account'] = loginResponse.account;
      res.send(loginResponse);
    }).catch(handleError.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const account: AccountEntity = req.session['account'];
  const loginResponse: LoginResponse = { account };
  if (account && req.query.isApp === 'true') {
    saveAppSessionToken(account)
      .then((appSessionToken: string) => loginResponse.appSessionToken = appSessionToken)
      .catch(handleError.bind(this, res))
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

module.exports = router;
