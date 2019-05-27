import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive, ensureAccountVerified } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { genListResponse } from '../helpers/list-response';
import { createDonation, updateDonation } from '../models/save-donation';
import { messagePotentialReceivers, claimDonation, unclaimDonation } from '../models/match-donation';
import { readDonations, DonationsQueryResult, readDonation, readMyDonations } from '../models/read-donations';
import { deleteDonation } from '../models/delete-donation';
import { messagePotentialDeliverers } from '../models/schedule-delivery';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { DonationReadRequest } from '../../../shared/src/interfaces/donation/donation-read-request';
import { DonationClaimRequest } from '../../../shared/src/interfaces/donation/donation-claim-request';

const router = express.Router();

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const donation: Donation = req.body;
  createDonation(donation, req.session.account)
    .then((donation: Donation) => {
      messagePotentialReceivers(donation);
      res.send(donation);
    })
    .catch(handleError.bind(this, res));
});

router.post('/claim', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const claimRequest: DonationClaimRequest = req.body;
  claimDonation(claimRequest.donationId, req.session.account)
    .then((claimedDonation: Donation) => {
      messagePotentialDeliverers(claimedDonation);
      res.send(claimedDonation);
    })
    .catch(handleError.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readDonations(readRequest)
    .then((queryResult: DonationsQueryResult) =>
      res.send(genListResponse(queryResult.donations, queryResult.totalCount, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.get('/my', ensureSessionActive, (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readMyDonations(readRequest, req.session.account)
    .then((queryResult: DonationsQueryResult) =>
      res.send(genListResponse(queryResult.donations, queryResult.totalCount, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.get('/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  readDonation(id)
    .then((donation: Donation) => res.send(donation))
    .catch(handleError.bind(this, res));
});

router.put('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const donation: Donation = req.body;
  updateDonation(donation, req.session.account)
    .then((donation: Donation) => res.send(donation))
    .catch(handleError.bind(this, res));
});

router.delete('/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const donationId: number = req.params.id;
  deleteDonation(donationId, req.session.account)
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

router.delete('/claim/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const donationId: number = req.params.id;
  unclaimDonation(donationId, req.session.account)
    .then((unclaimedDonation: Donation) => res.send(unclaimedDonation))
    .catch(handleError.bind(this, res));
});

module.exports = router;
