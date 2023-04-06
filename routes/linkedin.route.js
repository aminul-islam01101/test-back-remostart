// const passport = require('passport');
// const express = require('express');
// const {
//     register,
//     login,
//     user,
//     googleCallback,
//     googleLoginSuccess,
// } = require('../controllers/auth.controller');

// const router = express.Router();
// const CLIENT_URL = 'http://localhost:3000/';

// router.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect(CLIENT_URL);
// });
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }

//     next()
// };

// router.get("/login/success", isAuthenticated, (req, res) => {
//     console.log(req.user);

//     if (req.user) {
//       res.status(200).json({
//         success: true,
//         message: "successfull",
//         user: req.user,

//       });
//     }
//   });

// router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

// router.get(
//     '/google/callback',
//     passport.authenticate('google', { session: false, failureRedirect: '/login' }),
//     googleCallback
// );

// module.exports = router;
const router = require('express').Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const passport = require('passport');
const User = require('../models/user.schema');
// const googleCallback =require('../controllers/auth.controller')

const CLIENT_URL = process.env.CLIENT;
// const CLIENT_URL = "http://localhost:3000";

router.get('/login/success', async (req, res) => {
    console.log(req.user);

    if (req.user) {
        const { email } = req.user;
        console.log(req.user);

        const userExist = await User.findOne({ email });
        const payload = {
            email: req.user.email,
            id: req.user._id,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' }); // AuthService.issueToken(req.user._id);
        return res.status(200).json({
            success: true,
            message: 'successfull',
            user: req.user,
            token: `Bearer ${token}`,
            role: userExist?.role,
            //   cookies: req.cookies
        });
    }
    res.send({
        success: false,
        message: 'unauthorized',

        //   cookies: req.cookies
    });
});
// router.get("/login/success", (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       success: true,
//       message: "successfull",
//       user: req.user,
//       //   cookies: req.cookies
//     });
//   }
// });

router.get('/login/failed', async(req, res) => {
    res.status(401).json({
        success: false,
        message: 'failure',
    });
});

router.get("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(`${CLIENT_URL}`);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE'  }));

router.get(
    '/linkedin/callback',
    passport.authenticate('linkedin', {
        // successRedirect: CLIENT_URL,
        failureRedirect: '/login/failed',
    }),
    (req, res) => {
        const payload = {
            email: req.user.email,
            id: req.user._id,
        };
        // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' });
        //   res.cookie('token', `Bearer ${token}`, );
        // res.cookie('userRole', req.user.role,);
        //   res.cookie('token', `Bearer ${token}`, { secure:true, sameSite: 'none' });
        // res.cookie('userRole', req.user.role, { secure:true,  sameSite: 'none' });
       
        // if (req.user.role === 'startup') {
        //     res.redirect(`${CLIENT_URL}/dashboard`);
        //     return;
        // }
        if (req.user.role === 'remoforce') {
            res.redirect(`${CLIENT_URL}/remoforce-dashboard`);
            return;
        }
        if (req.user.role === 'startup') {
            res.redirect(`${CLIENT_URL}/dashboard`);
            return;
        }
         res.redirect(CLIENT_URL);
    }
);

// router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

// router.get(
//   "/github/callback",
//   passport.authenticate("github", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

// router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

module.exports = router;
