const passport = require('passport');
const express = require('express');
const {
    getRemoforceNotifications,
    remoMakeRead,
    getStartupNotifications,
    startupMakeRead,
    remoforceMakeAllRead,
    startupMakeAllRead,
} = require('../controllers/notification.controller');

const router = express.Router();

// test route
router.get('/remoforce/all-notifications/:email', getRemoforceNotifications);
router.get('/startup/all-notifications/:email', getStartupNotifications);
router.put('/remoforce/make-read', remoMakeRead);
router.put('/startup/make-read', startupMakeRead);
router.put('/make-all-read/startup/:email', startupMakeAllRead);
router.put('/make-all-read/remoforce/:email', remoforceMakeAllRead);

module.exports = router;
