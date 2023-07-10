const logger = (req, res, next) => {
    console.log(
        `
🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴         
Req-method:${req.method} - Req-url:${req.url} - Req-path:${req.headers.origin || 'server origin'} - Time-of-req: ${
            new Date().toLocaleTimeString().underline
        }
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥       
        `.bgYellow.black
    );
    next();
};
module.exports = logger;
