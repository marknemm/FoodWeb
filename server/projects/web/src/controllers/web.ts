import express = require('express');
import { Router } from 'express';

// NOTE: It is necessary to do an import ... require so tree shaking doesn't get rid of any controllers.
import accountController = require('~web/controllers/account');
import appDataController = require('~web/controllers/app-data');
import deliveryController = require('~web/controllers/delivery');
import donationController = require('~web/controllers/donation');
import featuredEventController = require('~web/controllers/featured-event');
import heuristicsController = require('~web/controllers/heuristics');
import mapController = require('~web/controllers/map');
import notificationController = require('~web/controllers/notification');
import sessionController = require('~web/controllers/session');
import sseController = require('~web/controllers/sse');

const router = express.Router();

router.use('/account',        <Router>accountController);
router.use('/app-data',       <Router>appDataController);
router.use('/delivery',       <Router>deliveryController);
router.use('/donation',       <Router>donationController);
router.use('/featured-event', <Router>featuredEventController);
router.use('/heuristics',     <Router>heuristicsController);
router.use('/map',            <Router>mapController);
router.use('/notification',   <Router>notificationController);
router.use('/session',        <Router>sessionController);
router.use('/sse',            <Router>sseController);

module.exports = router;
