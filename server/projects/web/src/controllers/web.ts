import express = require('express');

// NOTE: It is necessary to do an import ... require so tree shaking doesn't get rid of any controllers.
import { router as accountRouter } from '~web/controllers/account';
import { router as appDataRouter } from '~web/controllers/app-data';
import { router as deliveryRouter } from '~web/controllers/delivery';
import { router as donationRouter } from '~web/controllers/donation';
import { router as featuredEventRouter } from '~web/controllers/featured-event';
import { router as heuristicsRouter } from '~web/controllers/heuristics';
import { router as mapRouter } from '~web/controllers/map';
import { router as notificationRouter } from '~web/controllers/notification';
import { router as sessionRouter } from '~web/controllers/session';
import { router as sseRouter } from '~web/controllers/sse';

export const router = express.Router();

router.use('/account',        accountRouter);
router.use('/app-data',       appDataRouter);
router.use('/delivery',       deliveryRouter);
router.use('/donation',       donationRouter);
router.use('/featured-event', featuredEventRouter);
router.use('/heuristics',     heuristicsRouter);
router.use('/map',            mapRouter);
router.use('/notification',   notificationRouter);
router.use('/session',        sessionRouter);
router.use('/sse',            sseRouter);
