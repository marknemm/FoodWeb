import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity, DonationEntity } from '~entity';
import { QueryResult } from '~orm';
import { DonationClaimRequest, DonationCreateRequest, DonationDeleteRequest, DonationReadRequest, DonationUnclaimRequest, DonationUpdateRequest } from '~shared';
import { genListResponse } from '~web/helpers/response/list-response';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { ensureAccountVerified, ensureSessionActive } from '~web/middlewares/session.middleware';
import { saveDonationClaimAudit, saveDonationCreateAudit, saveDonationDeleteAudit, saveDonationUnclaimAudit, saveDonationUpdateAudit } from '~web/services/audit/save-donation-audit';
import { sendDeliveryAvailableMessages } from '~web/services/delivery/delivery-available-message';
import { sendClaimAvailableMessages } from '~web/services/donation-claim/claim-available-message';
import { claimDonation } from '~web/services/donation-claim/claim-donation';
import { sendClaimedDonationMessages } from '~web/services/donation-claim/claimed-donation-message';
import { unclaimDonation } from '~web/services/donation-claim/unclaim-donation';
import { sendUnclaimedDonationMessages } from '~web/services/donation-claim/unclaimed-donation-message';
import { deleteDonation } from '~web/services/donation/delete-donation';
import { sendDonationDeleteMessages } from '~web/services/donation/delete-donation-message';
import { readDonation, readDonations, readMyDonations } from '~web/services/donation/read-donations';
import { createDonation, updateDonation } from '~web/services/donation/save-donation';
import { sendDonationCreateMessages, sendDonationUpdateMessages } from '~web/services/donation/save-donation-message';

const router = express.Router();

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const myAccount: AccountEntity = req.session.account;
  const createReq: DonationCreateRequest = req.body;
  createDonation(createReq, myAccount)
    .then((donation: DonationEntity) => { res.send(donation); return donation; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((donation: DonationEntity) => saveDonationCreateAudit(createReq, donation))
    .then((donation: DonationEntity) => sendDonationCreateMessages(donation))
    .then((donation: DonationEntity) => sendClaimAvailableMessages(donation))
    .catch((err: Error) => console.error(err));
});

router.post('/claim', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const claimReq: DonationClaimRequest = req.body;
  claimDonation(claimReq, req.session.account)
    .then((claimedDonation: DonationEntity) => { res.send(claimedDonation); return claimedDonation; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((claimedDonation: DonationEntity) => saveDonationClaimAudit(claimReq, claimedDonation))
    .then((claimedDonation: DonationEntity) => sendClaimedDonationMessages(claimedDonation))
    .then((claimedDonation: DonationEntity) => sendDeliveryAvailableMessages(claimedDonation))
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
    .then((unclaimDonationDiff: UpdateDiff<DonationEntity>) => sendUnclaimedDonationMessages(unclaimDonationDiff))
    .catch((err: Error) => console.error(err));
});

module.exports = router;
