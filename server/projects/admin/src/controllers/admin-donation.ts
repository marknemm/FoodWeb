import express = require('express');
import { Request, Response } from 'express';
import { adminReadAccount } from '~admin/services/admin-account/admin-read-accounts';
import { adminCreateDonation, adminUpdateDonation } from '~admin/services/admin-donation/admin-save-donation';
import { adminSendDonationCreateMessages, adminSendDonationUpdateMessages } from '~admin/services/admin-donation/admin-save-donation-message';
import { AccountEntity, DonationEntity } from '~entity';
import { AdminClaimSaveRequest, AdminDonationSaveRequest } from '~shared';
import { getDonation, handleDeleteDonation, handleDeleteDonationClaim, handleGetDonations, handleGetMyDonations } from '~web/controllers/donation';
import { FoodWebError } from '~web/helpers/response/foodweb-error';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middleware/response-error.middleware';
import { saveDonationClaimAudit, saveDonationCreateAudit, saveDonationUpdateAudit } from '~web/services/audit/save-donation-audit';
import { claimDonation } from '~web/services/donation-claim/claim-donation';
import { sendClaimedDonationMessages } from '~web/services/donation-claim/claimed-donation-message';
import { readDonation } from '~web/services/donation/read-donations';
import { UpdateDiff } from '~web/helpers/misc/update-diff';

export const router = express.Router();

router.get('/', handleGetDonations);
router.get('/my', handleGetMyDonations);
router.get('/:id', getDonation);

router.post('/', adminHandlePostDonation);
async function adminHandlePostDonation(req: Request, res: Response) {
  const createReq: AdminDonationSaveRequest = req.body;
  let donation: DonationEntity;

  // Perform donation creation operation and respond to client immediately on success/failure.
  try {
    donation = await adminCreateDonation(createReq);
    res.send(donation);
  } catch (err) {
    return genErrorResponse(res, err);
  }

  // Save audit and send appropriate notifications.
  saveDonationCreateAudit(createReq, donation);
  if (createReq.sendNotifications) {
    adminSendDonationCreateMessages(donation);
  }
}

router.post('/claim', adminHandlePostDonationClaim);
async function adminHandlePostDonationClaim(req: Request, res: Response) {
  const claimReq: AdminClaimSaveRequest = req.body;
  let claimedDonation: DonationEntity;

  // Perform donation claim operation and respond to client immediately on success/failure.
  try {
    const receiverAccount: AccountEntity = await adminReadAccount(claimReq.receiverAccountId);
    claimedDonation = await claimDonation(claimReq, receiverAccount);
    res.send(claimedDonation);
  } catch (err) {
    return genErrorResponseRethrow(res, err);
  }

  // Save audit and send appropriate notifications.
  saveDonationClaimAudit(claimReq, claimedDonation);
  if (claimReq.sendNotifications) {
    sendClaimedDonationMessages(claimedDonation);
  }
}

router.put('/', adminHandlePutDonation);
async function adminHandlePutDonation(req: Request, res: Response) {
  const saveReq: AdminDonationSaveRequest = req.body;
  let donationUpdtDiff: UpdateDiff<DonationEntity>;

  try {
    donationUpdtDiff = await adminUpdateDonation(saveReq);
    res.send(donationUpdtDiff.new);
  } catch (err) {
    genErrorResponse(res, err);
  }

  saveDonationUpdateAudit(saveReq, donationUpdtDiff);
  if (saveReq.sendNotifications) {
    adminSendDonationUpdateMessages(donationUpdtDiff);
  }
}

router.delete('/:id', adminHandleDeleteDonation);
function adminHandleDeleteDonation(req: Request, res: Response) {
  const donationId: number = parseInt(req.params.id, 10);
  readDonation(donationId)
    .then((donationToDel: DonationEntity) => handleDeleteDonation(req, res, donationToDel?.donorAccount))
    .catch((err: FoodWebError) => genErrorResponse(res, err));
}

router.delete('/claim/:id', adminHandleDeleteDonationClaim);
function adminHandleDeleteDonationClaim(req: Request, res: Response) {
  const donationId: number = parseInt(req.params.id, 10);
  readDonation(donationId)
    .then((donationToUnclaim: DonationEntity) => handleDeleteDonationClaim(req, res, donationToUnclaim?.claim?.receiverAccount))
    .catch((err: FoodWebError) => genErrorResponse(res, err));
}
