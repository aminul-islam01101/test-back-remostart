// ...

const { verifyAccessToken, verifyRefreshToken, createToken } = require('../utils/jwtHelpers');

module.exports.roleVerifier =
    (...requiredRoles) =>
    async (req, res, next) => {
        try {
            // Get the access token from the authorization header
            const token = req.headers.authorization;
            const { refreshToken } = req.cookies;
            console.log('🌼 🔥🔥 file: roleVerifier.js:12 🔥🔥 req.cookies', req.cookies);


            if (!token) {
                res.status(401).send({
                    success: false,
                    user: null,
                    message: 'You are not authorized',
                });
                return;
            }

            try {
                // Verify the access token

                const accessToken = token.substring(7);

                const verifiedUser = verifyAccessToken(accessToken, process.env.JWT_SECRET);
                req.user = verifiedUser;
                console.log('🌼 🔥🔥 file: roleVerifier.js:28 🔥🔥 verifiedUser🌼', verifiedUser);

                if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
                    res.status(401).send({
                        success: false,
                        user: null,
                        message: 'Forbidden',
                    });
                    return;
                }
                next();
            } catch (accessTokenError) {
                // If the access token is expired, try refreshing it with the refresh token

                // const { refreshToken } = req.cookies;

                if (!refreshToken) {
                    res.status(401).send({
                        success: false,
                        user: null,
                        message: 'You are not authorized',
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

                    const { email, id, role } = verifiedRefreshToken;
                    if (requiredRoles.length && !requiredRoles.includes(role)) {
                        res.status(401).send({
                            success: false,
                            user: null,
                            message: 'Forbidden',
                        });
                        return;
                    }
                    // Create a new access token using the refresh token's payload
                    const newAccessToken = createToken(
                        { email, id, role },
                        process.env.JWT_SECRET,
                        process.env.ACCESS_TOKEN_EXPIRY
                    );

                    // Send the new access token in the response
                    res.cookie('access_token', `Bearer ${newAccessToken}`, {
                        secure: true,
                        sameSite: 'none',
                        //  httpOnly: true
                    });

                    req.user = verifiedRefreshToken;
                    console.log('🌼 🔥🔥 file: roleVerifier.js:84 🔥🔥 req.user🌼', req.user);

                    
                    next();
                } catch (refreshTokenError) {
                    res.status(401).send({
                        success: false,
                        user: null,
                        message: 'You are not authorized',
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    };
