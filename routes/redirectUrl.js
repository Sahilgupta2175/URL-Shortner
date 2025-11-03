// Import Express to create router
import express from "express";
// Import redirect controller function
import { redirectToUrl } from "../controllers/urlController.js";

// Create router instance
const router = express.Router();

/**
 * Redirect Route
 * Base path: /s
 * 
 * This is the public-facing short URL route
 * When users visit /s/<shortCode>, they get redirected to the original URL
 */

// GET /s/:shortUrl - Redirect to original URL and track click
// Example: /s/aBc123XyZ9 redirects to https://google.com
// Also increments click counter for analytics
// Response: 301 redirect to original URL, or 404 if not found
router.get('/:shortUrl', redirectToUrl);

// Export router to be used in server.js
export default router;