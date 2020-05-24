import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity, DonationEntity } from '~entity';
import { AdminDeliverySaveRequest } from '~shared';
import { handleGetDeliveries, handleGetMyDeliveries, handleGetUnscheduledDeliveries, handlePutAdvanceDeliveryState, handlePutUndoDeliveryState } from '~web/controllers/delivery';
import { genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { ensureAccountVerified, ensureSessionActive } from '~web/middlewares/session.middleware';
import { scheduleDelivery } from '~web/services/delivery/schedule-delivery';
import { saveDeliveryScheduleAudit } from '~web/services/audit/save-delivery-audit';
import { sendDeliveryScheduledMessages } from '~web/services/delivery/schedule-delivery-message';
import { readAccount } from '~web/services/account/read-accounts';

export const router = express.Router();

router.get('/', handleGetDeliveries);
router.get('/my', ensureSessionActive, ensureAccountVerified, handleGetMyDeliveries);
router.get('/unscheduled', handleGetUnscheduledDeliveries);

router.post('/', ensureSessionActive, ensureAccountVerified, handlePostDelivery);
function handlePostDelivery(req: Request, res: Response) {
  const deliverySaveReq: AdminDeliverySaveRequest = req.body;
  chainHandlePostDelivery(deliverySaveReq, res)
    .then((donation: DonationEntity) => res.send(donation))
    .catch((err: Error) => console.error(err))
}

export async function chainHandlePostDelivery(deliverySaveReq: AdminDeliverySaveRequest, res: Response): Promise<DonationEntity> {
  let donation: DonationEntity;

  try {
    const volunteerAccount: AccountEntity = await readAccount(deliverySaveReq.volunteerAccountId)
    return scheduleDelivery(deliverySaveReq, volunteerAccount)
  } catch (err) {
    genErrorResponseRethrow(res, err);
  }

  saveDeliveryScheduleAudit(deliverySaveReq, donation);
  (deliverySaveReq.sendNotifications) ? sendDeliveryScheduledMessages(donation) : undefined;
  return donation;
}

router.put('/advance/:id', ensureSessionActive, ensureAccountVerified, handlePutAdvanceDeliveryState);
router.put('/undo/:id', ensureSessionActive, ensureAccountVerified, handlePutUndoDeliveryState);
