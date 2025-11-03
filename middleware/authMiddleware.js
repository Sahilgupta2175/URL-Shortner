import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => { 
    const authHeader = req.cookies.authToken || req.header('Authorization');
    console.log("Auth header:", authHeader);

    if(!authHeader) {
        return res.status(401).json({success: false, error: 'Authorization denied.'});
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    console.log('Token: ', token);

    if(!token) {
        return res.status(401).json({success: false, error: 'Authorization denied.'});
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode.user;
        next();
    } catch (error) {
        console.error("Token Verification failed.", error.message);
        res.status(401).json({success: false, error: 'Token is not valid.'});
    }
}

export default authMiddleware;