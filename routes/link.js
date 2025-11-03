// Import Express to create router
import express from "express";
// Import auth middleware (requires authentication for all routes)
import authMiddleware from "../middleware/authMiddleware.js";
// Import link management controller functions
import { getMyLinks, deleteLink, updateLink } from "../controllers/linkController.js";

// Create router instance
const router = express.Router();

/**
 * Link Management Routes
 * Base path: /api/links
 * All routes require authentication (authMiddleware)
 */

// GET /api/links/my-links - Get all URLs created by authenticated user
// Requires: Valid JWT token in cookie or Authorization header
// Response: { success, count, data: [array of URLs] }
router.get('/my-links', authMiddleware, getMyLinks);

// DELETE /api/links/:id - Delete a specific URL by ID
// Example: DELETE /api/links/507f1f77bcf86cd799439011
// Requires: Valid JWT token + URL must belong to user
// Response: { success, message }
router.delete('/:id', authMiddleware, deleteLink);

// PUT /api/links/:id - Update a specific URL's original destination
// Example: PUT /api/links/507f1f77bcf86cd799439011
// Request body: { originalUrl }
// Requires: Valid JWT token + URL must belong to user
// Response: { success, message, data: updatedURL }
router.put('/:id', authMiddleware, updateLink);

// Export router to be used in server.js
export default router;