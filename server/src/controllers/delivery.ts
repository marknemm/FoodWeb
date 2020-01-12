import express = require('express');
import { Request, Response } from 'express';
import { DonationEntity } from '../entity/donation.entity';
import { QueryResult } from '../helpers/database/query-builder-helper';
import { genListResponse } from '../helpers/response/list-response';
import { UpdateDiff } from '../interfaces/update-diff';
import { genErrorResponse, genErrorResponseRethrow } from '../middlewares/response-error.middleware';
import { ensureAccountVerified, ensureSessionActive } from '../middlewares/session.middleware';
import { saveDeliveryAdvanceAudit, saveDeliveryScheduleAudit, saveDeliveryUndoAudit } from '../services/audit/save-delivery-audit';
import { readDeliveries, readMyDeliveries, readUnscheduledDeliveries } from '../services/delivery/read-deliveries';
import { scheduleDelivery } from '../services/delivery/schedule-delivery';
import { sendDeliveryScheduledMessages } from '../services/delivery/schedule-delivery-message';
import { advanceDeliveryState, undoDeliveryState } from '../services/delivery/update-delivery-state';
import { sendDeliveryStateAdvancedMessages, sendDeliveryStateUndoMessages } from '../services/delivery/update-delivery-state-message';
import { DeliveryReadRequest, DeliveryScheduleRequest, DeliveryStateChangeRequest } from '../shared';

const router = express.Router();

router.get('/unscheduled', (req: Request, res: Response) => {
  const readRequest: DeliveryReadRequest = req.query;
  readUnscheduledDeliveries(readRequest, req.session.account)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
});

router.get('/my', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const readRequest: DeliveryReadRequest = req.query;
  readMyDeliveries(readRequest, req.session.account)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
});

router.get('/', (req: Request, res: Response) => {
  const readRequest: DeliveryReadRequest = req.query;
  readDeliveries(readRequest)
    .then((queryResult: QueryResult<DonationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
});

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const scheduleReq: DeliveryScheduleRequest = req.body;
  scheduleDelivery(scheduleReq, req.session.account)
    .then((scheduledDelivery: DonationEntity) => { res.send(scheduledDelivery); return scheduledDelivery; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((scheduledDelivery: DonationEntity) => saveDeliveryScheduleAudit(scheduleReq, scheduledDelivery))
    .then((scheduledDelivery: DonationEntity) => sendDeliveryScheduledMessages(scheduledDelivery))
    .catch((err: Error) => console.error(err));
});

router.put('/advance/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const stateChangeReq: DeliveryStateChangeRequest = req.body;
  stateChangeReq.deliveryId = parseInt(req.params.id, 10);
  advanceDeliveryState(stateChangeReq, req.session.account)
    .then((advancedDelivery: DonationEntity) => { res.send(advancedDelivery); return advancedDelivery; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((advancedDelivery: DonationEntity) => saveDeliveryAdvanceAudit(stateChangeReq, advancedDelivery))
    .then((advancedDelivery: DonationEntity) => sendDeliveryStateAdvancedMessages(advancedDelivery))
    .catch((err: Error) => console.error(err));
});

router.put('/undo/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const stateChangeReq: DeliveryStateChangeRequest = req.body;
  stateChangeReq.deliveryId = parseInt(req.params.id, 10);
  undoDeliveryState(stateChangeReq, req.session.account)
    .then((undoDiff: UpdateDiff<DonationEntity>) => { res.send(undoDiff.new); return undoDiff; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((undoDiff: UpdateDiff<DonationEntity>) => saveDeliveryUndoAudit(stateChangeReq, undoDiff))
    .then((undoDiff: UpdateDiff<DonationEntity>) => sendDeliveryStateUndoMessages(undoDiff))
    .catch((err: Error) => console.error(err));
});

module.exports = router;
