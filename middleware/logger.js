const logger = (req, res, next) => {
    console.log(
        `
🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴         
Req-method:${req.method} - Req-url:${req.url} - Time-of-req: ${
            new Date().toLocaleTimeString().underline
        }
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥       
        `.bgYellow.black
    );
    next();
};
module.exports = logger;
