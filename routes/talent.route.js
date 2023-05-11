const express = require('express');
const {
    getMatchedTalents,
    getMatchedLastResults,
    getMyRequests,
    interviewRequests,
    remoforceRequestAcceptance,
    getAvailableSlots,
} = require('../controllers/talent.controller');

const router = express.Router();

router.post('/talent-request', getMatchedTalents);
router.get('/last-results', getMatchedLastResults);
router.get('/my-requests', getMyRequests);
router.post('/interview-requests', interviewRequests);
router.post('/remo-request-acceptance', remoforceRequestAcceptance);
router.get('/available-slots', getAvailableSlots);
module.exports = router;
