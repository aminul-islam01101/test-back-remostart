const express = require('express');
const { createEvent, getAccess, getRedirect, gotAccess} = require('../controllers/calender.controller');

const router = express.Router();

// create user using POST method
// router.post('/', createUser);
router.post('/create-event', createEvent);
router.get('/access/:email', getAccess);
router.get('/got-access/:email', gotAccess);
router.get('/google/redirect', getRedirect);



module.exports = router;
