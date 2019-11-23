import express = require('express');
import { Request, Response } from 'express';
import { UpdateDiff } from '../interfaces/update-diff';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { ensureSessionActive, ensureAccountVerified } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { genListResponse } from '../helpers/list-response';
import { QueryResult } from '../helpers/query-builder-helper';
import { createDonation, updateDonation } from '../services/save-donation';
import { claimDonation, unclaimDonation } from '../services/match-donation';
import { readDonations, readDonation, readMyDonations } from '../services/read-donations';
import { deleteDonation } from '../services/delete-donation';
import { messagePotentialDeliverers } from '../services/message-potential-deliverers';
import { findPotentialReceivers, FoundPotentialReceivers } from '../services/find-potential-receivers';
import { findPotentialDeliverers, FoundPotentialDeliverers } from '../services/find-potential-deliverers';
import {
  saveDonationClaimAudit,
  saveDonationCreateAudit,
  saveDonationUpdateAudit,
  saveDonationDeleteAudit,
  saveDonationUnclaimAudit
} from '../services/save-donation-audit';
import { sendDonationUpdateMessages, sendDonationCreateMessages } from '../services/save-donation-message';
import { sendDonationDeleteMessages } from '../services/delete-donation-message';
import { sendUnclaimMessages, sendClaimMessages } from '../services/match-donation-message';
import { messagePotentialReceivers } from '../services/message-potential-receivers';
import {
  DonationReadRequest,
  DonationCreateRequest,
  DonationUpdateRequest,
  DonationClaimRequest,
  DonationUnclaimRequest,
  DonationDeleteRequest
} from '../shared';

const router = express.Router();

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const myAccount: AccountEntity = req.session.account;
  const createReq: DonationCreateRequest = req.body;
  createDonation(createReq, myAccount)
    .then((donation: DonationEntity) => saveDonationCreateAudit(createReq, donation))
    .then((donation: DonationEntity) => sendDonationCreateMessages(donation))
    .then((donation: DonationEntity) => { res.send(donation); return donation; })
    .catch(handleError.bind(this, res))
    // Perform this task after responding with donation success (might take a long time).
    .then((donation: DonationEntity) => findPotentialReceivers(donation))
    .then((potentialReceivers: FoundPotentialReceivers) => messagePotentialReceivers(potentialReceivers))
    .catch((err: Error) => console.error(err));
});

router.post('/claim', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const claimReq: DonationClaimRequest = req.body;
  claimDonation(claimReq, req.session.account)
    .then((claimedDonation: DonationEntity) => saveDonationClaimAudit(claimReq, claimedDonation))
    .then((claimedDonation: DonationEntity) => sendClaimMessages(claimedDonation))
    .then((claimedDonation: DonationEntity) => { res.send(claimedDonation); return claimedDonation; })
    .catch(handleError.bind(this, res))
    // Perform this task after responding with donation claim success (might take a long time).
    .then((claimedDonation: DonationEntity) => findPotentialDeliverers(claimedDonation))
    .then((potentialDeliverers: FoundPotentialDeliverers) => messagePotentialDeliverers(potentialDeliverers))
    .catch((err: Error) => console.error(err));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readDonations(readRequest)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.get('/my', ensureSessionActive, (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readMyDonations(readRequest, req.session.account)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.get('/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  readDonation(id)
    .then((donation: DonationEntity) => res.send(donation))
    .catch(handleError.bind(this, res));
});

router.put('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const updateReq: DonationUpdateRequest = req.body;
  updateDonation(updateReq, req.session.account)
    .then((donationDiff: UpdateDiff<DonationEntity>) => saveDonationUpdateAudit(updateReq, donationDiff))
    .then((donationDiff: UpdateDiff<DonationEntity>) => sendDonationUpdateMessages(donationDiff))
    .then((donation: DonationEntity) => res.send(donation))
    .catch(handleError.bind(this, res));
});

router.delete('/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const deleteReq: DonationDeleteRequest = req.body;
  deleteReq.donationId = parseInt(req.params.id, 10);
  deleteDonation(deleteReq, req.session.account)
    .then((deletedDonation: DonationEntity) => saveDonationDeleteAudit(deleteReq, deletedDonation))
    .then((deletedDonation: DonationEntity) => sendDonationDeleteMessages(deletedDonation))
    .then(() => res.send())
    .catch(handleError.bind(this, res));
});

router.delete('/claim/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const unclaimReq: DonationUnclaimRequest = req.body;
  unclaimReq.donationId = parseInt(req.params.id, 10);
  unclaimDonation(unclaimReq, req.session.account)
    .then((unclaimDonationDiff: UpdateDiff<DonationEntity>) => saveDonationUnclaimAudit(unclaimReq, unclaimDonationDiff))
    .then((unclaimDonationDiff: UpdateDiff<DonationEntity>) => sendUnclaimMessages(unclaimDonationDiff))
    .then((unclaimedDonation: DonationEntity) => res.send(unclaimedDonation))
    .catch(handleError.bind(this, res));
});

module.exports = router;
