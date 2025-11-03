// Import Express to create router
import express from "express";
// Import URL controller functions
import { shortenUrl, generateQRCode } from "../controllers/urlController.js";
// Import optional auth middleware (allows both authenticated and anonymous users)
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";

// Create router instance
const router = express.Router();

/**
 * URL Routes
 * Base path: /api
 */

// POST /api/shorten - Create a shortened URL
// Uses optionalAuthMiddleware - works for both logged-in and anonymous users
// If user is logged in, URL will be linked to their account
// Request body: { longUrl }
// Response: { success, data: { shortUrl, originalUrl, longUrl, clicks } }
router.post('/shorten', optionalAuthMiddleware, shortenUrl);

// GET /api/qrcode/:shortUrl - Generate QR code for a shortened URL
// Example: /api/qrcode/aBc123XyZ9
// Response: { success, qrCode: <base64DataURL>, shortUrl, originalUrl }
router.get('/qrcode/:shortUrl', generateQRCode);

// Export router to be used in server.js
export default router;