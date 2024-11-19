const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (decodedToken.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: 'Admin access denied' });
        }

        next();
    } catch (error) {
        // If jwt expires so redirect to / page and
        if (error.name === 'TokenExpiredError' && error.message === 'jwt expired') {
            localStorage.removeItem('token');
            return res.redirect('/');
        }               

        console.error('Token verification error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = adminAuth;
