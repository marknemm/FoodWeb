import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive, ensureAccountVerified } from '../middlewares/session.middleware';
import { handleError } from '../middlewares/response-error.middleware';
import { genListResponse } from '../helpers/list-response';
import { DonationsQueryResult } from '../services/read-donations';
import { readUnscheduledDeliveries, readMyDeliveries, readDeliveries } from '../services/read-deliveries';
import { scheduleDelivery } from '../services/schedule-delivery';
import { advanceDeliveryState, undoDeliveryState } from '../services/update-delivery-state';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
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
  readDeliveries(readRequest)
    .then((queryResult: DonationsQueryResult) =>
      res.send(genListResponse(queryResult.donations, queryResult.totalCount, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.post('/', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const scheduleRequest: DeliveryScheduleRequest = req.body;
  scheduleDelivery(scheduleRequest, req.session.account)
    .then((scheduledDonation: Donation) => res.send(scheduledDonation))
    .catch(handleError.bind(this, res));
});

router.put('/advance/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const stateChangeRequest: DeliveryStateChangeRequest = req.body;
  stateChangeRequest.deliveryId = parseInt(req.params.id, 10);
  advanceDeliveryState(stateChangeRequest, req.session.account)
    .then((advancedDonation: Donation) => res.send(advancedDonation))
    .catch(handleError.bind(this, res));
});

router.put('/undo/:id', ensureSessionActive, ensureAccountVerified, (req: Request, res: Response) => {
  const stateChangeRequest: DeliveryStateChangeRequest = req.body;
  stateChangeRequest.deliveryId = parseInt(req.params.id, 10);
  undoDeliveryState(stateChangeRequest, req.session.account)
    .then((undoneDonation: Donation) => res.send(undoneDonation))
    .catch(handleError.bind(this, res));
});

module.exports = router;
