import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity, DonationEntity } from '~entity';
import { DeliveryScheduleRequest, DeliveryStateChangeRequest, DonationReadRequest, ListResponse } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middleware/response-error.middleware';
import { ensureAccountVerified, ensureSessionActive } from '~web/middleware/session.middleware';
import { saveDeliveryAdvanceAudit, saveDeliveryScheduleAudit, saveDeliveryUndoAudit } from '~web/services/audit/save-delivery-audit';
import { readDonationsWithDeliveries, readMyDeliveries, readUnscheduledDeliveries } from '~web/services/delivery/read-deliveries';
import { scheduleDelivery } from '~web/services/delivery/schedule-delivery';
import { sendDeliveryScheduledMessages } from '~web/services/delivery/schedule-delivery-message';
import { advanceDeliveryState, undoDeliveryState } from '~web/services/delivery/update-delivery-state';
import { sendDeliveryStateAdvancedMessages, sendDeliveryStateUndoMessages } from '~web/services/delivery/update-delivery-state-message';

export const router = express.Router();

router.get('/', handleGetDeliveries);
export function handleGetDeliveries(req: Request, res: Response) {
  const readRequest: DonationReadRequest = req.query;
  readDonationsWithDeliveries(readRequest)
    .then((listRes: ListResponse<DonationEntity>) => res.send(listRes))
    .catch(genErrorResponse.bind(this, res));
}

router.get('/my', ensureSessionActive, ensureAccountVerified, handleGetMyDeliveries);
export function handleGetMyDeliveries(req: Request, res: Response) {
  const readRequest: DonationReadRequest = req.query;
  readMyDeliveries(readRequest, req.session.account)
    .then((listRes: ListResponse<DonationEntity>) => res.send(listRes))
    .catch(genErrorResponse.bind(this, res));
}

router.get('/unscheduled', handleGetUnscheduledDeliveries);
export function handleGetUnscheduledDeliveries(req: Request, res: Response) {
  const readRequest: DonationReadRequest = req.query;
  readUnscheduledDeliveries(readRequest)
    .then((listRes: ListResponse<DonationEntity>) => res.send(listRes))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/', ensureSessionActive, ensureAccountVerified, handlePostDelivery);
export function handlePostDelivery(req: Request, res: Response) {
  const scheduleReq: DeliveryScheduleRequest = req.body;
  scheduleDelivery(scheduleReq, req.session.account)
    .then((scheduledDelivery: DonationEntity) => { res.send(scheduledDelivery); return scheduledDelivery; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((scheduledDelivery: DonationEntity) => saveDeliveryScheduleAudit(scheduleReq, scheduledDelivery))
    .then((scheduledDelivery: DonationEntity) => sendDeliveryScheduledMessages(scheduledDelivery))
    .catch((err: Error) => console.error(err));
}

router.put(
  '/advance/:id',
  ensureSessionActive, ensureAccountVerified,
  (req: Request, res: Response) => handlePutAdvanceDeliveryState(req, res)
);
export function handlePutAdvanceDeliveryState(req: Request, res: Response, account: AccountEntity = req.session.account): Promise<any> {
  const stateChangeReq: DeliveryStateChangeRequest = req.body;
  stateChangeReq.deliveryId = parseInt(req.params.id, 10);
  return advanceDeliveryState(stateChangeReq, account)
    .then((advancedDelivery: DonationEntity) => { res.send(advancedDelivery); return advancedDelivery; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((advancedDelivery: DonationEntity) => saveDeliveryAdvanceAudit(stateChangeReq, advancedDelivery))
    .then((advancedDelivery: DonationEntity) => sendDeliveryStateAdvancedMessages(advancedDelivery))
    .catch((err: Error) => console.error(err));
}

router.put(
  '/undo/:id',
  ensureSessionActive, ensureAccountVerified,
  (req: Request, res: Response) => handlePutUndoDeliveryState(req, res)
);
export function handlePutUndoDeliveryState(req: Request, res: Response, account: AccountEntity = req.session.account) {
  const stateChangeReq: DeliveryStateChangeRequest = req.body;
  stateChangeReq.deliveryId = parseInt(req.params.id, 10);
  undoDeliveryState(stateChangeReq, account)
    .then((undoDiff: UpdateDiff<DonationEntity>) => { res.send(undoDiff.new); return undoDiff; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((undoDiff: UpdateDiff<DonationEntity>) => saveDeliveryUndoAudit(stateChangeReq, undoDiff))
    .then((undoDiff: UpdateDiff<DonationEntity>) => sendDeliveryStateUndoMessages(undoDiff))
    .catch((err: Error) => console.error(err));
}
