import express = require('express');
import { Request, Response } from 'express';
import { EventRegistrationEntity } from '~entity';
import { EventRegistrationCreateRequest, FeaturedEvent, FeaturedEventRequest, ListResponse } from '~shared';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middleware/response-error.middleware';
import { sendEventRegistrationMessage } from '~web/services/featured-event/event-registration-message';
import { readFeaturedEvents } from '~web/services/featured-event/read-featured-events';
import { saveEventRegistration } from '~web/services/featured-event/save-event-registration';

export const router = express.Router();

router.get('/', handleGetFeaturedEvents);
export function handleGetFeaturedEvents(req: Request, res: Response) {
  const eventRequest: FeaturedEventRequest = req.query;
  readFeaturedEvents(eventRequest)
    .then((listRes: ListResponse<FeaturedEvent>) => res.send(listRes))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/registration', handlePostFeaturedEventRegistration);
export function handlePostFeaturedEventRegistration(req: Request, res: Response) {
  const registrationReq: EventRegistrationCreateRequest = req.body;
  saveEventRegistration(registrationReq.eventRegistration)
    .then((eventRegistration: EventRegistrationEntity) => { res.send(); return eventRegistration; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((eventRegistration: EventRegistrationEntity) => sendEventRegistrationMessage(eventRegistration))
    .catch((err: Error) => console.error(err));
}
