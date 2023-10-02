// ...

const { verifyAccessToken, verifyRefreshToken, createToken } = require('../utils/jwtHelpers');

const userVerifier = async (req, res, next) => {
    try {
        // Get the access token from the authorization header
        const token = req.headers.authorization;

        if (!token) {
            res.status(401).send({
                success: false,
                user: null,
            });
            return;
        }

        try {
            // Verify the access token

            const accessToken = token.substring(7);

            const verifiedUser = verifyAccessToken(accessToken, process.env.JWT_SECRET);
            req.user = verifiedUser;
            next();
        } catch (accessTokenError) {
            // If the access token is expired, try refreshing it with the refresh token

            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                res.status(401).send({
                    success: false,
                    user: null,
                });
                return;
            }
            const refreshTokenWithoutBearer = refreshToken.substring(7);
            // const refreshTokenWithoutBearer = refreshToken.substring(7);

            try {
                // Verify the refresh token
                const verifiedRefreshToken = verifyRefreshToken(
                    refreshTokenWithoutBearer,
                    process.env.REFRESH_TOKEN_SECRET
                );

                const { email, id } = verifiedRefreshToken;
                // Create a new access token using the refresh token's payload
                const newAccessToken = createToken(
                    { email, id },
                    process.env.JWT_SECRET,
                    process.env.ACCESS_TOKEN_EXPIRY
                );

                // Send the new access token in the response
                res.cookie('token', `Bearer ${newAccessToken}`, {
                    secure: true,

                    sameSite: 'none',
                    //  httpOnly: true
                });

                req.user = verifiedRefreshToken;
                next();
            } catch (refreshTokenError) {
                res.status(401).send({
                    success: false,
                    user: null,
                });
            }
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { userVerifier };
