import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.header('auth-token');
    console.log(token);

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