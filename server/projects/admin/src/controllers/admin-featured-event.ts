import express = require('express');
import { Request, Response } from 'express';
import { deleteFeaturedEvent } from '~admin/services/admin-featured-event/delete-featured-event';
import { sendFeaturedEventCancelledMessages } from '~admin/services/admin-featured-event/featured-event-cancelled-message';
import { readEventRegistrations } from '~admin/services/admin-featured-event/read-event-registrations';
import { readFeaturedEventIdentifiers } from '~admin/services/admin-featured-event/read-featured-event-identifiers';
import { saveFeaturedEvent } from '~admin/services/admin-featured-event/save-featured-event';
import { EventRegistrationEntity } from '~entity';
import { FeaturedEventEntity } from '~entity';
import { FeaturedEvent, FeaturedEventCreateRequest, FeaturedEventUpdateRequest } from '~shared';
import { genErrorResponse, genErrorResponseRethrow } from '~web/middlewares/response-error.middleware';
import { readFeaturedEvent } from '~web/services/featured-event/read-featured-events';

const router = express.Router();

router.get('/identifiers', (req: Request, res: Response) => {
  readFeaturedEventIdentifiers()
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
