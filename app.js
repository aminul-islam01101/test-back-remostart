// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const cors = require('cors');
// const passport = require('passport');

// const logger = require('./middleware/logger');
// const routes = require('./routes/routes');

// require('dotenv').config();

// const app = express();

// app.use([
//     cors(),
//     express.json(),
//     express.urlencoded({ extended: true }),
//     passport.initialize(),
//     logger,
// ]);

// require('./configs/passport');

// // api route baseCamp
// app.use(routes);

// // wrong path error route
// app.use((req, res) => {
//     res.status(404).send('404 error! url does not exist');
// });

// // server error route
// app.use((err, req, res, next) => {
//     if (res.headerSent) {
//         return next(err);
//     }

//     return res.status(500).send('Something broke in server!');
// });

// module.exports = app;
const cookieSession = require('cookie-session');
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const http = require('http');

const passport = require('passport');

const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const logger = require('./middleware/logger');
const { mongoDB } = require('./configs/db');
const { connectDataBase } = require('./configs/db');
const routes = require('./routes/routes');
const { verifyToken } = require('./utils/jwtHelpers');
const { userVerifier } = require('./middleware/userVerifier');

require('dotenv').config();

// app.use(
//   cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
// );
app.use(cookieParser())
app.use(
    cors({
        origin: process.env.CLIENT,
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
        
    })
);
app.use([express.json(), express.urlencoded({ extended: true }), logger]);
app.use(
    session({
        secret: 'cat',
        resave: true,
        saveUninitialized: true,

        store: MongoStore.create({
            mongoUrl: mongoDB,
            collectionName: 'sessions',
        }),
        cookie: {
            maxAge: 2419200000,
            // production only
            // secure: true
            // sameSite: 'none',
        },
    })
);
app.set('trust proxy', 1);

app.use(passport.initialize());
app.use(passport.session());

require('./configs/passport');
require('./configs/passport.google');
require('./configs/passport.linkedin');



// tester
// app.get('/', (req, res) => {
//     try {
//         const verifiedToken = verifyToken(
//             '20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtaW51bC5pc2xhbTAxMTAxQGdtYWlsLmNvbSIsImlkIjoiNjQwODNhZGY1MzEzMDkzYTRkNzAyMzM4IiwiaWF0IjoxNjg4NTcwODE3LCJleHAiOjE2ODg1NzA4Mzd9.agNw2MtqCD2GZHTk7NGg6HwMAAZ-FYEL-iH-PcKXKvs',
//             // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtaW51bC5pc2xhbTAxMTAxQGdtYWlsLmNvbSIsImlkIjoiNjQwODNhZGY1MzEzMDkzYTRkNzAyMzM4IiwiaWF0IjoxNjg4NTcyMTU1LCJleHAiOjE2ODg3NDQ5NTV9.WM2HsOO4yE72pUwCaVFyuillSe08ueZ_g3Dsgi-pukU',
//             process.env.JWT_SECRET
//         );
//         console.log('🚀 ~ file: app.js:105 ~ verifiedToken:', verifiedToken);
//     } catch (error) {
//        console.log("🚀 ~ file: app.js:110 ~ app.get ~ error:", error)
       
//     }
// });

// app.get("/",  async (req, res, next) => {
//     const hello='hello '
//     console.log("🚀 ~ file: userVerifier.js:72 ~ userVerifier ~ hello:", hello)
//     next()
    
//     }, (req, res) => {
//     res.status(201).send('hello');
// });

app.use(routes);
// wrong path error route
app.use((req, res) => {
    res.status(404).send('404 error! url does not exist');
});

// server error route
app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }

    return res.status(500).send('Something broke in server!');
});
module.exports = app;
