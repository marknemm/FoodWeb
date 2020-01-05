import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { genListResponse } from '../helpers/list-response';
import { QueryResult } from '../helpers/query-builder-helper';
import { UpdateDiff } from '../interfaces/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '../middlewares/response-error.middleware';
import { ensureAccountVerified, ensureSessionActive } from '../middlewares/session.middleware';
import { claimDonation } from '../services/claim-donation';
import { deleteDonation } from '../services/delete-donation';
import { sendDonationDeleteMessages } from '../services/delete-donation-message';
import { findMessagePotentialDeliverers } from '../services/find-message-potential-deliverers';
import { findMessagePotentialReceivers } from '../services/find-message-potential-receivers';
import { sendClaimMessages, sendUnclaimMessages } from '../services/match-donation-message';
import { readDonation, readDonations, readMyDonations } from '../services/read-donations';
import { createDonation, updateDonation } from '../services/save-donation';
import { saveDonationClaimAudit, saveDonationCreateAudit, saveDonationDeleteAudit, saveDonationUnclaimAudit, saveDonationUpdateAudit } from '../services/save-donation-audit';
import { sendDonationCreateMessages, sendDonationUpdateMessages } from '../services/save-donation-message';
import { unclaimDonation } from '../services/unclaim-donation';
import { DonationClaimRequest, DonationCreateRequest, DonationDeleteRequest, DonationReadRequest, DonationUnclaimRequest, DonationUpdateRequest } from '../shared';

const router = express.Router();

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const myAccount: AccountEntity = req.session.account;
  const createReq: DonationCreateRequest = req.body;
  createDonation(createReq, myAccount)
    .then((donation: DonationEntity) => { res.send(donation); return donation; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((donation: DonationEntity) => saveDonationCreateAudit(createReq, donation))
    .then((donation: DonationEntity) => sendDonationCreateMessages(donation))
    .then((donation: DonationEntity) => findMessagePotentialReceivers(donation))
    .catch((err: Error) => console.error(err));
});

router.post('/claim', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const claimReq: DonationClaimRequest = req.body;
  claimDonation(claimReq, req.session.account)
    .then((claimedDonation: DonationEntity) => { res.send(claimedDonation); return claimedDonation; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((claimedDonation: DonationEntity) => saveDonationClaimAudit(claimReq, claimedDonation))
    .then((claimedDonation: DonationEntity) => sendClaimMessages(claimedDonation))
    .then((claimedDonation: DonationEntity) => findMessagePotentialDeliverers(claimedDonation))
    .catch((err: Error) => console.error(err));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readDonations(readRequest)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
});

router.get('/my', ensureSessionActive, (req: Request, res: Response) => {
  const readRequest: DonationReadRequest = req.query;
  readMyDonations(readRequest, req.session.account)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
});

router.get('/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  readDonation(id)
    .then((donation: DonationEntity) => res.send(donation))
    .catch(genErrorResponse.bind(this, res));
});

router.put('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const updateReq: DonationUpdateRequest = req.body;
  updateDonation(updateReq, req.session.account)
    .then((donationDiff: UpdateDiff<DonationEntity>) => { res.send(donationDiff.new); return donationDiff; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((donationDiff: UpdateDiff<DonationEntity>) => saveDonationUpdateAudit(updateReq, donationDiff))
    .then((donationDiff: UpdateDiff<DonationEntity>) => sendDonationUpdateMessages(donationDiff))
    .catch((err: Error) => console.error(err));
});

router.delete('/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const deleteReq: DonationDeleteRequest = req.body;
  deleteReq.donationId = parseInt(req.params.id, 10);
  deleteDonation(deleteReq, req.session.account)
    .then((deletedDonation: DonationEntity) => { res.send(); return deletedDonation; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((deletedDonation: DonationEntity) => saveDonationDeleteAudit(deleteReq, deletedDonation))
    .then((deletedDonation: DonationEntity) => sendDonationDeleteMessages(deletedDonation))
    .catch((err: Error) => console.error(err));
});

router.delete('/claim/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const unclaimReq: DonationUnclaimRequest = req.body;
  unclaimReq.donationId = parseInt(req.params.id, 10);
  unclaimDonation(unclaimReq, req.session.account)
    .then((unclaimDonationDiff: UpdateDiff<DonationEntity>) => { res.send(unclaimDonationDiff.new); return unclaimDonationDiff; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((unclaimDonationDiff: UpdateDiff<DonationEntity>) => saveDonationUnclaimAudit(unclaimReq, unclaimDonationDiff))
    .then((unclaimDonationDiff: UpdateDiff<DonationEntity>) => sendUnclaimMessages(unclaimDonationDiff))
    .catch((err: Error) => console.error(err));
});

module.exports = router;
