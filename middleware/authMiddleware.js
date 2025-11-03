// Import jsonwebtoken to verify authentication tokens
import jwt from "jsonwebtoken";

/**
 * authMiddleware - Protects routes by verifying user authentication
 * This middleware REQUIRES authentication - request fails if no valid token
 * 
 * Process:
 * 1. Extract token from cookie or Authorization header
 * 2. Check if token exists
 * 3. Remove "Bearer " prefix if present
 * 4. Verify token using JWT secret
 * 5. Attach user data to request object
 * 6. Allow request to proceed to next handler
 * 
 * If any step fails, request is rejected with 401 error
 */
const authMiddleware = async (req, res, next) => { 
    // Try to get token from cookies first, then from Authorization header
    // Supports both cookie-based and header-based authentication
    const authHeader = req.cookies.authToken || req.header('Authorization');

    // If no token found, deny access
    if(!authHeader) {
        return res.status(401).json({success: false, error: 'Authorization denied.'});
    }

    // Extract token, removing "Bearer " prefix if it exists
    // Header format: "Bearer <token>" or just "<token>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    // Double check token exists after extraction
    if(!token) {
        return res.status(401).json({success: false, error: 'Authorization denied.'});
    }

    try {
        // Verify token is valid and not expired
        // Throws error if token is invalid, expired, or tampered with
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user data from token to request object
        // This allows controllers to access user information
        req.user = decode.user;
        
        // Continue to next middleware or controller
        next();
    } catch (error) {
        // Token verification failed - invalid or expired token
        console.error("Token Verification failed.", error.message);
        res.status(401).json({success: false, error: 'Token is not valid.'});
    }
}

// Export middleware to use in routes
export default authMiddleware;