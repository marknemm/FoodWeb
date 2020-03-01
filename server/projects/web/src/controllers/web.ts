import express = require('express');

const router = express.Router();

router.use('/account', require('~web/controllers/account'));
router.use('/app-data', require('~web/controllers/app-data'));
router.use('/delivery', require('~web/controllers/delivery'));
router.use('/donation', require('~web/controllers/donation'));
router.use('/featured-event', require('~web/controllers/featured-event'));
router.use('/heuristics', require('~web/controllers/heuristics'));
router.use('/map', require('~web/controllers/map'));
router.use('/notification', require('~web/controllers/notification'));
router.use('/session', require('~web/controllers/session'));
router.use('/sse', require('~web/controllers/sse'));

module.exports = router;
