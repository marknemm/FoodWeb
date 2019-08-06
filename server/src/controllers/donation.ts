import express = require('express');
import { Request, Response } from 'express';
import { UpdateDiff } from '../interfaces/update-diff';
import { AccountEntity } from '../entity/account.entity';
import { ensureSessionActive, ensureAccountVerified } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { genListResponse } from '../helpers/list-response';
import { createDonation, updateDonation } from '../services/save-donation';
import { claimDonation, unclaimDonation } from '../services/match-donation';
import { readDonations, DonationsQueryResult, readDonation, readMyDonations } from '../services/read-donations';
import { deleteDonation } from '../services/delete-donation';
import { messagePotentialDeliverers } from '../services/schedule-delivery';
import { findPotentialReceivers, FoundPotentialReceivers } from '../services/find-potential-receivers';
import {
  saveDonationClaimAudit,
  saveDonationCreateAudit,
  saveDonationUpdateAudit,
  saveDonationDeleteAudit,
  saveDonationUnclaimAudit
} from '../services/save-donation-audit';
import { sendDonationUpdateMessages, sendDonationCreateMessages } from '../services/save-donation-message';
import { sendDonationDeleteSuccessEmail } from '../services/delete-donation-message';
import { sendUnclaimMessages, sendClaimMessages } from '../services/match-donation-message';
import { messagePotentialReceivers } from '../services/message-potential-receivers';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { DonationReadRequest } from '../../../shared/src/interfaces/donation/donation-read-request';
import { DonationCreateRequest } from '../../../shared/src/interfaces/donation/donation-create-request';
import { DonationUpdateRequest } from '../../../shared/src/interfaces/donation/donation-update-request';
import { DonationClaimRequest } from '../../../shared/src/interfaces/donation/donation-claim-request';
import { DonationUnclaimRequest } from '../../../shared/src/interfaces/donation/donation-unclaim-request';
import { DonationDeleteRequest } from '../../../shared/src/interfaces/donation/donation-delete-request';

const router = express.Router();

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const myAccount: AccountEntity = req.session.account;
  const createReq: DonationCreateRequest = req.body;
  createDonation(createReq, myAccount)
    .then((donation: Donation) => saveDonationCreateAudit(createReq, donation))
    .then((donation: Donation) => sendDonationCreateMessages(donation))
    .then((donation: Donation) => { res.send(donation); return donation; })
    .catch(handleError.bind(this, res))
    // Perform this task after responding with donation success (might take a long time).
    .then((donation: Donation) => findPotentialReceivers(donation))
    .then((potentialReceivers: FoundPotentialReceivers) => messagePotentialReceivers(potentialReceivers))
    .catch((err: Error) => console.error(err));
});

router.post('/claim', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const claimReq: DonationClaimRequest = req.body;
  claimDonation(claimReq, req.session.account)
    .then((claimedDonation: Donation) => saveDonationClaimAudit(claimReq, claimedDonation))
    .then((claimedDonation: Donation) => sendClaimMessages(claimedDonation))
    .then((claimedDonation: Donation) => messagePotentialDeliverers(claimedDonation))
    .then((claimedDonation: Donation) => res.send(claimedDonation))
    .catch(handleError.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readDonations(readRequest, req.session.account)
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
  readDonation(id, req.session.account)
    .then((donation: Donation) => res.send(donation))
    .catch(handleError.bind(this, res));
});

router.put('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const updateReq: DonationUpdateRequest = req.body;
  updateDonation(updateReq, req.session.account)
    .then((donationDiff: UpdateDiff<Donation>) => saveDonationUpdateAudit(updateReq, donationDiff))
    .then((donationDiff: UpdateDiff<Donation>) => sendDonationUpdateMessages(donationDiff))
    .then((donation: Donation) => res.send(donation))
    .catch(handleError.bind(this, res));
});

router.delete('/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const deleteReq: DonationDeleteRequest = req.body;
  deleteReq.donationId = parseInt(req.params.id, 10);
  deleteDonation(deleteReq, req.session.account)
    .then((deletedDonation: Donation) => saveDonationDeleteAudit(deleteReq, deletedDonation))
    .then((deletedDonation: Donation) => sendDonationDeleteSuccessEmail(deletedDonation))
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

router.delete('/claim/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const unclaimReq: DonationUnclaimRequest = req.body;
  unclaimReq.donationId = parseInt(req.params.id, 10);
  unclaimDonation(unclaimReq, req.session.account)
    .then((unclaimDonationDiff: UpdateDiff<Donation>) => saveDonationUnclaimAudit(unclaimReq, unclaimDonationDiff))
    .then((unclaimDonationDiff: UpdateDiff<Donation>) => sendUnclaimMessages(unclaimDonationDiff))
    .then((unclaimedDonation: Donation) => res.send(unclaimedDonation))
    .catch(handleError.bind(this, res));
});

module.exports = router;
