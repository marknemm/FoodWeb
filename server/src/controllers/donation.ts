import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive, ensureAccountVerified } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { createDonation, updateDonation } from '../models/save-donation';
import { readDonations, DonationsQueryResult, readDonation } from '../models/read-donations';
import { deleteDonation } from '../models/delete-donation';
import { DonationCreateRequest, Donation } from '../../../shared/src/interfaces/donation/donation-create-request';
import { DonationReadRequest } from '../../../shared/src/interfaces/donation/donation-read-request';
import { DonationUpdateRequest } from '../../../shared/src/interfaces/donation/donation-update-request';
import { ListResponse } from '../../../shared/src/interfaces/list-response';

const router = express.Router();

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const createRequest: DonationCreateRequest = req.body;
  createDonation(createRequest.donation, req.session.account)
    .then((donation: Donation) => res.send(donation))
    .catch(handleError.bind(this, res));
});

router.get('/:id', ensureSessionActive, (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  readDonation(id, req.session.account)
    .then((donation: Donation) => res.send(donation))
    .catch(handleError.bind(this, res));
});

router.get('/', ensureSessionActive, (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readDonations(readRequest, req.session.account)
    .then((queryResult: DonationsQueryResult) => {
      const response: ListResponse = {
        list: queryResult.donations,
        totalCount: queryResult.totalCount,
        filters: readRequest,
        page: readRequest.page,
        limit: readRequest.limit,
        startRank: (readRequest.page - 1) * readRequest.limit,
        endRank: (readRequest.page - 1) * readRequest.limit + readRequest.limit - 1
      };
      res.send(response);
    })
    .catch(handleError.bind(this, res));
});

router.put('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const updateRequest: DonationUpdateRequest = req.body;
  updateDonation(updateRequest.donation, req.session.account)
    .then((donation: Donation) => res.send(donation))
    .catch(handleError.bind(this, res));
});

router.delete('/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const donationId: number = req.params.id;
  deleteDonation(donationId, req.session.account)
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

module.exports = router;
