// Import jsonwebtoken to verify authentication tokens
import jwt from "jsonwebtoken";

/**
 * optionalAuthMiddleware - Checks for authentication but doesn't require it
 * Unlike authMiddleware, this allows requests to proceed even without valid token
 * 
 * Use case: For features that work both for authenticated and anonymous users
 * Example: URL shortening works for everyone, but links to user account if logged in
 * 
 * Process:
 * 1. Try to extract token from cookie or Authorization header
 * 2. If no token, continue without authentication
 * 3. If token exists, try to verify it
 * 4. If valid, attach user data to request
 * 5. If invalid, continue without authentication (no error)
 * 6. Always proceed to next handler
 */
const optionalAuthMiddleware = async (req, res, next) => {
    // Try to get token from cookies or Authorization header
    const authHeader = req.cookies.authToken || req.header('Authorization');

    // If no token provided, continue without authentication
    // This is the key difference from authMiddleware
    if (!authHeader) {
        return next();
    }

    // Extract token, removing "Bearer " prefix if present
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    // If no token after extraction, continue without authentication
    if (!token) {
        return next();
    }

    try {
        // Try to verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // If valid, attach user data to request
        // Controllers can check if req.user exists to know if user is authenticated
        req.user = decode.user;
        next();
    } catch (error) {
        // Token verification failed, but that's okay for optional auth
        console.error("Token verification failed (optional):", error.message);
        
        // Continue without authentication - don't return error
        next();
    }
}

// Export middleware to use in routes
export default optionalAuthMiddleware;
