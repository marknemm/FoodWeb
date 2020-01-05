import express = require('express');
import { Request, Response } from 'express';
import { EventRegistrationEntity } from '../entity/event-registration.entity';
import { genListResponse } from '../helpers/list-response';
import { QueryResult } from '../helpers/query-builder-helper';
import { genErrorResponse } from '../middlewares/response-error.middleware';
import { readEventRegistrations } from '../services/read-event-registrations';
import { saveEventRegistration } from '../services/save-event-registration';
import { EventRegistrationRequest } from '../shared';

const router = express.Router();

router.post('/registration', (req: Request, res: Response) => {
  const registrationReq: EventRegistrationRequest = req.body;
  saveEventRegistration(registrationReq.eventRegistration)
    .then(() => res.send())
    .catch(genErrorResponse.bind(this, res));
});

router.get('/registration', (req: Request, res: Response) => {
  readEventRegistrations(null) // TODO: Implement filters for event title-date.
    .then((queryResult: QueryResult<EventRegistrationEntity>) =>
      res.send(genListResponse(queryResult, {}))
    ).catch(genErrorResponse.bind(this, res));
});

module.exports = router;
