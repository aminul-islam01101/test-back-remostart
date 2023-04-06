const passport = require('passport');
const express = require('express');
const {
    register,
    login,
    user,
  
} = require('../controllers/auth.controller');

const router = express.Router();


// register route
router.post('/register', register);

// login route
router.post('/login', login);

// test route
router.get('/user', passport.authenticate('jwt', { session: false }), user);


module.exports = router;
