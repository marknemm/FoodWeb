import express = require('express');
import { Request, Response } from 'express';
import { adminReadAccount } from '~admin/services/admin-account/admin-read-accounts';
import { adminUpdateDelivery } from '~admin/services/admin-delivery/admin-save-delivery';
import { AccountEntity, DeliveryEntity, DonationEntity } from '~entity';
import { AdminDeliverySaveRequest, AdminDeliveryScheduleRequest } from '~shared';
import { handleGetDeliveries, handleGetMyDeliveries, handleGetUnscheduledDeliveries, handlePutAdvanceDeliveryState, handlePutUndoDeliveryState } from '~web/controllers/delivery';
import { genErrorResponseRethrow } from '~web/middleware/response-error.middleware';
import { saveDeliveryScheduleAudit } from '~web/services/audit/save-delivery-audit';
import { readDelivery } from '~web/services/delivery/read-deliveries';
import { scheduleDelivery } from '~web/services/delivery/schedule-delivery';
import { sendDeliveryScheduledMessages } from '~web/services/delivery/schedule-delivery-message';

export const router = express.Router();

router.get('/', handleGetDeliveries);
router.get('/my', handleGetMyDeliveries);
router.get('/unscheduled', handleGetUnscheduledDeliveries);

router.post('/', handlePostDelivery);
async function handlePostDelivery(req: Request, res: Response): Promise<void> {
  const scheduleReq: AdminDeliveryScheduleRequest = req.body;
  let donation: DonationEntity;

  // Perform delivery schedule operation and respond to client immediately on success/failure.
  try {
    const volunteerAccount: AccountEntity = await adminReadAccount(scheduleReq.volunteerAccountId);
    donation = await scheduleDelivery(scheduleReq, volunteerAccount);
    res.send(donation);
  } catch (err) {
    return genErrorResponseRethrow(res, err);
  }

  // Send appropriate messages after the schedule operation and response to client.
  try {
    saveDeliveryScheduleAudit(scheduleReq, donation);
    if (scheduleReq.sendNotifications) {
      sendDeliveryScheduledMessages(donation);
    }
  } catch (err) {
    console.error(err);
  }
}

router.put('/', handlePutDelivery);
function handlePutDelivery(req: Request, res: Response): void {
  const deliverySaveReq: AdminDeliverySaveRequest = req.body;
  adminUpdateDelivery(deliverySaveReq)
    .then((donation: DonationEntity) => res.send(donation))
    .catch((err: Error) => console.error(err));
}

router.put('/advance/:id', adminHandlePutAdvanceDeliveryState);
async function adminHandlePutAdvanceDeliveryState(req: Request, res: Response): Promise<void> {
  const deliveryId: number = parseInt(req.params.id, 10);
  try {
    const delivery: DeliveryEntity = await readDelivery(deliveryId);
    handlePutAdvanceDeliveryState(req, res, delivery?.volunteerAccount);
  } catch (err) {
    console.log(err);
  }
}

router.put('/undo/:id', adminHandlePutUndoDeliveryState);
async function adminHandlePutUndoDeliveryState(req: Request, res: Response): Promise<void> {
  const deliveryId: number = parseInt(req.params.id, 10);
  try {
    const delivery: DeliveryEntity = await readDelivery(deliveryId);
    handlePutUndoDeliveryState(req, res, delivery?.volunteerAccount);
  } catch (err) {
    console.error(err);
  }
}
