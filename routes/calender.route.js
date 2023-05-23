const express = require('express');
const { createEvent, getAccess, getRedirect, gotAccess, applicantCalenderAccess,   createApplicantEvent} = require('../controllers/calender.controller');

const router = express.Router();

// create user using POST method
// router.post('/', createUser);
router.post('/create-event', createEvent);
router.post('/create-applicant-event',    createApplicantEvent);
router.get('/access/:email', getAccess);
router.get('/access/:job/:id/:email', applicantCalenderAccess);
router.get('/got-access/:email', gotAccess);
router.get('/google/redirect', getRedirect);
// router.get('/applicant/google/redirect', applicantCalenderRedirect);



module.exports = router;
