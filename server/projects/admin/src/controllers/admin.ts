import express = require('express');
import { Router } from 'express';

// NOTE: It is necessary to do an import ... require so tree shaking doesn't get rid of any controllers.
import adminAccountController = require('~admin/controllers/admin-account');
import developerController = require('~admin/controllers/developer');
import adminFeaturedEventController = require('~admin/controllers/admin-featured-event');

const router = express.Router();

router.use('/account',        <Router>adminAccountController);
router.use('/developer',      <Router>developerController);
router.use('/featured-event', <Router>adminFeaturedEventController);

module.exports = router;
