import express = require('express');
import { Request, Response } from 'express';
import { login, appTokenLogin, logout } from '../services/session';
import { handleError } from '../middlewares/response-error.middleware';
import { LoginRequest } from '../../../shared/src/interfaces/session/login-request';
import { LoginResponse } from '../../../shared/src/interfaces/session/login-response';
import { AppTokenLoginRequest } from '../../../shared/src/interfaces/session/app-token-login-request';

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
  res.send(req.session['account']);
});

router.delete('/', (req: Request, res: Response) => {
  if (req.query.isApp === 'true') {
    logout(req.session['account']);
  }
  req.session.destroy(console.error);
  res.send();
});

module.exports = router;
