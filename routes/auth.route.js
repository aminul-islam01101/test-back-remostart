const passport = require('passport');
const express = require('express');
const {
    register,
    login,
    user,
    forgotPass,
    resetPass,
    verifyEmail,
    resendOtp,
    getRemoforceScore, getStartupScore
} = require('../controllers/auth.controller');
const { userVerifier } = require('../middleware/userVerifier');

const router = express.Router();

// register route
router.post('/register', register);

// login route
router.post('/login', login);
router.post('/forget-pass', forgotPass);
router.post('/reset-pass', resetPass);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.get('/profile-score/remoforce/:email', getRemoforceScore);
router.get('/profile-score/startup/:email', getStartupScore);

// test route
// router.get('/user', userVerifier, user);
router.get('/user', passport.authenticate('jwt', { session: false }), user);

module.exports = router;
