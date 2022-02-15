import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity, DonationEntity } from '~entity';
import { DonationClaimRequest, DonationDeleteRequest, DonationReadRequest, DonationSaveRequest, DonationUnclaimRequest, ListResponse } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middleware/response-error.middleware';
import { ensureAccountVerified, ensureSessionActive } from '~web/middleware/session.middleware';
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

export const router = express.Router();

router.get('/', handleGetDonations);
export function handleGetDonations(req: Request, res: Response) {
  const readRequest: DonationReadRequest = req.query;
  readDonations(readRequest)
    .then((listRes: ListResponse<DonationEntity>) =>
      res.send(listRes)
    )
    .catch(genErrorResponse.bind(this, res));
}

router.get('/my', ensureSessionActive, handleGetMyDonations);
export function handleGetMyDonations(req: Request, res: Response) {
  const readRequest: DonationReadRequest = req.query;
  readMyDonations(readRequest, req.session.account)
    .then((listRes: ListResponse<DonationEntity>) =>
      res.send(listRes)
    )
    .catch(genErrorResponse.bind(this, res));
}

router.get('/:id', getDonation);
export function getDonation(req: Request, res: Response) {
  const id: number = parseInt(req.params.id, 10);
  readDonation(id)
    .then((donation: DonationEntity) => res.send(donation))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/', ensureSessionActive, ensureAccountVerified, handlePostDonation);
export function handlePostDonation(req: Request, res: Response) {
  const myAccount: AccountEntity = req.session.account;
  const createReq: DonationSaveRequest = req.body;
  createDonation(createReq, myAccount)
    .then((donation: DonationEntity) => { res.send(donation); return donation; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((donation: DonationEntity) => sendDonationCreateMessages(donation))
    .then((donation: DonationEntity) => sendClaimAvailableMessages(donation))
    .catch((err: Error) => console.error(err));
}

router.post('/claim', ensureSessionActive, ensureAccountVerified, handlePostDonationClaim);
export function handlePostDonationClaim(req: Request, res: Response) {
  const claimReq: DonationClaimRequest = req.body;
  claimDonation(claimReq, req.session.account)
    .then((claimedDonation: DonationEntity) => { res.send(claimedDonation); return claimedDonation; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((claimedDonation: DonationEntity) => sendClaimedDonationMessages(claimedDonation))
    .then((claimedDonation: DonationEntity) => sendDeliveryAvailableMessages(claimedDonation))
    .catch((err: Error) => console.error(err));
}

router.put('/', ensureSessionActive, ensureAccountVerified, handlePutDonation);
export function handlePutDonation(req: Request, res: Response) {
  const updateReq: DonationSaveRequest = req.body;
  updateDonation(updateReq, req.session.account)
    .then((donationDiff: UpdateDiff<DonationEntity>) => { res.send(donationDiff.new); return donationDiff; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((donationDiff: UpdateDiff<DonationEntity>) => sendDonationUpdateMessages(donationDiff))
    .catch((err: Error) => console.error(err));
}

router.delete(
  '/:id',
  ensureSessionActive, ensureAccountVerified,
  (req: Request, res: Response) => handleDeleteDonation(req, res)
);
export function handleDeleteDonation(req: Request, res: Response, account: AccountEntity = req.session.account): void {
  const deleteReq: DonationDeleteRequest = req.body;
  deleteReq.donationId = parseInt(req.params.id, 10);
  deleteDonation(deleteReq, account)
    .then((deletedDonation: DonationEntity) => { res.send(); return deletedDonation; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((deletedDonation: DonationEntity) => sendDonationDeleteMessages(deletedDonation))
    .catch((err: Error) => console.error(err));
}

router.delete(
  '/claim/:id',
  ensureSessionActive, ensureAccountVerified,
  (req: Request, res: Response) => handleDeleteDonationClaim(req, res)
);
export function handleDeleteDonationClaim(req: Request, res: Response, account: AccountEntity = req.session.account): void {
  const unclaimReq: DonationUnclaimRequest = req.body;
  unclaimReq.donationId = parseInt(req.params.id, 10);
  unclaimDonation(unclaimReq, account)
    .then((unclaimDonationDiff: UpdateDiff<DonationEntity>) => { res.send(unclaimDonationDiff.new); return unclaimDonationDiff; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((unclaimDonationDiff: UpdateDiff<DonationEntity>) => sendUnclaimedDonationMessages(unclaimDonationDiff))
    .catch((err: Error) => console.error(err));
}
