const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', process.env.CLIENT];
exports.corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origin provided in backend mismatched.Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE', // Add allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200,
};
