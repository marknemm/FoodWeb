import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive, ensureAccountVerified } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { DonationCreateRequest } from '../../../shared/src/interfaces/donation/donation-create-request';
import { createDonation } from '../models/save-donation';
import { DonationEntity } from '../entity/donation.entity';

const router = express.Router();

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const createRequest: DonationCreateRequest = req.body;
  createDonation(createRequest.donation, req.session.account)
    .then((donation: DonationEntity) => res.send(donation))
    .catch(handleError.bind(this, res));
});

module.exports = router;
