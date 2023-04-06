const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GithubStrategy = require('passport-github2').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
require('dotenv').config();

const GOOGLE_CLIENT_ID = 'your id';
const GOOGLE_CLIENT_SECRET = 'your id';

// GITHUB_CLIENT_ID = 'your id';
// GITHUB_CLIENT_SECRET = 'your id';

// FACEBOOK_APP_ID = 'your id';
// FACEBOOK_APP_SECRET = 'your id';
const User = require('../models/user.schema');
const RemoForce = require('../models/remoForce.schema');

// console.log(process.env.GOOGLE_CALLBACK);

passport.serializeUser((user, done) => {
    done(null, user);
});

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) =>
        // Whatever we return goes to the client and binds to the req.user property
        done(null, user)
    );
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK,
        },
        async (accessToken, refreshToken, profile, done) => {
            // done(null, profile);
            const email = profile.emails[0].value;
            console.log('email', email);

            try {
                // Check if user already exists in the database
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    return done(null, existingUser);
                }
                const newRemoForce = new RemoForce({
                    fullName: profile.displayName,
                    email,
                });

                await newRemoForce
                    .save()
                    // .then((remoforce) => console.log(remoforce))
                    .then(async () => {
                        const newRemoForceUser = await RemoForce.findOne({ email });

                        const newUser = new User({
                            fullName: profile.displayName,
                            signInMethod: 'google',
                            googleId: profile.id,
                            email,
                            ventureId: newRemoForceUser._id,

                            role: 'remoforce',
                        });

                        await newUser.save();
                        console.log(newUser);
                        return done(null, newUser);
                    });
            } catch (error) {
                // console.log(err);
                done(error, null);
            }
        }
    )
);
