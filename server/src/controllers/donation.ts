import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive, ensureAccountVerified } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { DonationCreateRequest, Donation } from '../../../shared/src/interfaces/donation/donation-create-request';

const router = express.Router();

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const createRequest: DonationCreateRequest = req.body;
  console.log(createRequest.donation);
  res.send(createRequest.donation);
  // createDonation(createRequest.donation)
  //   .then((donation: Donation) => res.send(donation))
  //   .catch(handleError.bind(this, res));
});

module.exports = router;
