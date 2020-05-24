import express = require('express');
import { router as accountRouter } from '~admin/controllers/admin-account';
import { router as deliveryRouter } from '~admin/controllers/admin-delivery';
import { router as donationRouter } from '~admin/controllers/admin-donation';
import { router as featuredEventRouter } from '~admin/controllers/admin-featured-event';
import { router as developerRouter } from '~admin/controllers/developer';
import { router as appDataRouter } from '~web/controllers/app-data';
import { router as heuristicsRouter } from '~web/controllers/heuristics';
import { router as mapRouter } from '~web/controllers/map';
import { router as notificationRouter } from '~web/controllers/notification';
import { router as sseRouter } from '~web/controllers/sse';

export const router = express.Router();

router.use('/account',        accountRouter);
router.use('/app-data',       appDataRouter);
router.use('/delivery',       deliveryRouter);
router.use('/developer',      developerRouter);
router.use('/donation',       donationRouter);
router.use('/featured-event', featuredEventRouter);
router.use('/heuristics',     heuristicsRouter);
router.use('/map',            mapRouter);
router.use('/notification',   notificationRouter);
router.use('/sse',            sseRouter);
