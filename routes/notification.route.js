const passport = require('passport');
const express = require('express');
const { getRemoforceNotifications, remoMakeRead, getStartupNotifications,startupMakeRead } = require('../controllers/notification.controller');

const router = express.Router();



// test route
router.get('/remoforce/all-notifications/:email', getRemoforceNotifications);
router.get('/startup/all-notifications/:email', getStartupNotifications);
router.put('/remoforce/make-read', remoMakeRead);
router.put('/startup/make-read', startupMakeRead);

module.exports = router;
