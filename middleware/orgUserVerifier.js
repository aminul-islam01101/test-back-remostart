// ...

const { verifyAccessToken, verifyRefreshToken, createToken } = require('../utils/jwtHelpers');

const orgUserVerifier = async (req, res, next) => {
    // Get the access token from the authorization header
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({
            success: false,
            user: null,
        });
    }

    try {
        // Verify the access token

        const accessToken = token.substring(7);

        const verifiedUser = verifyAccessToken(accessToken, process.env.JWT_SECRET);
        req.user = { ...verifiedUser, token };
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { orgUserVerifier };
