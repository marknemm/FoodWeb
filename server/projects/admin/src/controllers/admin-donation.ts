import express = require('express');
import { Request, Response } from 'express';
import { DonationEntity, AccountEntity } from '~entity';
import { Account, AdminDonationSaveRequest } from '~shared';
import { getDonation, handleDeleteDonation, handleDeleteDonationClaim, handleGetDonations, handleGetMyDonations, handlePostDonationClaim, handlePutDonation } from '~web/controllers/donation';
import { genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { saveDonationCreateAudit } from '~web/services/audit/save-donation-audit';
import { sendClaimAvailableMessages } from '~web/services/donation-claim/claim-available-message';
import { createDonation } from '~web/services/donation/save-donation';
import { sendDonationCreateMessages } from '~web/services/donation/save-donation-message';

export const router = express.Router();

router.get('/', handleGetDonations);
router.get('/my', handleGetMyDonations);
router.get('/:id', getDonation);

router.post('/', handlePostDonation);
function handlePostDonation(req: Request, res: Response) {
  const createReq: AdminDonationSaveRequest = req.body;
  const donorAccount: Account = createReq.donation.donorAccount;
  createDonation(createReq, <AccountEntity>donorAccount)
    .then((donation: DonationEntity) => { res.send(donation); return donation; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((donation: DonationEntity) => saveDonationCreateAudit(createReq, donation))
    .then((donation: DonationEntity) => (createReq.sendNotifications) ? sendDonationCreateMessages(donation) : donation)
    .then((donation: DonationEntity) => (createReq.sendNotifications && !createReq.donation.claim) ? sendClaimAvailableMessages(donation) : undefined)
    .catch((err: Error) => console.error(err));
}

router.post('/claim', handlePostDonationClaim);

router.put('/', handlePutDonation);

router.delete('/:id', handleDeleteDonation);
router.delete('/claim/:id', handleDeleteDonationClaim);
