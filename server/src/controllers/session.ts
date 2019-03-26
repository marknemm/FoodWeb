import express = require('express');
import { Request, Response } from 'express';
import { login } from '../models/login';
import { handleError } from '../middlewares/response-error.middleware';
import { LoginRequest } from './../../../shared/src/interfaces/session/login-request';
import { Account } from './../../../shared/src/interfaces/account/account';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const loginRequest: LoginRequest = req.body;
  login(loginRequest.usernameEmail, loginRequest.password)
    .then((account: Account) => {
      // Set session on request object.
      req.session['account'] = account;
      res.send(account);
    }).catch(handleError.bind(this, res));
});

router.delete('/', (req: Request, res: Response) => {
  req.session.destroy(console.error);
  res.send();
});

module.exports = router;
