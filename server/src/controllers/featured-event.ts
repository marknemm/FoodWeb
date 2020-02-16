import express = require('express');
import { Request, Response } from 'express';
import { EventRegistrationEntity } from '../entity/event-registration.entity';
import { FeaturedEventEntity } from '../entity/featured-event.entity';
import { QueryResult } from '../helpers/database/query-builder-helper';
import { genListResponse } from '../helpers/response/list-response';
import { genErrorResponse, genErrorResponseRethrow } from '../middlewares/response-error.middleware';
import { deleteFeaturedEvent } from '../services/featured-event/delete-featured-event';
import { sendEventRegistrationMessage } from '../services/featured-event/event-registration-message';
import { sendFeaturedEventCancelledMessages } from '../services/featured-event/featured-event-cancelled-message';
import { readEventRegistrations } from '../services/featured-event/read-event-registrations';
import { readAllFeaturedEventIdentifiers, readFeaturedEvent, readFeaturedEvents } from '../services/featured-event/read-featured-events';
import { saveEventRegistration } from '../services/featured-event/save-event-registration';
import { saveFeaturedEvent } from '../services/featured-event/save-featured-event';
import { EventRegistrationCreateRequest, FeaturedEvent, FeaturedEventCreateRequest, FeaturedEventRequest, FeaturedEventUpdateRequest } from '../shared';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const eventRequest: FeaturedEventRequest = req.query;
  readFeaturedEvents(eventRequest)
    .then((queryResult: QueryResult<FeaturedEvent>) =>
      res.send(genListResponse(queryResult, eventRequest))
    ).catch(genErrorResponse.bind(this, res));
});

router.get('/identifiers', (req: Request, res: Response) => {
  readAllFeaturedEventIdentifiers()
    .then((featuerdEventIdentifiers: Partial<FeaturedEvent>[]) => res.send(featuerdEventIdentifiers))
    .catch(genErrorResponse.bind(this, res));
});

router.get('/:id', (req: Request, res: Response) => {
  const featuredEventId: number = Number.parseInt(req.params.id, 10);
  readFeaturedEvent(featuredEventId)
    .then((featuredEvent: FeaturedEvent) => {
      res.send(featuredEvent)
    })
    .catch(genErrorResponse.bind(this, res));
});

router.get('/:id/registrations', (req: Request, res: Response) => {
  const featuredEventId: number = Number.parseInt(req.params.id, 10);
  readEventRegistrations(featuredEventId)
    .then((registrations: EventRegistrationEntity[]) => res.send(registrations))
    .catch(genErrorResponse.bind(this, res));
});

router.post('/', (req: Request, res: Response) => {
  const createRequest: FeaturedEventCreateRequest = req.body;
  saveFeaturedEvent(createRequest.featuredEvent)
    .then((featuredEvent: FeaturedEventEntity) => { res.send(featuredEvent); return featuredEvent; })
    .catch(genErrorResponse.bind(this, res));
    // TODO: Audit event creation.
});

router.post('/registration', (req: Request, res: Response) => {
  const registrationReq: EventRegistrationCreateRequest = req.body;
  saveEventRegistration(registrationReq.eventRegistration)
    .then((eventRegistration: EventRegistrationEntity) => { res.send(); return eventRegistration; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((eventRegistration: EventRegistrationEntity) => sendEventRegistrationMessage(eventRegistration))
    .catch((err: Error) => console.error(err));
});

router.put('/:id', (req: Request, res: Response) => {
  const updateRequest: FeaturedEventUpdateRequest = req.body;
  saveFeaturedEvent(updateRequest.featuredEvent)
    .then((featuredEvent: FeaturedEvent) => { res.send(featuredEvent); return featuredEvent; })
    .catch(genErrorResponse.bind(this, res));
    // TODO: Audit event update.
});

router.delete('/:id', (req: Request, res: Response) => {
  const featuredEventId: number = Number.parseInt(req.params.id, 10);
  deleteFeaturedEvent(featuredEventId)
    .then((featuredEvent: FeaturedEventEntity) => { res.send(featuredEvent); return featuredEvent; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((featuredEvent: FeaturedEventEntity) => sendFeaturedEventCancelledMessages(featuredEvent))
    .catch((err: Error) => console.error(err));
    // TODO: Audit event deletion.
});

module.exports = router;
