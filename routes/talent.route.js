const express = require('express');
const { getMatchedTalents, getMatchedLastResults, getMyRequests } = require('../controllers/talent.controller');

const router = express.Router();

router.post('/talent-request', getMatchedTalents);
router.get('/last-results', getMatchedLastResults);
router.get('/my-requests', getMyRequests);
module.exports = router;
