const express = require('express');
const {
    getMatchedTalents,
    getMatchedLastResults,
    getMyRequests,
    interviewRequests,
    remoforceRequestAcceptance,
    getAvailableSlots,
    createdEvents,
    getStartupsDetail,
    remoforceRequestRejection,
    createPayments 

} = require('../controllers/talent.controller');

const router = express.Router();

router.post('/talent-request', getMatchedTalents);
router.get('/last-results', getMatchedLastResults);
router.get('/my-requests', getMyRequests);
router.post('/interview-requests', interviewRequests);
router.post('/remo-request-acceptance', remoforceRequestAcceptance);
router.put('/remo-request-rejection', remoforceRequestRejection);
router.get('/available-slots', getAvailableSlots);
router.get('/created-events', createdEvents);
router.get('/get-startup', getStartupsDetail);
router.post('/payment-details', createPayments );


module.exports = router;
