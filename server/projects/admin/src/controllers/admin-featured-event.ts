import express = require('express');
import { Request, Response } from 'express';
import { adminDeleteFeaturedEvent } from '~admin/services/admin-featured-event/admin-delete-featured-event';
import { adminSendFeaturedEventCancelledMessages } from '~admin/services/admin-featured-event/admin-featured-event-cancelled-message';
import { adminReadEventRegistrations } from '~admin/services/admin-featured-event/admin-read-event-registrations';
import { adminSaveFeaturedEvent } from '~admin/services/admin-featured-event/admin-save-featured-event';
import { FeaturedEventEntity } from '~entity';
import { FeaturedEvent, FeaturedEventCreateRequest, FeaturedEventUpdateRequest } from '~shared';
import { handleGetFeaturedEvents, handlePostFeaturedEventRegistration } from '~web/controllers/featured-event';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middleware/response-error.middleware';
import { readFeaturedEvent } from '~web/services/featured-event/read-featured-events';

export const router = express.Router();

// Use web featured event controller route handler.
router.get('/', handleGetFeaturedEvents);

router.get('/:id', handleGetFeaturedEvent);
function handleGetFeaturedEvent(req: Request, res: Response) {
  const featuredEventId: number = Number.parseInt(req.params.id, 10);
  readFeaturedEvent(featuredEventId)
    .then((featuredEvent: FeaturedEvent) => {
      res.send(featuredEvent);
    })
    .catch(genErrorResponse.bind(this, res));
}

router.get('/:id/registrations', handleGetEventRegistrations);
function handleGetEventRegistrations(req: Request, res: Response) {
  const featuredEventId: number = Number.parseInt(req.params.id, 10);
  adminReadEventRegistrations(featuredEventId)
    .then((featuredEvent: FeaturedEventEntity) => res.send(featuredEvent))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/', handlePostFeaturedEvent);
function handlePostFeaturedEvent(req: Request, res: Response) {
  const createRequest: FeaturedEventCreateRequest = req.body;
  adminSaveFeaturedEvent(createRequest.featuredEvent)
    .then((featuredEvent: FeaturedEventEntity) => { res.send(featuredEvent); return featuredEvent; })
    .catch(genErrorResponse.bind(this, res));
    // TODO: Audit event creation.
}

// Use web featured event controller route handler.
router.post('/', handlePostFeaturedEventRegistration);

router.put('/:id', handlePutFeaturedEvent);
function handlePutFeaturedEvent(req: Request, res: Response) {
  const updateRequest: FeaturedEventUpdateRequest = req.body;
  adminSaveFeaturedEvent(updateRequest.featuredEvent)
    .then((featuredEvent: FeaturedEvent) => { res.send(featuredEvent); return featuredEvent; })
    .catch(genErrorResponse.bind(this, res));
    // TODO: Audit event update.
}

router.delete('/:id', handleDeleteFeaturedEvent);
function handleDeleteFeaturedEvent(req: Request, res: Response) {
  const featuredEventId: number = Number.parseInt(req.params.id, 10);
  adminDeleteFeaturedEvent(featuredEventId)
    .then((featuredEvent: FeaturedEventEntity) => { res.send(featuredEvent); return featuredEvent; })
    .catch(genErrorResponseRethrow.bind(this, res))
    .then((featuredEvent: FeaturedEventEntity) => adminSendFeaturedEventCancelledMessages(featuredEvent))
    .catch((err: Error) => console.error(err));
    // TODO: Audit event deletion.
}
