const MongoStore = require('connect-mongo');
const { mongoDB } = require('./db');

exports.sessionConfigs = {
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
};
