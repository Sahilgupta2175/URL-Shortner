import jwt from "jsonwebtoken";

const optionalAuthMiddleware = async (req, res, next) => {
    const authHeader = req.cookies.authToken || req.header('Authorization');

    if (!authHeader) {
        // No token provided, continue without authentication
        return next();
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    if (!token) {
        return next();
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode.user;
        next();
    } catch (error) {
        console.error("Token verification failed (optional):", error.message);
        // Invalid token, but continue without authentication
        next();
    }
}

export default optionalAuthMiddleware;
