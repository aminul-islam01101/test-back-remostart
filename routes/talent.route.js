const express = require('express');
const { getMatchedTalents } = require('../controllers/talent.controller');

const router = express.Router();

router.get('/talent-request', getMatchedTalents);
module.exports = router;
