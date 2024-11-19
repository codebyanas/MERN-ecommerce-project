const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Remove 'Bearer ' prefix to get the actual token value
        const actualToken = token.split(' ')[1];

        const decodedToken = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decodedToken;

        next();
    } catch (error) {
        console.error('Token verification error from auth.js:', error);

        // Check if error is specifically a JWT verification error
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.redirect('/login');
        }

        // If jwt expires so redirect to / page and
        if (error.name === 'TokenExpiredError' && error.message === 'jwt expired') {
            localStorage.removeItem('token');
            return res.redirect('/login');
        }   

        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = authUser;
