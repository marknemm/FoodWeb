import express = require('express');
import { Request, Response } from 'express';
import { DonationEntity } from '../entity/donation.entity';
import { genListResponse } from '../helpers/list-response';
import { QueryResult } from '../helpers/query-builder-helper';
import { UpdateDiff } from '../interfaces/update-diff';
import { handleError } from '../middlewares/response-error.middleware';
import { ensureAccountVerified, ensureSessionActive } from '../middlewares/session.middleware';
import { readDeliveries, readMyDeliveries, readUnscheduledDeliveries } from '../services/read-deliveries';
import { saveDeliveryAdvanceAudit, saveDeliveryScheduleAudit, saveDeliveryUndoAudit } from '../services/save-delivery-audit';
import { scheduleDelivery } from '../services/schedule-delivery';
import { sendDeliveryScheduledMessages } from '../services/schedule-delivery-message';
import { advanceDeliveryState, undoDeliveryState } from '../services/update-delivery-state';
import { sendDeliveryStateAdvancedMessages, sendDeliveryStateUndoMessages } from '../services/update-delivery-state-message';
import { DeliveryReadRequest, DeliveryScheduleRequest, DeliveryStateChangeRequest } from '../shared';

const router = express.Router();

router.get('/unscheduled', (req: Request, res: Response) => {
  const readRequest: DeliveryReadRequest = req.query;
  readUnscheduledDeliveries(readRequest, req.session.account)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.get('/my', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const readRequest: DeliveryReadRequest = req.query;
  readMyDeliveries(readRequest, req.session.account)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: DeliveryReadRequest = req.query;
  readDeliveries(readRequest)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
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
