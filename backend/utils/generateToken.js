const jwt = require('jsonwebtoken');

const generateTokens = (res, userId) => {
    // 1. Create Access Token (Valid for 15 minutes)
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m'
    });

    // 2. Create Refresh Token (Valid for 7 days)
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });

    // 3. Set Access Token Cookie
    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // 4. Set Refresh Token Cookie
    res.cookie('jwt_refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return accessToken;
};

module.exports = generateTokens;
