const express = require('express');
const addFeedback = require('../controllers/feedback.controller');
const router = express.Router();

router.post('/', addFeedback)

module.exports = router;