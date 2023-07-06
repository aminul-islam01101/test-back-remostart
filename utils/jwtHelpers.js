const jwt = require('jsonwebtoken');

const createToken = (payload, secret, expireTime) =>
    jwt.sign(payload, secret, {
        expiresIn: expireTime,
    });

const verifyAccessToken = (token, secret) => jwt.verify(token, secret);

const verifyRefreshToken = (token, secret) => jwt.verify(token, secret);

module.exports = {
    createToken,
    verifyAccessToken,
    verifyRefreshToken,
};
