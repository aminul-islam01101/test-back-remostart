const passport = require('passport');
const express = require('express');
const { getRemoforceNotifications, remoMakeRead } = require('../controllers/notification.controller');

const router = express.Router();



// test route
router.get('/remoforce/all-notifications/:email', getRemoforceNotifications);
router.put('/remoforce/make-read', remoMakeRead);

module.exports = router;
