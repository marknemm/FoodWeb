import express = require('express');
import { Request, Response } from 'express';
import { handleError } from '../middlewares/response-error.middleware';
import { saveEventRegistration } from '../services/save-event-registration';
import { readEventRegistrations, EventRegistrationsQueryResult } from '../services/read-event-registrations';
import { genListResponse } from '../helpers/list-response';
import { EventRegistrationRequest } from './../../../shared/src/interfaces/event/event-registration-request';

const router = express.Router();

router.post('/registration', (req: Request, res: Response) => {
  const registrationReq: EventRegistrationRequest = req.body;
  saveEventRegistration(registrationReq.eventRegistration)
    .then(() => res.send())
    .catch((err: Error) => handleError(res, err));
});

router.get('/registration', (req: Request, res: Response) => {
  readEventRegistrations(null) // TODO: Implement filters for event title-date.
    .then((queryResult: EventRegistrationsQueryResult) =>
      res.send(genListResponse(queryResult.registrations, queryResult.totalCount, {}))
    ).catch((err: Error) => handleError(res, err));
});

module.exports = router;
