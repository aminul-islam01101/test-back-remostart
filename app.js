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

const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('./middleware/logger');
const routes = require('./routes/routes');
const { corsOptions } = require('./configs/corsConfigs');
const { sessionConfigs } = require('./configs/sessionConfigs');
require('dotenv').config();

// app.use(
//   cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
// );

// app.use(
//     cors({
//         origin: process.env.CLIENT,
//         methods: 'GET,POST,PUT,DELETE',
//         credentials: true,
//     })
// );

app.use([
    cors(corsOptions),
    cookieParser(),
    express.static(path.join(__dirname, '/public')),
    express.json(),
    express.urlencoded({ extended: true }),
    logger,
    session(sessionConfigs),
]);
// serve static files

// app.use(
//     session({
//         secret: 'cat',
//         resave: true,
//         saveUninitialized: true,

//         store: MongoStore.create({
//             mongoUrl: mongoDB,
//             collectionName: 'sessions',
//         }),
//         cookie: {
//             maxAge: 50000,
//             // maxAge: 2419200000,
//             // production only
//             // secure: true
//             // sameSite: 'none',
//         },
//     })
// );
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
// app.get('^/$|/index(.html)?', (_req, res) => {
//     // res.send('test server is running');
//      res.sendFile(path.join(__dirname, 'views', 'index.html'));
//     });

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

    console.log('🌼 🔥🔥 file: app.js:173 🔥🔥 app.use 🔥🔥 err.name🌼', err.name);
    console.log('🌼-------------------------------------🌼');
    console.log('🌼 🔥🔥 file: app.js:173 🔥🔥 app.use 🔥🔥 err.message🌼', err.message);
    console.log('🌼-------------------------------------🌼');

    console.log('🌼 🔥🔥 file: app.js:178 🔥🔥 app.use 🔥🔥 err.stack🌼', err.stack);
    console.log('🌼 --------------------------------------🌼');

    return res.status(500).send('Something broke in server!');
});
module.exports = app;
