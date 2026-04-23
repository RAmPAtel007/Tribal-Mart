const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        // Bearer token support
        const decodedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
        
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
