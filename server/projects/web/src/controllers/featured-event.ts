import express = require('express');
import { Request, Response } from 'express';
import { EventRegistrationEntity } from '~entity';
import { QueryResult } from '~orm';
import { EventRegistrationCreateRequest, FeaturedEvent, FeaturedEventRequest } from '~shared';
import { genListResponse } from '~web/helpers/response/list-response';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { sendEventRegistrationMessage } from '~web/services/featured-event/event-registration-message';
import { readFeaturedEvents } from '~web/services/featured-event/read-featured-events';
import { saveEventRegistration } from '~web/services/featured-event/save-event-registration';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const eventRequest: FeaturedEventRequest = req.query;
  readFeaturedEvents(eventRequest)
    .then((queryResult: QueryResult<FeaturedEvent>) =>
      res.send(genListResponse(queryResult, eventRequest))
    ).catch(genErrorResponse.bind(this, res));
});

router.post('/registration', (req: Request, res: Response) => {
  const registrationReq: EventRegistrationCreateRequest = req.body;
  saveEventRegistration(registrationReq.eventRegistration)
    .then((eventRegistration: EventRegistrationEntity) => { res.send(); return eventRegistration; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((eventRegistration: EventRegistrationEntity) => sendEventRegistrationMessage(eventRegistration))
    .catch((err: Error) => console.error(err));
});

module.exports = router;
