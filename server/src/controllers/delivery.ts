import express = require('express');
import { Request, Response } from 'express';
import { UpdateDiff } from '../interfaces/update-diff';
import { DonationEntity } from '../entity/donation.entity';
import { ensureSessionActive, ensureAccountVerified } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { genListResponse } from '../helpers/list-response';
import { DonationsQueryResult } from '../services/read-donations';
import { readUnscheduledDeliveries, readMyDeliveries, readDeliveries } from '../services/read-deliveries';
import { scheduleDelivery } from '../services/schedule-delivery';
import { advanceDeliveryState, undoDeliveryState } from '../services/update-delivery-state';
import { saveDeliveryScheduleAudit, saveDeliveryAdvanceAudit, saveDeliveryUndoAudit } from '../services/save-delivery-audit';
import { sendDeliveryStateUndoMessages, sendDeliveryStateAdvancedMessages } from '../services/update-delivery-state-message';
import { sendDeliveryScheduledMessages } from '../services/schedule-delivery-message';
import { DeliveryReadRequest } from '../../../shared/src/interfaces/delivery/delivery-read-request';
import { DeliveryScheduleRequest } from '../../../shared/src/interfaces/delivery/delivery-schedule-request';
import { DeliveryStateChangeRequest } from '../../../shared/src/interfaces/delivery/delivery-state-change-request';

const router = express.Router();

router.get('/unscheduled', (req: Request, res: Response) => {
  const readRequest: DeliveryReadRequest = req.query;
  readUnscheduledDeliveries(readRequest, req.session.account)
    .then((queryResult: DonationsQueryResult) =>
      res.send(genListResponse(queryResult.donations, queryResult.totalCount, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.get('/my', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const readRequest: DeliveryReadRequest = req.query;
  readMyDeliveries(readRequest, req.session.account)
    .then((queryResult: DonationsQueryResult) =>
      res.send(genListResponse(queryResult.donations, queryResult.totalCount, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: DeliveryReadRequest = req.query;
  readDeliveries(readRequest, req.session.account)
    .then((queryResult: DonationsQueryResult) =>
      res.send(genListResponse(queryResult.donations, queryResult.totalCount, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const scheduleReq: DeliveryScheduleRequest = req.body;
  scheduleDelivery(scheduleReq, req.session.account)
    .then((scheduledDelivery: DonationEntity) => saveDeliveryScheduleAudit(scheduleReq, scheduledDelivery))
    .then((scheduledDelivery: DonationEntity) => sendDeliveryScheduledMessages(scheduledDelivery))
    .then((scheduledDelivery: DonationEntity) => res.send(scheduledDelivery))
    .catch(handleError.bind(this, res));
});

router.put('/advance/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const stateChangeReq: DeliveryStateChangeRequest = req.body;
  stateChangeReq.deliveryId = parseInt(req.params.id, 10);
  advanceDeliveryState(stateChangeReq, req.session.account)
    .then((advancedDelivery: DonationEntity) => saveDeliveryAdvanceAudit(stateChangeReq, advancedDelivery))
    .then((advancedDelivery: DonationEntity) => sendDeliveryStateAdvancedMessages(advancedDelivery))
    .then((advancedDelivery: DonationEntity) => res.send(advancedDelivery))
    .catch(handleError.bind(this, res));
});

router.put('/undo/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const stateChangeReq: DeliveryStateChangeRequest = req.body;
  stateChangeReq.deliveryId = parseInt(req.params.id, 10);
  undoDeliveryState(stateChangeReq, req.session.account)
    .then((undoDiff: UpdateDiff<DonationEntity>) => saveDeliveryUndoAudit(stateChangeReq, undoDiff))
    .then((undoDiff: UpdateDiff<DonationEntity>) => sendDeliveryStateUndoMessages(undoDiff))
    .then((undoneDelivery: DonationEntity) => res.send(undoneDelivery))
    .catch(handleError.bind(this, res));
});

module.exports = router;
