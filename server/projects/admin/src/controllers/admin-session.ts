import express = require('express');
import { Request, Response } from 'express';
import { adminLogin } from '~admin/services/admin-session/admin-login';
import { LoginRequest, LoginResponse } from '~shared';
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

module.exports = router;
