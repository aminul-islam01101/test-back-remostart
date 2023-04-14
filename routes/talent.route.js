const express = require('express');
const { getMatchedTalents, getMatchedLastResults } = require('../controllers/talent.controller');

const router = express.Router();

router.post('/talent-request', getMatchedTalents);
router.get('/last-results', getMatchedLastResults);
module.exports = router;
