import express = require('express');
import { Request, Response } from 'express';
import { deleteFeaturedEvent } from '~admin/services/admin-featured-event/delete-featured-event';
import { sendFeaturedEventCancelledMessages } from '~admin/services/admin-featured-event/featured-event-cancelled-message';
import { readEventRegistrations } from '~admin/services/admin-featured-event/read-event-registrations';
import { readFeaturedEventIdentifiers } from '~admin/services/admin-featured-event/read-featured-event-identifiers';
import { saveFeaturedEvent } from '~admin/services/admin-featured-event/save-featured-event';
import { EventRegistrationEntity, FeaturedEventEntity } from '~entity';
import { FeaturedEvent, FeaturedEventCreateRequest, FeaturedEventUpdateRequest } from '~shared';
import { handleGetFeaturedEvents, handlePostFeaturedEventRegistration } from '~web/controllers/featured-event';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { readFeaturedEvent } from '~web/services/featured-event/read-featured-events';

export const router = express.Router();

// Use web featured event controller route handler.
router.get('/', handleGetFeaturedEvents);

router.get('/identifiers', handleGetEventIdentifiers);
function handleGetEventIdentifiers(req: Request, res: Response) {
  readFeaturedEventIdentifiers()
    .then((featuerdEventIdentifiers: Partial<FeaturedEvent>[]) => res.send(featuerdEventIdentifiers))
    .catch(genErrorResponse.bind(this, res));
}

router.get('/:id', handleGetFeaturedEvent);
function handleGetFeaturedEvent(req: Request, res: Response) {
  const featuredEventId: number = Number.parseInt(req.params.id, 10);
  readFeaturedEvent(featuredEventId)
    .then((featuredEvent: FeaturedEvent) => {
      res.send(featuredEvent)
    })
    .catch(genErrorResponse.bind(this, res));
}

router.get('/:id/registrations', handleGetEventRegistrations);
function handleGetEventRegistrations(req: Request, res: Response) {
  const featuredEventId: number = Number.parseInt(req.params.id, 10);
  readEventRegistrations(featuredEventId)
    .then((registrations: EventRegistrationEntity[]) => res.send(registrations))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/', handlePostFeaturedEvent);
function handlePostFeaturedEvent(req: Request, res: Response) {
  const createRequest: FeaturedEventCreateRequest = req.body;
  saveFeaturedEvent(createRequest.featuredEvent)
    .then((featuredEvent: FeaturedEventEntity) => { res.send(featuredEvent); return featuredEvent; })
    .catch(genErrorResponse.bind(this, res));
    // TODO: Audit event creation.
}

// Use web featured event controller route handler.
router.post('/', handlePostFeaturedEventRegistration);

router.put('/:id', handlePutFeaturedEvent);
function handlePutFeaturedEvent(req: Request, res: Response) {
  const updateRequest: FeaturedEventUpdateRequest = req.body;
  saveFeaturedEvent(updateRequest.featuredEvent)
    .then((featuredEvent: FeaturedEvent) => { res.send(featuredEvent); return featuredEvent; })
    .catch(genErrorResponse.bind(this, res));
    // TODO: Audit event update.
}

router.delete('/:id', handleDeleteFeaturedEvent);
function handleDeleteFeaturedEvent(req: Request, res: Response) {
  const featuredEventId: number = Number.parseInt(req.params.id, 10);
  deleteFeaturedEvent(featuredEventId)
    .then((featuredEvent: FeaturedEventEntity) => { res.send(featuredEvent); return featuredEvent; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((featuredEvent: FeaturedEventEntity) => sendFeaturedEventCancelledMessages(featuredEvent))
    .catch((err: Error) => console.error(err));
    // TODO: Audit event deletion.
}
