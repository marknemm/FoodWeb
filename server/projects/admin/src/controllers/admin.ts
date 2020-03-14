import express = require('express');

const router = express.Router();

router.use('/account', require('~admin/controllers/admin-account'));
router.use('/featured-event', require('~admin/controllers/admin-featured-event'));

module.exports = router;