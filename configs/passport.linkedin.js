const passport = require('passport');
require('dotenv').config();
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

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
    new LinkedInStrategy(
        {
            clientID: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            callbackURL: process.env.LINKEDIN_CALLBACK,
            scope: ['r_emailaddress', 'r_liteprofile'],
            state: true
        },
        async (accessToken, refreshToken, profile, done) => {
            // done(null, profile);
            const email = profile.emails[0].value;
            console.log('email', email);
            console.log('profileData', profile);


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
                            // googleId: profile.id,
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
