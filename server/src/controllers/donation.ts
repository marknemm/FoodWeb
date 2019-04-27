import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive, ensureAccountVerified } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { createDonation, updateDonation } from '../models/save-donation';
import { messagePotentialReceivers, claimDonation, unclaimDonation } from '../models/match-donation';
import { readDonations, DonationsQueryResult, readDonation, readMyDonations } from '../models/read-donations';
import { deleteDonation } from '../models/delete-donation';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { DonationReadRequest } from '../../../shared/src/interfaces/donation/donation-read-request';
import { DonationClaimRequest } from '../../../shared/src/interfaces/donation/donation-claim-request';
import { ListResponse } from '../../../shared/src/interfaces/list-response';

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
    .then((claimedDonation: Donation) => res.send(claimedDonation))
    .catch(handleError.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readDonations(readRequest, req.session.account)
    .then(_sendDonationsResponse.bind(this, readRequest, res))
    .catch(handleError.bind(this, res));
});

router.get('/my', ensureSessionActive, (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readMyDonations(readRequest, req.session.account)
    .then(_sendDonationsResponse.bind(this, readRequest, res))
    .catch(handleError.bind(this, res));
});

function _sendDonationsResponse(readRequest: DonationReadRequest, res: Response, queryResult: DonationsQueryResult): void {
  const response: ListResponse<Donation> = {
    list: queryResult.donations,
    totalCount: queryResult.totalCount,
    filters: readRequest,
    page: readRequest.page,
    limit: readRequest.limit,
    startRank: (readRequest.page - 1) * readRequest.limit,
    endRank: (readRequest.page - 1) * readRequest.limit + readRequest.limit - 1
  };
  res.send(response);
}

router.get('/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  readDonation(id, req.session.account)
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
