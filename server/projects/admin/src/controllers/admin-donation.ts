import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity, DonationEntity } from '~entity';
import { AdminClaimSaveRequest, AdminDonationSaveRequest } from '~shared';
import { getDonation, handleDeleteDonation, handleDeleteDonationClaim, handleGetDonations, handleGetMyDonations, handlePutDonation } from '~web/controllers/donation';
import { genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { readAccount } from '~web/services/account/read-accounts';
import { saveDonationClaimAudit, saveDonationCreateAudit } from '~web/services/audit/save-donation-audit';
import { sendClaimAvailableMessages } from '~web/services/donation-claim/claim-available-message';
import { claimDonation } from '~web/services/donation-claim/claim-donation';
import { createDonation } from '~web/services/donation/save-donation';
import { sendDonationCreateMessages } from '~web/services/donation/save-donation-message';
import { chainHandlePostDelivery } from './admin-delivery';

export const router = express.Router();

router.get('/', handleGetDonations);
router.get('/my', handleGetMyDonations);
router.get('/:id', getDonation);

router.post('/', handlePostDonation);
async function handlePostDonation(req: Request, res: Response) {
  const createReq: AdminDonationSaveRequest = req.body;

  try {
    let donation: DonationEntity;

    // Grab the donor account and create the donation.
    try {
      const donorAccount: AccountEntity = await readAccount(createReq.donorAccountId);
      donation = await createDonation(createReq, donorAccount);
    } catch (err) {
      genErrorResponseRethrow(res, err);
    }

    // Perform donation audit and send appropriate messages. Note, not using await on purpose.
    saveDonationCreateAudit(createReq, donation);
    if (createReq.sendNotifications) {
      sendDonationCreateMessages(donation);
      if (!createReq.claimSaveReq?.receiverAccountId) {
        sendClaimAvailableMessages(donation);
      }
    }

    // Create donation claim and delivery if this is a composite save request.
    if (createReq.claimSaveReq?.receiverAccountId) {
      createReq.claimSaveReq.donationId = donation.id;
      donation = await chainHandlePostDonationClaim(createReq.claimSaveReq, res);
      if (createReq.deliverySaveReq?.volunteerAccountId) {
        createReq.deliverySaveReq.donationId = donation.id;
        donation = await chainHandlePostDelivery(createReq.deliverySaveReq, res);
      }
    }

    res.send(donation);
  } catch(err) {
    console.error(err);
  }
}

router.post('/claim', handlePostDonationClaim);
function handlePostDonationClaim(req: Request, res: Response) {
  const claimReq: AdminClaimSaveRequest = req.body;
  chainHandlePostDonationClaim(claimReq, res)
    .then((claimedDonation: DonationEntity) => res.send(claimedDonation))
    .catch((err: Error) => console.error(err));
}

async function chainHandlePostDonationClaim(claimReq: AdminClaimSaveRequest, res: Response): Promise<DonationEntity> {
  let donation: DonationEntity;

  try {
    const receiverAccount: AccountEntity = await readAccount(claimReq.receiverAccountId);
    donation = await claimDonation(claimReq, receiverAccount);
  } catch (err) {
    genErrorResponseRethrow(res, err);
  }

  saveDonationClaimAudit(claimReq, donation);
  (claimReq.sendNotifications) ? sendDonationCreateMessages(donation) : undefined;
  return donation;
}

router.put('/', handlePutDonation);

router.delete('/:id', handleDeleteDonation);
router.delete('/claim/:id', handleDeleteDonationClaim);
