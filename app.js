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
const MongoStore = require('connect-mongo');
const logger = require('./middleware/logger');
const { mongoDB } = require('./configs/db');
const { connectDataBase } = require('./configs/db');
const routes = require('./routes/routes');

require('dotenv').config();

// app.use(
//   cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
// );
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
            secure: true,
            sameSite: 'none',
        },
        // cookie: { secure: true },
    })
);
app.set('trust proxy', 1);

app.use(passport.initialize());
app.use(passport.session());

require('./configs/passport');
require('./configs/passport.google');
require('./configs/passport.linkedin');

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