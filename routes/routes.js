const express = require('express');
const path = require('path');

const usersRouter = require('./users.route');
const authRouter = require('./auth.route');
const startupRouter = require('./startup.route');
const remoforceRouter = require('./remoforce.route');
const jobRouter = require('./job.route');
const talentRouter = require('./talent.route');

const googleRoute = require('./google.route');
const linkedinRoute = require('./linkedin.route');
const CalenderRoute = require('./calender.route');
const NotificationRoute = require('./notification.route');
const feedbackRoute = require('./feedback.route');
const projectRoute = require('./project.route');

const router = express.Router();
// home route
// router.get('/', (_req, res) => {
//     res.send('test server is running');
// });
router.get('^/$|/index(.html)?', (_req, res) => {
    // res.send('test server is running');
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// business route
router.use('/api/users', usersRouter);
router.use('/api/auth', authRouter);
router.use('/api/startup', startupRouter);
router.use('/api/remoforce', remoforceRouter);
router.use('/api/talent', talentRouter);
router.use('/api/job', jobRouter);
router.use('/auth', googleRoute);
router.use('/auth', linkedinRoute);
router.use('/calender', CalenderRoute);
router.use('/api/notification', NotificationRoute);
router.use('/api/feedback', feedbackRoute);
router.use('/api/projects', projectRoute);

module.exports = router;
