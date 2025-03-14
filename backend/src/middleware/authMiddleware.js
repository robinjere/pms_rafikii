const jwt = require('jsonwebtoken');

class AuthMiddleware {
    authenticate(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new Error('No authorization header');
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new Error('No token provided');
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedToken;
            next();
        } catch (error) {
            const err = new Error('Authentication failed');
            err.statusCode = 401;
            next(err);
        }
    }

    requireRole(role) {
        return (req, res, next) => {
            if (!req.user || req.user.role !== role) {
                const error = new Error('Insufficient permissions');
                error.statusCode = 403;
                return next(error);
            }
            next();
        };
    }
}

module.exports = AuthMiddleware;
