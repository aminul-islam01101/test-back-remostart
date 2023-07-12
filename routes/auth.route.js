const passport = require('passport');
const express = require('express');
const { register, login, user, forgotPass , resetPass} = require('../controllers/auth.controller');
const { userVerifier } = require('../middleware/userVerifier');



const router = express.Router();

// register route
router.post('/register', register);

// login route
router.post('/login', login);
router.post("/forget-pass", forgotPass);
router.post("/reset-pass", resetPass);

// test route
// router.get('/user', userVerifier, user);
router.get('/user',passport.authenticate('jwt', { session: false }), user);

module.exports = router;
