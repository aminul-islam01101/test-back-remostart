require('dotenv').config();

const { Strategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const User = require('../models/user.schema');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(
    new Strategy(opts, (jwtPayload, done) => {
        User.findOne({ email: jwtPayload.email }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        });
    })
);
